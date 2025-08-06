import { Module } from '@nestjs/common';
import { ArticleService } from './articles.service';
import { ArticleController } from './articles.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule], 
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService], 
})
export class ArticleModule {}