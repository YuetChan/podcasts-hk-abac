import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class Ip {

  @Prop({ required: true })
  contentId: number;
  @Prop([String])
  tags: string[];

}

export type IpDocument = Ip & Document;
export const IpSchema = SchemaFactory.createForClass(Ip);