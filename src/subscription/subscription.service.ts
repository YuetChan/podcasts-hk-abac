import { Injectable } from "@nestjs/common";
import { PrismaService } from "../core/provider/prisma.service";

@Injectable()
export class SubscriptionsService {

  constructor(private readonly prismaSvc: PrismaService) { }

  async getAllSubscribers(userId: number): Promise<Subscription[]> {
    return await this.prismaSvc.subscription.findMany({ where: { userId: userId }});
  }

  async isASubscriber(userId: number, subscriberId: number) {
    return (await this.prismaSvc.subscription.findFirst({ 
      where: { userId: userId, subscriberId: subscriberId } })) !== null;
  }

  async createSubscription(subscription: Subscription): Promise<Subscription> {
    return await this.prismaSvc.subscription.create({
      data: {
        user: { connect: { id: subscription.userId } },
        subscriberId: subscription.subscriberId
      }
    });
  }

}

export class Subscription {
  id?: number
  userId: number
  subscriberId: number
}