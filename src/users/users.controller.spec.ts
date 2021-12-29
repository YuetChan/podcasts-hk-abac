import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {

  let controller: UsersController;
  let usersSvc: UsersService;

  beforeEach(async () => {
    usersSvc = new UsersService(null);
    controller = new UsersController(usersSvc);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get user info', () => {
    it('should return user info', async () => {
      const result = {
        data: {
          id: 1,
          name: 'test-user',
          description: 'test-user',
          email: 'test-user@podcast-hk.com',
          role: 'admin',
          subscriptions: [{
            id: 1,
            userId: 1,
            subscriberId: 2
          },{
            id: 1,
            userId: 3,
            subscriberId: 2
          }]
        }
      };

      jest.spyOn(usersSvc, 'getUserById').mockImplementation(() => Promise.resolve({
        id: 1,
        name: 'test-user',
        description: 'test-user',
        email: 'test-user@podcast-hk.com',
        role: 'admin',
        subscriptions: [{
          id: 1,
          userId: 1,
          subscriberId: 2
        },{
          id: 1,
          userId: 3,
          subscriberId: 2
        }],
      }));

      expect((await controller.getUserInfo(2)).data).toEqual(result.data);
    });

    it('should update user info', async () => {
      const updateUserInfo = jest.spyOn(usersSvc, 'updateUserInfo').mockImplementation( () => Promise.resolve({
        id: 1,
        name: 'test-user',
        description: 'test-user',
        email: 'test-user@podcast-hk.com',
        role: 'admin',
        subscriptions: [{
          id: 1,
          userId: 1,
          subscriberId: 2
        },{
          id: 1,
          userId: 3,
          subscriberId: 2
        }],
      }));

      const req = {
        body: {
          data : {}
        }
      }
      
      const res = { status (status: HttpStatus): void { } }

      const statusReturn = jest.spyOn(res, 'status');

      await controller.updateUserInfo(req, res, 2);
      expect(updateUserInfo).toHaveBeenCalled();
      expect(statusReturn).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
    });

  })


});
