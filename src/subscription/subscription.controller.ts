import { 
  ConflictException, Controller, Get, 
  NotFoundException, ParseIntPipe, Post, Query, Req } 
  from '@nestjs/common';
import { handleUnknowError } from '../core/utils/api-err.helper';
import { wrapInDataObject } from '../core/utils/dto-format.helper';
import { UsersService } from '../users/users.service';
import { SubscriptionsService } from '../subscription/subscription.service';

@Controller('subscriptions')
export class SubscriptionController {

  constructor(
    private readonly subscriptionsSvc: SubscriptionsService,
    private readonly usersSvc: UsersService) { }

  @Get()
  async getAllSubscribers(@Query('userId', ParseIntPipe) id) {
    const datas = ( await this.subscriptionsSvc.getAllSubscribers(id).catch(err => {
      handleUnknowError(err);
    } )) as { subscriberId: number }[];
  
    return wrapInDataObject(
      datas.map(data => ({
        subscriberId: data.subscriberId
      })));
  }

  @Post() 
  async createSubscription(@Req() req) {
    const { userId, subscriberId } = req.body.data;

    if(!(await this.usersSvc.isUserExisted(userId))) { throw new NotFoundException(); }
    if(await this.subscriptionsSvc.isASubscriber(userId, subscriberId)) { throw new ConflictException(); }
    try {
      const data = {
        id: (await this.subscriptionsSvc.createSubscription(
          { userId: userId, subscriberId: subscriberId })).id
      }

      return wrapInDataObject(data);
    }catch (err) {
      handleUnknowError(err);
    }
  }

}


