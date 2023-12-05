import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Experience, ExperienceSchema } from '../schemas/experience.schema';
import { About, AboutSchema } from '../schemas/about.schema';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { ExperienceService } from '../services/experience.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB_URL, {
      dbName: process.env.DATABASE_NAME,
    }),
    MongooseModule.forFeature([
      { name: Experience.name, schema: ExperienceSchema },
      { name: About.name, schema: AboutSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, AppService, ExperienceService],
})
export class AppModule {}
