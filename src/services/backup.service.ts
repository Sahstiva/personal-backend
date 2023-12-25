import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { exec } from 'node:child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as process from 'process';
import { ListObjectsV2Output } from 'aws-sdk/clients/s3';

const execAsync = promisify(exec);
const s3 = new AWS.S3();

@Injectable()
export class BackupService {
  private readonly bucketName = process.env.AWS_BUCKET_NAME;
  private readonly mongoUri = `mongodb://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_BASE}:${process.env.MONGO_DB_PORT}`;
  private readonly dbName = process.env.DATABASE_NAME;

  async backupDatabase(): Promise<string> {
    // Dump the database using mongodump
    const backupPath = `./backup-${this.dbName}.gz`;
    try {
      const { stdout, stderr } = await execAsync(
        `mongodump --authenticationDatabase=admin --uri='${this.mongoUri}/${this.dbName}' --archive='${backupPath}' --gzip`,
      );

      // Upload to S3
      const backupFile = fs.createReadStream(backupPath);
      const params = {
        Bucket: this.bucketName,
        Key: `backup-${this.dbName}-${Date.now()}.gz`,
        Body: backupFile,
      };

      const response = await s3.upload(params).promise();
      return `${stdout || stderr}\n\n${response?.Location}`;
    } catch (error: any) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async getLatestBackupFile(): Promise<string | null> {
    const params = {
      Bucket: this.bucketName,
      Prefix: `backup-${this.dbName}`,
    };

    try {
      const data: ListObjectsV2Output = await s3
        .listObjectsV2(params)
        .promise();
      const backups = data.Contents || [];

      if (backups.length === 0) return null;

      // Sort backups by LastModified date
      backups.sort((a, b) => {
        return (
          (b.LastModified as Date).getTime() -
          (a.LastModified as Date).getTime()
        );
      });

      // Return the key of the latest backup file
      return backups[0].Key || null;
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async restoreDatabase(): Promise<string> {
    const latestBackupKey = await this.getLatestBackupFile();
    if (!latestBackupKey) {
      throw new NotFoundException('No backup files found.');
    }
    try {
      // Download from S3
      const params = {
        Bucket: this.bucketName,
        Key: latestBackupKey,
      };
      const backupFile = s3.getObject(params).createReadStream();

      // Restore database using mongorestore
      const restorePath = `./restore-${Date.now()}.gz`;
      const fileWriteStream = fs.createWriteStream(restorePath);
      backupFile.pipe(fileWriteStream);

      return new Promise((resolve, reject) => {
        fileWriteStream.on('close', async () => {
          try {
            const { stdout, stderr } = await execAsync(
              `mongorestore  --authenticationDatabase=admin  --uri='${this.mongoUri}' --archive=${restorePath} --gzip`
            );
            resolve(stdout || stderr);
          } catch (error: any) {
            reject(error);
          }
        });
      });
    } catch (error: any) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
