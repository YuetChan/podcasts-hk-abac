import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleOauthModule } from './core/authentication/google-oauth/google-oauth.module';
import { JwtAuthModule } from './core/authentication/jwt/jwt-auth.module';
import { UsersModule } from './users/users.module';
import { ContentsModule } from './contents/contents.module';
import { RegistrationModule } from './registration/registration.module';
import { ProviderModule } from './core/provider/provider.module';
import { JwtAuthMiddleware } from './core/middleware/security/jwt-auth.middleware';
import { UsersController } from './users/users.controller';
import { QuotaLimitMiddleware } from './core/middleware/resources/quota-limit.middleware';
import { ContentsController } from './contents/contents.controller';
import { AwsManagerModule } from './core/aws-manager/aws-manager.module';
import { ContentsAbacMiddleware } from './core/middleware/resources/contents-abac.middleware';
import { FilterModule } from './core/middleware/filter.module';
import { MetaDataModule } from './meta-data/meta-data.module';
import { UtilsModule } from './core/utils/utils.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { SubscriptionController } from './subscription/subscription.controller';
import { SubscriptionsAbacMiddleware } from './core/middleware/resources/subscription-abac.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UtilsModule,

    GoogleOauthModule,
    JwtAuthModule,
    ProviderModule,
    AwsManagerModule,
    FilterModule,

    UsersModule,
    ContentsModule,
    RegistrationModule,
    MetaDataModule,
    SubscriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware).forRoutes(UsersController, ContentsController, SubscriptionController)
      .apply(QuotaLimitMiddleware, ContentsAbacMiddleware).forRoutes(
        {path: '/contents', method: RequestMethod.POST},
        {path: '/contents/:id', method: RequestMethod.POST},
        {path: '/contents/:id', method: RequestMethod.PATCH})
      .apply(ContentsAbacMiddleware).forRoutes(
        {path: '/contents/:id', method: RequestMethod.GET})
      .apply(SubscriptionsAbacMiddleware).forRoutes(
        {path: '/subscriptions', method: RequestMethod.POST})  
  }

}
