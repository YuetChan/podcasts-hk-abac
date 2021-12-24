import { Module } from '@nestjs/common';
import { CategoriesModule } from 'src/categories/categories.module';
import { TagsModule } from 'src/tags/tags.module';
import { MetaDataController } from './meta-data.controller';

@Module({  
  imports: [TagsModule, CategoriesModule],
  controllers: [MetaDataController]
})
export class MetaDataModule {}
