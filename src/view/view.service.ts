import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { ContentsService } from 'src/contents/contents.service';
import { View as _View, ViewDocument } from './view.schema';

@Injectable()
export class ViewService {

  constructor(@InjectModel(_View.name)
  private readonly model: Model<ViewDocument>,
  private readonly contentsSvc: ContentsService) { }

  async createView(view: View) {
    const { contentId, ip } = view;
    if(await this.contentsSvc.getContentById(contentId)) {
      const createdAt = moment().unix();

      const uid = view.contentId + '_' + view.ip + '_' + createdAt;
      this.model.updateOne( 
        { uid: uid },
        { 
          $set: {
            uid: uid,
            contentId: contentId,
    
            viewedAt: view.viewedAt,
            leavedAt: view.leavedAt,
            ip: ip,
  
            createdAt: createdAt
          } 
        },
        { $upsert: true }
      );
      
      return true;
    }else {
      return false;
    }
  }
}

export interface View {
  contentId: number;

  leavedAt: number;
  viewedAt: number;

  ip: string;
}