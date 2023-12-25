import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.header('Authorization').split(' ')[1];
      const token = this.tokenService.verifyToken(authHeader);
      next();
    } catch (error: any) {
      console.log(error?.message);
      throw new HttpException(error?.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
