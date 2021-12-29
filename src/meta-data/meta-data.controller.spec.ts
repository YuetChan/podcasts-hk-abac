import { HttpStatus } from '@nestjs/common';
import { CategoriesService } from '../categories/categories.service';
import { TagsService } from '../tags/tags.service';
import { MetaDataController } from './meta-data.controller';

describe('MetaDataController', () => {

  let categoriesSvc; CategoriesService;
  let tagsSvc: TagsService;
  let controller: MetaDataController;

  beforeEach(async () => {
    categoriesSvc = new CategoriesService();
    tagsSvc = new TagsService(null, null);
    controller = new MetaDataController(categoriesSvc, tagsSvc);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const result = {
        data: [
          'game', 'anime', 
          'finance', 'news', 'politic',  
          'technology',
          'casual', 'travel', 'entertainment'
        ]
      };
  
      jest.spyOn(categoriesSvc, 'getAllCategories').mockImplementation(() => {
        return [
          'game', 'anime', 
          'finance', 'news', 'politic',  
          'technology',
          'casual', 'travel', 'entertainment'
        ];
      });
  
      expect(controller.getAllCategories().data).toEqual(result.data);
    });

  });

  // describe('getAllTags', () => {
  //   it('should return tags by content id', async () => {
  //     const result = {
  //       data: [
  //         'rts', 'ai'
  //       ]
  //     };
  
  //     jest.spyOn(tagsSvc, 'getAllTags').mockImplementation(() => {
  //       return Promise.resolve({
  //         tags: [
  //           'rts', 'ai'
  //         ]
  //       });
  //     });
  
  //     expect((await controller.getAllTags(1)).data).toEqual(result.data);
  //   });
  // })

  describe('updateOrCreateTags', () => {
    it('update or create tags', async () => {
      const req = {
        body: {
          data: { }
        }
      }

      const res = { status(httpStatus: HttpStatus) { } }

      jest.spyOn(res, 'status');
      jest.spyOn(tagsSvc, 'updateOrCreateTags').mockImplementation(() => Promise.resolve(null));

      await controller.updateOrCreateTags(req, res, 1);

      expect(await tagsSvc.updateOrCreateTags).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
    })
  })

});
