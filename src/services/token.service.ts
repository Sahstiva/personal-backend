import { Injectable } from '@nestjs/common';
import * as process from 'process';
import * as jwt from 'jsonwebtoken';
import { UserProfile } from '../interfaces/interfaces';

@Injectable()
export class TokenService {
  issueJwt(user: UserProfile, sessionKey: string): string {
    return jwt.sign({ ...user, session: sessionKey }, process.env.JWT_KEY, {
      algorithm: 'HS512',
      expiresIn: 30 * 60,
    });
  }
  verifyToken(token: string): UserProfile {
    return jwt.verify(token, process.env.JWT_KEY, {
      algorithms: ['HS512'],
    }) as UserProfile;
  }
}
