import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';

import { Experience, ExperienceSchema } from '../schemas/experience.schema';
import { ExperienceService } from '../services/experience.service';
import { ExperienceController } from '../controllers/experience.controller';

import { About, AboutSchema } from '../schemas/about.schema';
import { AboutController } from '../controllers/about.controller';
import { AboutService } from '../services/about.service';

import { User, UserSchema } from '../schemas/user.schema';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';

import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { MapperService } from '../services/mapper.service';

import { BackupController } from '../controllers/backup.controller';
import { BackupService } from '../services/backup.service';
import { TokenService } from '../services/token.service';

import { ResponseMiddleware } from '../middlewares/response.middleware';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { RequestContextService } from '../services/request-context.service';

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL,
    }),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB_URL, {
      dbName: process.env.DATABASE_NAME,
    }),
    MongooseModule.forFeature([
      { name: Experience.name, schema: ExperienceSchema },
      { name: About.name, schema: AboutSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [
    AppController,
    AboutController,
    ExperienceController,
    UserController,
    BackupController,
  ],
  providers: [
    AppService,
    AboutService,
    ExperienceService,
    UserService,
    TokenService,
    MapperService,
    BackupService,
    RequestContextService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'user/login', method: RequestMethod.POST },
        { path: '(.*)', method: RequestMethod.GET },
      )
      .forRoutes(AboutController, UserController);
    consumer.apply(ResponseMiddleware).forRoutes(UserController);
  }
}
