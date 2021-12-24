import { Module } from '@nestjs/common';
import { CategoriesModule } from 'src/categories/categories.module';
import { AwsManagerModule } from 'src/core/aws-manager/aws-manager.module';
import { ProviderModule } from 'src/core/provider/provider.module';
import { UsersModule } from 'src/users/users.module';
import { ContentsController } from './contents.controller';
import { ContentsService } from './contents.service';

@Module({
  imports: [ProviderModule, AwsManagerModule, CategoriesModule, UsersModule],
  providers: [ContentsService],
  controllers: [ContentsController],
  exports: [ContentsService]
})
export class ContentsModule {}
