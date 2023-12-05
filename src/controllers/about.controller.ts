import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  Res,
  HttpException,
} from '@nestjs/common';
import { AboutService } from '../services/about.service';
import { About } from '../schemas/about.schema';
import { CreateAboutDto, UpdateAboutDto } from '../dto/about.dto';
import { Response } from 'express';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  async getAll(@Res() response: Response) {
    try {
      const abouts = await this.aboutService.findAll();
      return response.status(HttpStatus.OK).json(abouts);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getOne(@Param('id') id: string, @Res() response: Response) {
    try {
      const about = await this.aboutService.findOne(id);
      return response.status(HttpStatus.OK).json(about);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async create(@Body() aboutData: CreateAboutDto, @Res() response: Response) {
    try {
      const newAbout = await this.aboutService.create(aboutData);
      return response.status(HttpStatus.CREATED).json(newAbout);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() aboutData: UpdateAboutDto,
    @Res() response: Response,
  ) {
    try {
      const updatedAbout = await this.aboutService.update(id, aboutData);
      return response.status(HttpStatus.OK).json(updatedAbout);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() response: Response) {
    try {
      await this.aboutService.delete(id);
      return response
        .status(HttpStatus.OK)
        .json({ message: 'Deleted successfully' });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
