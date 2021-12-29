import { SubscriptionController } from './subscription.controller';
import { SubscriptionsService } from './subscription.service';
import { UsersService } from '../users/users.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('SubscriptionController', () => {
  
  let controller: SubscriptionController;
  let subscriptionsSvc: SubscriptionsService;
  let usersSvc: UsersService;

  beforeEach(async () => {
    subscriptionsSvc = new SubscriptionsService(null);
    usersSvc = new UsersService(null);
    controller = new SubscriptionController(subscriptionsSvc, usersSvc);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllSubscribers', () => {
    it('should return all subscribers of an user by the user id', async () => {
      const result = { data: [ { subscriberId: 2 }, { subscriberId: 3 }] };

      jest.spyOn(subscriptionsSvc, 'getAllSubscribers').mockImplementation(() => {
        return Promise.resolve([{
          userId: 1,
          subscriberId: 2
        }, {
          userId: 1,
          subscriberId: 3
        }]);
      });

      expect((await controller.getAllSubscribers(1)).data).toEqual(result.data);
    })
  });

  describe('createSubscription', () => {
    it('should create subscription', async () => {
      const result = { data: { id: 1 } };

      jest.spyOn(usersSvc, 'isUserExisted').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(subscriptionsSvc, 'isASubscriber').mockImplementation(() => Promise.resolve(false));

      jest.spyOn(subscriptionsSvc, 'createSubscription').mockImplementation(() => {
        return Promise.resolve({
          id: 1,
          userId: 1,
          subscriberId: 2
        });
      });

      expect(await controller.createSubscription({
        body: {
          data: {
            userId: 1,
            susbcriberId: 2
          }
        }
      })).toEqual(result);
    });

    it('should throw conflict exception when is a subscriber', async () => {
      jest.spyOn(usersSvc, 'isUserExisted').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(subscriptionsSvc, 'isASubscriber').mockImplementation(() => Promise.resolve(true));

      jest.spyOn(subscriptionsSvc, 'createSubscription').mockImplementation(() => {
        return Promise.resolve({
          id: 1,
          userId: 1,
          subscriberId: 2
        });
      });

      await expect(controller.createSubscription({
        body: {
          data: {
            userId: 1,
            susbcriberId: 2
          }
        }
      })).rejects.toThrow(ConflictException)
    });

    it('should throw not found exception when user does not existed', async () => {
      jest.spyOn(usersSvc, 'isUserExisted').mockImplementation(() => Promise.resolve(false));
      jest.spyOn(subscriptionsSvc, 'isASubscriber').mockImplementation(() => Promise.resolve(false));

      jest.spyOn(subscriptionsSvc, 'createSubscription').mockImplementation(() => {
        return Promise.resolve({
          id: 1,
          userId: 1,
          subscriberId: 2
        });
      });

      await expect(controller.createSubscription({
        body: {
          data: {
            userId: 1,
            susbcriberId: 2
          }
        }
      })).rejects.toThrow(NotFoundException)
    });

  });



  
});
