import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; 
import { ScrapingService } from './scraping.service';
import { ScrapingController } from './scraping.controller';
import { PrismaModule } from 'src/prisma.module'; 
@Module({
  imports: [HttpModule, PrismaModule, ],
  controllers: [ScrapingController],
  providers: [ScrapingService],
  exports: [ScrapingService],
})
export class ScrapingModule {}