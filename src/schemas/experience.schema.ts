import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ExperienceItem, ExperienceItemSchema } from './experienceItem.schema';
import { About } from './about.schema';

@Schema()
export class Experience extends About {
  @Prop({ type: [ExperienceItemSchema], required: true })
  experienceItem: ExperienceItem[];
}

export const ExperienceSchema = SchemaFactory.createForClass(Experience);
