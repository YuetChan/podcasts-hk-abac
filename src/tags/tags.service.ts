import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContentsService } from '../contents/contents.service';
import { Tag as _Tag, TagDocument } from './tag.schema';

@Injectable()
export class TagsService {

	constructor(
    @InjectModel(_Tag.name) 
    private readonly model: Model<TagDocument>,
    private readonly contentsSvc: ContentsService) { }

  async getAllTags(contentId: number) { return await this.model.findOne({ contentId: contentId });}

  async updateOrCreateTags(contentId: number, tags: string[]) {
    if(this.contentsSvc.getContentById(contentId)) {
      return await this.model.updateOne(
        { contentId: contentId }, { $set: { tags: tags } }, { $upsert: true }); 
    }else {
      return null;
    }
  }

}
