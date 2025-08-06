import { Module } from '@nestjs/common';
import { TopicsController } from './topic.controller';
import { TopicsService } from './topic.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TopicsController],
  providers: [TopicsService],
  exports: [TopicsService],
})
export class TopicsModule {}