import { Controller, Get, HttpStatus, Put, Query, Req, Res } from '@nestjs/common';
import { CategoriesService } from '../categories/categories.service';
import { handleUnknowError } from '../core/utils/api-err.helper';
import { wrapInDataObject } from '../core/utils/dto-format.helper';
import { TagsService } from '../tags/tags.service';

@Controller('meta-data')
export class MetaDataController {

  constructor(
    private categoriesSvc: CategoriesService,
    private tagsSvc: TagsService) { }

  @Get('categories')
  getAllCategories() { 
    const data = this.categoriesSvc.getAllCategories();
    return wrapInDataObject(data); 
  }

  @Get('tags')
  async getAllTags(@Query('contentId') contentId) { 
    try {
      const data = (await this.tagsSvc.getAllTags(contentId)).tags;
      return wrapInDataObject(data);
    }catch(err) {
      handleUnknowError(err);
    }
  }

  @Put('tags')
  async updateOrCreateTags(@Req() req, @Res() res, @Query('contentId') contentId) {
    await this.tagsSvc.updateOrCreateTags(contentId, req.body.data).catch(err => {
      handleUnknowError(err);
    });

    res.status(HttpStatus.NO_CONTENT);
  }

}
