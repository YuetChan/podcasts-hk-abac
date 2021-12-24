import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class Tag {

  @Prop({ required: true })
  contentId: number;
  @Prop([String])
  tags: string[];

}

export type TagDocument = Tag & Document;
export const TagSchema = SchemaFactory.createForClass(Tag);