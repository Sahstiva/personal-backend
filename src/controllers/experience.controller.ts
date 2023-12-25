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
import { ExperienceService } from '../services/experience.service';
import { Response } from 'express';
import {
  CreateExperienceDto,
  UpdateExperienceDto,
} from '../dto/experience.dto';

@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get()
  async getAll(@Res() response: Response) {
    try {
      const experiences = await this.experienceService.findAll();
      return response.status(HttpStatus.OK).json(experiences);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getOne(@Param('id') id: string, @Res() response: Response) {
    try {
      const experience = await this.experienceService.findOne(id);
      return response.status(HttpStatus.OK).json(experience);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async create(@Body() experienceData: CreateExperienceDto, @Res() response: Response) {
    try {
      const newExperience = await this.experienceService.create(experienceData);
      return response.status(HttpStatus.CREATED).json(newExperience);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() experienceData: UpdateExperienceDto,
    @Res() response: Response,
  ) {
    try {
      const updatedExperience = await this.experienceService.update(
        id,
        experienceData,
      );
      return response.status(HttpStatus.OK).json(updatedExperience);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() response: Response) {
    try {
      await this.experienceService.delete(id);
      return response
        .status(HttpStatus.OK)
        .json({ message: 'Deleted successfully' });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
