import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { LoginUserDto } from '../dto/user.dto';
import * as crypto from 'node:crypto';
import { MapperService } from './mapper.service';
import { TokenService } from './token.service';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import * as process from 'process';
import { UserProfile } from '../interfaces/interfaces';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mapperService: MapperService,
    private readonly tokenService: TokenService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async login(loginData: LoginUserDto): Promise<string> {
    const hash = crypto
      .createHash('sha256')
      .update(loginData.password)
      .digest('hex');
    const loggedUser = await this.userModel
      .findOne({ email: loginData.email, password: hash })
      .exec();
    if (loggedUser) {
      const sessionKey: string = crypto
        .generateKeySync('aes', { length: 128 })
        .export()
        .toString('hex');
      const key: string = this.cacheKey(loggedUser.email);
      const cachedTokens: string = await this.redis.get(key);
      const tokens: string[] = cachedTokens
        ? [...JSON.parse(cachedTokens), sessionKey]
        : [sessionKey];
      const redisTTL: number = parseInt(process.env.REDIS_TOKEN_TTL);
      this.redis.set(key, JSON.stringify(tokens), 'EX', redisTTL);
      return this.tokenService.issueJwt(
        this.mapperService.userProfileMapper(loggedUser),
        sessionKey,
      );
    } else {
      return null;
    }
  }
  private cacheKey(email: string): string {
    const prefix: string = process.env.REDIS_PREFIX;
    return `${prefix}:::${email}`;
  }
  private getTokenFromHeader(header: string): string {
    return header.split(' ')[1];
  }
  async logout(header: string): Promise<void> {
    const decodedToken = this.tokenService.verifyToken(
      this.getTokenFromHeader(header),
    );
    const key = this.cacheKey(decodedToken.email);
    this.redis.del(key);
  }
}
