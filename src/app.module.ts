import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleOauthModule } from './core/authentication/google-oauth/google-oauth.module';
import { JwtAuthModule } from './core/authentication/jwt/jwt-auth.module';
import { RegistrationModule } from './registration/registration.module';
import { JwtAuthMiddleware } from './core/middleware/security/jwt-auth.middleware';
import { QuotaLimitMiddleware } from './core/middleware/resources/quota-limit.middleware';
import { AwsManagerModule } from './core/aws-manager/aws-manager.module';
import { ContentAbacMiddleware } from './core/middleware/abac/content-abac.middleware';
import { FilterModule } from './core/middleware/filter.module';
import { UtilsModule } from './core/utils/utils.module';
import { SubscriptionAbacMiddleware } from './core/middleware/abac/subscription-abac.middleware';
import { UserController } from './abac/user/user.controller';
import { UserAbacMiddleware } from './core/middleware/abac/user-abac-middleware';
import { ContentController } from './abac/content/content.controller';
import { SubscriptionController } from './abac/subscription/subscription.controller';
import { TopicAbacMiddleware } from './core/middleware/abac/topic-abac.middleware';
import { TopicController } from './abac/topic/topic.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UtilsModule,

    GoogleOauthModule,
    JwtAuthModule,
    AwsManagerModule,
    FilterModule,

    RegistrationModule
  ],
  controllers: [
    AppController, 
    ContentController, SubscriptionController, 
    TopicController, UserController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware, ContentAbacMiddleware).forRoutes(
        { path: 'contents/:id', method: RequestMethod.GET }, 
        { path: 'contents', method: RequestMethod.POST },
        { path: 'contents/:id/info', method: RequestMethod.PATCH },
        { path: 'contents/:id/media', method: RequestMethod.PATCH },
        { path: 'contents/:id', method: RequestMethod.DELETE },)

      // .apply(JwtAuthMiddleware, UserAbacMiddleware).forRoutes(
      //   { path: 'users/role', method: RequestMethod.GET })

      .apply(JwtAuthMiddleware, TopicAbacMiddleware).forRoutes(
        { path: 'topics', method: RequestMethod.GET },
        { path: 'topics', method: RequestMethod.POST },
        { path: 'topics/:id', method: RequestMethod.PATCH },
        { path: 'topics/:id', method: RequestMethod.DELETE }
      )

      .apply(JwtAuthMiddleware, SubscriptionAbacMiddleware).forRoutes(
        { path: 'subscriptions', method: RequestMethod.GET },
        { path: 'subscriptions', method: RequestMethod.POST },
        { path: 'subscriptions/:id', method: RequestMethod.DELETE})    
  }

}
