import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '../categories/categories.service';
import { S3ManagerService } from '../core/aws-manager/aws-s3/s3-manager.service';
import { ContentsController } from './contents.controller';
import { ContentsService } from './contents.service';

describe('ContentsController', () => {

  let s3Svc: S3ManagerService;
  let contentsSvc: ContentsService;
  let categoriesSvc: CategoriesService;

  let controller: ContentsController;

  beforeEach(async () => {
    s3Svc = new S3ManagerService(null);
    contentsSvc = new ContentsService(null);
    categoriesSvc = new CategoriesService();

    controller = new ContentsController(s3Svc, contentsSvc, categoriesSvc);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getContentsById', () => {
    it('should return content', async () => {
      const result = { 
        data: {
          id: 1,
          userId: 1,
          email: 'test-user@podcast-hk.com',
        
          title: 'test-user',
          description: 'test-user',
        
          duration: 12335,
          mediaType: 'audio',
          source: 'src/test.mp3',
        
          categories: [],
          tags: [],
        
          ord: 1,
          createdAt: 1640569000,
        } 
      };

      jest.spyOn(contentsSvc, 'getContentById').mockImplementation(() => {
        return Promise.resolve({
          id: 1,
          userId: 1,
          email: 'test-user@podcast-hk.com',
        
          title: 'test-user',
          description: 'test-user',
        
          duration: 12335,
          mediaType: 'audio',
          source: 'src/test.mp3',
        
          categories: [],
          tags: [],
        
          ord: 1,
          createdAt: 1640569000,
        });
      });

      expect((await controller.getContentById(1)).data).toEqual(result.data);
    });
  });

  describe('getContents', () => {
    it('should return contents', async () => {
      const result = { 
        data: [{
          id: 1,
          userId: 1,
          email: 'test-user@podcast-hk.com',
        
          title: 'test-user',
          description: 'test-user',
        
          duration: 12335,
          mediaType: 'audio',
          source: 'src/test.mp3',
        
          categories: [],
          tags: [],
        
          ord: 1,
          createdAt: 1640569000,
        }] 
      };

      jest.spyOn(contentsSvc, 'getAllContents').mockImplementation(() => Promise.resolve([{
        id: 1,
        userId: 1,
        email: 'test-user@podcast-hk.com',
      
        title: 'test-user',
        description: 'test-user',
      
        duration: 12335,
        mediaType: 'audio',
        source: 'src/test.mp3',
      
        categories: [],
        tags: [],
      
        ord: 1,
        createdAt: 1640569000,
      }]));

      expect((await controller.getContents(1640569000, 1640569002)).data).toEqual(result.data);
    })
  })

  describe('updateContentMedia', () => {
    it('should update content media', async () => {
      jest.spyOn(contentsSvc, 'updateContentMedia').mockImplementation(() => Promise.resolve({
        id: 1,
        userId: 1,
        email: 'test-user@podcast-hk.com',
      
        title: 'test-user',
        description: 'test-user',
      
        duration: 12335,
        mediaType: 'audio',
        source: 'src/test.mp3',
      
        categories: [],
        tags: [],
      
        ord: 1,
        createdAt: 1640569000,
      }));

      const req = {
        body: {
          data: { }
        }
      }

      const res = { status(httpStatus: HttpStatus) { } }

      const statusReturn = jest.spyOn(res, 'status');

      await controller.updateContentMedia(req, res)
      expect(statusReturn).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
    })
  });

  describe('updateContentInfo', () => {
    it('should update contents', async () => {
      jest.spyOn(contentsSvc, 'updateContentInfo').mockImplementation(() => Promise.resolve({
        id: 1,
        userId: 1,
        email: 'test-user@podcast-hk.com',
      
        title: 'test-user',
        description: 'test-user',
      
        duration: 12335,
        mediaType: 'audio',
        source: 'src/test.mp3',
      
        categories: [],
        tags: [],
      
        ord: 1,
        createdAt: 1640569000,
      }));

      const req = {
        body: {
          data: { }
        }
      }

      const res = { status(httpStatus: HttpStatus) { } }

      const statusReturn = jest.spyOn(res, 'status');

      await controller.updateContentInfo(req, res)
      expect(statusReturn).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
    })
  });

});
