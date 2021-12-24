import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrismaService } from './prisma.service';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/test')],
	providers: [PrismaService],
  exports: [PrismaService, MongooseModule],
})
export class ProviderModule {}
