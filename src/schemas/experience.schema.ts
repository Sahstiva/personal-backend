import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ExperienceItem, ExperienceItemSchema } from './experienceItem.schema';
import { Document } from 'mongoose';

@Schema()
export class Experience extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ type: [ExperienceItemSchema], required: true })
  experienceItem: ExperienceItem[];
}

export const ExperienceSchema = SchemaFactory.createForClass(Experience);
