import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tag as _Tag, TagSchema } from './tag.schema';
import { ContentsModule } from 'src/contents/contents.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: _Tag.name, schema: TagSchema }]), 
    ContentsModule
  ],
  providers: [TagsService],
  exports: [TagsService]
})
export class TagsModule {}
