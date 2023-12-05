import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { About } from '../schemas/about.schema';
import { Model } from 'mongoose';
import { CreateAboutDto, UpdateAboutDto } from "../dto/about.dto";

@Injectable()
export class AboutService {
  constructor(@InjectModel(About.name) private aboutModel: Model<About>) {}

  async findAll(): Promise<About[]> {
    return this.aboutModel.find().exec();
  }

  async findOne(id: string): Promise<About> {
    return this.aboutModel.findById(id).exec();
  }

  async create(aboutData: CreateAboutDto): Promise<About> {
    const newAbout = new this.aboutModel(aboutData);
    return newAbout.save();
  }

  async update(id: string, aboutData: UpdateAboutDto): Promise<About> {
    return this.aboutModel
      .findByIdAndUpdate(id, aboutData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<any> {
    return this.aboutModel.findOneAndDelete({ _id: id }).exec();
  }
}
