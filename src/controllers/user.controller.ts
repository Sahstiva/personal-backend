import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Res,
  HttpException,
  Req,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { LoginUserDto } from '../dto/user.dto';
import { response, Response } from 'express';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  async login(@Body() loginData: LoginUserDto, @Res() response: Response) {
    try {
      const token = await this.userService.login(loginData);
      return token
        ? response
            .header({ Authorization: token })
            .status(HttpStatus.OK)
            .json({ status: 'OK' })
        : response
            .status(HttpStatus.UNAUTHORIZED)
            .json({ status: 'Error', error: 'User or password not found' });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Post('/logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    await this.userService.logout(request.headers['authorization']);
    return response.status(HttpStatus.OK).json({ status: 'OK' });
  }
}
