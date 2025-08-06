import { Module } from '@nestjs/common';
import { UserTopicSubscriptionsService } from './user-topic-subscriptions.service';
import { UserTopicSubscriptionsController } from './user-topic-subscriptions.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserTopicSubscriptionsController],
  providers: [UserTopicSubscriptionsService],
  exports: [UserTopicSubscriptionsService],
})
export class UserTopicSubscriptionsModule {}