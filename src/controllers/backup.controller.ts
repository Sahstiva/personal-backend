import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import { BackupService } from '../services/backup.service';
import { Response } from 'express';
import { ApiKeyGuard } from '../guards/api-key.guard';

@Controller('/backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @UseGuards(ApiKeyGuard)
  @Get('/backup')
  async backup(@Res() response: Response) {
    try {
      const result = await this.backupService.backupDatabase();
      return response.status(HttpStatus.OK).send(result);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @UseGuards(ApiKeyGuard)
  @Get('/restore')
  async restore(@Res() response: Response) {
    try {
      const result = await this.backupService.restoreDatabase();
      return response.status(HttpStatus.OK).send(result);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
