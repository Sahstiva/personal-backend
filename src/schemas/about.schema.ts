import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class About extends Document {
  @Prop({ required: true })
  title: string;

  @Prop([String])
  text?: string[];
}

export const AboutSchema = SchemaFactory.createForClass(About);
