import { Module } from '@nestjs/common';
import { ProviderModule } from 'src/core/provider/provider.module';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionsService } from './subscription.service';

@Module({
  imports: [ProviderModule, UsersModule],
  providers: [SubscriptionsService],
  controllers: [SubscriptionController],
  exports: [SubscriptionsService]
})
export class SubscriptionModule {}
