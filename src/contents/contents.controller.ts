import {  
  Controller, Get, HttpStatus, InternalServerErrorException,
  Param, ParseIntPipe, Patch, Post, Req, Res, UnprocessableEntityException 
} from '@nestjs/common';
import { S3ManagerService } from '../core/aws-manager/aws-s3/s3-manager.service';
import { ContentsService } from './contents.service';
import { v4 as uuidv4 } from 'uuid';
import { CategoriesService } from '../categories/categories.service';
import { handleUnknowError } from '../core/utils/api-err.helper';
import { wrapInDataObject } from '../core/utils/dto-format.helper';

@Controller('contents')
export class ContentsController {

  constructor(
    private s3ManagerSvc: S3ManagerService, 
    private contentsSvc: ContentsService,
    private categoriesSvc: CategoriesService) { }

  @Get(':id')
  async getContentById(@Param('id', ParseIntPipe) id) { 
    const data = await this.contentsSvc.getContentById(id).catch(err => {
      handleUnknowError(err);
    }); 
    
    return wrapInDataObject(data);
  }

  @Get()
  async getContents(
    @Param('startDate', ParseIntPipe) startDate, 
    @Param('endDate', ParseIntPipe) endDate) { 
      const data = await this.contentsSvc.getAllContents(startDate, endDate).catch(err=> {
        handleUnknowError(err);
      });
      
      return wrapInDataObject(data); 
  }

  @Post()
  async uploadContent(@Req() req) {
    const content = req.body.data;
    const categories = content.categories;

    const isCategoiresValid = categories.filter(cat => !this.categoriesSvc.getAllCategories().includes(cat)).length < 1;
    if(!isCategoiresValid) { throw new UnprocessableEntityException(); }

    const userId = content.userId;
    const src = userId  + '/' + uuidv4();

    try {
      const fields = {};
      // await this.s3ManagerSvc.generatePresignedUrlForUpload('hk-podcast', src).catch(err => {
      //   console.debug(err);
      //   throw new InternalServerErrorException();
      // });
  
      const { id } = await this.contentsSvc.createContent({
        ... content, userId: userId, source: src, categories: categories
      })
  
      return { ... fields, id: id };
    }catch(err) {
      handleUnknowError(err);
    }
  }

  @Patch(':id')
  async updateContent(@Param('id', ParseIntPipe) id) {
    const src = (await this.contentsSvc.getContentById(id)).source;

    try {
      const fields = await this.s3ManagerSvc.generatePresignedUrlForUpload('talk-n-pod', src);
      return { ... fields, id: id };
    }catch(err) {
      handleUnknowError(err);
    }
  }

  @Patch(':id/info')
  async updateContentInfo(@Req() req, @Res() res) {
    await this.contentsSvc.updateContentInfo(req.body.data).catch(err => {
      handleUnknowError(err); 
    });

    res.status(HttpStatus.NO_CONTENT);
  }

  @Patch(':id/media')
  async updateContentMedia(@Req() req, @Res() res) {
    await this.contentsSvc.updateContentMedia(req.body.data).catch(err => {
      console.debug(err);
      throw new InternalServerErrorException(); 
    });

    res.status(HttpStatus.NO_CONTENT);
  }

}
