import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentsModule } from 'src/contents/contents.module';
import { View as _View, ViewSchema } from './view.schema';
import { ViewService } from './view.service';
import { ViewController } from './view.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: _View.name, schema: ViewSchema }]),
    ContentsModule
  ],
  providers: [ViewService],
  exports: [ViewService],
  controllers: [ViewController]
})
export class ViewModule {}
