import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum WorkLoad {
  FullTime = 'Full-time',
  PartTime = 'Part-Time',
  Project = 'Project',
}

@Schema()
export class ExperienceItem extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  companyLogo: string;

  @Prop({ required: true, enum: WorkLoad })
  load: WorkLoad;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ required: true })
  current: boolean;

  @Prop({ required: true })
  intro: string;

  @Prop([String])
  list: string[];

  @Prop([String])
  skills: string[];
}

export const ExperienceItemSchema =
  SchemaFactory.createForClass(ExperienceItem);
