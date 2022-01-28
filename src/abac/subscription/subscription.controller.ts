import { Controller, Delete, Get, Post } from '@nestjs/common';

@Controller('subscriptions')
export class SubscriptionController {

  // done
  @Get()
  getSubscriptionByUserParams() { }

  // done
  @Post()
  createSubscription() { }

  // done
  @Delete(':id')
  deleteSUbscriptionById() { }

}
