import { Controller, Get, HttpStatus, NotFoundException, Put, Query, Req, Res } from '@nestjs/common';
import { CategoriesService } from 'src/categories/categories.service';
import { handleUnknowError } from 'src/core/utils/api-err.helper';
import { wrapInDataObject } from 'src/core/utils/dto-format.helper';
import { TagsService } from 'src/tags/tags.service';

@Controller('meta-data')
export class MetaDataController {

  constructor(
    private categoriesSvc: CategoriesService,
    private tagsSvc: TagsService) { }

  @Get('categories')
  getAllCategories() { return this.categoriesSvc.getAllCategories(); }

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
