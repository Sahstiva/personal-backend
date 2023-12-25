import { Injectable } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { UserProfile } from '../interfaces/interfaces';

@Injectable()
export class MapperService {
  userProfileMapper(user: User): UserProfile {
    return {
      email: user?.email,
      isAdmin: user?.isAdmin,
    };
  }
}
