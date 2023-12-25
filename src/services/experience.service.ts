import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Experience } from '../schemas/experience.schema';
import { Model } from 'mongoose';
import {
  CreateExperienceDto,
  UpdateExperienceDto,
} from '../dto/experience.dto';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectModel(Experience.name) private experienceModel: Model<Experience>,
  ) {}

  async findAll(): Promise<Experience[]> {
    return this.experienceModel.find().exec();
  }

  async findOne(id: string): Promise<Experience> {
    return this.experienceModel.findById(id).exec();
  }

  async create(experienceData: CreateExperienceDto): Promise<Experience> {
    const newExperience = new this.experienceModel(experienceData);
    return newExperience.save();
  }

  async update(id: string, experienceData: UpdateExperienceDto): Promise<Experience> {
    return this.experienceModel
      .findByIdAndUpdate(id, experienceData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<any> {
    return this.experienceModel.findOneAndDelete({ _id: id }).exec();
  }
}
