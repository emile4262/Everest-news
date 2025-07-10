import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { TopicsController } from './topic.controller';
import { TopicsService } from './topic.service';

@Module({
  imports: [PrismaModule],
  controllers: [TopicsController],
  providers: [TopicsService],
  exports: [TopicsService],
})
export class TopicsModule {}