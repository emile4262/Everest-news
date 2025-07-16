import { Module } from '@nestjs/common';
import { ScrapingLogService } from './scraping-log.service';
import { ScrapingLogController } from './scraping-log.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ScrapingLogController],
  providers: [ScrapingLogService],
  exports: [ScrapingLogService],
})
export class ScrapingLogModule {}