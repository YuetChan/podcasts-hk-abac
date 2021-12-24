import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class View {

  @Prop({ required: true})
  uid: string;
  @Prop({ required: true })
  contentId: number;

  @Prop(Number)
  viewedAt: number;
  @Prop(Number)
  leavedAt: number;
  @Prop( {required: true} )
  ip: string;

  @Prop(Number)
  createdAt: number;

}

export type ViewDocument = View & Document;
export const ViewSchema = SchemaFactory.createForClass(View);