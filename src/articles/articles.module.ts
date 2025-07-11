import { Module } from '@nestjs/common';
import { ArticleService } from './articles.service';
import { PrismaModule } from 'src/prisma.module';
import { ArticleController } from './articles.controller';

@Module({
  imports: [PrismaModule], 
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService], 
})
export class ArticleModule {}