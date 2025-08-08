import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { RolesGuard } from './auth/roles.guard';
import { JwtAuthGuard } from './auth/jwt-auth/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config/dist';
import { TopicsModule } from './topic/topic.module';
import { TopicsController } from './topic/topic.controller';
import { TopicsService } from './topic/topic.service';
import { UserTopicSubscriptionsModule } from './user-topic-subscriptions/user-topic-subscriptions.module';
import { UserTopicSubscriptionsController } from './user-topic-subscriptions/user-topic-subscriptions.controller';
import { UserTopicSubscriptionsService } from './user-topic-subscriptions/user-topic-subscriptions.service';
import { ArticleModule } from './articles/articles.module';
import { ArticleService } from './articles/articles.service';
import { ArticleController } from './articles/articles.controller';
// import { ScrapingSourceModule } from './scraping-source/scraping-source.module';
// import { ScrapingLogModule } from './scraping-log/scraping-log.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ScrapingModule } from './scraping/scraping.module';
import { ScrapingService } from './scraping/scraping.service';
import { ScrapingController } from './scraping/scraping.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './common/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({  
      isGlobal: true,
    }),
    ScheduleModule . forRoot (),
    UsersModule,
    AuthModule,
    UsersModule,
    TopicsModule,
    UserTopicSubscriptionsModule,
    ArticleModule,
    // ScrapingSourceModule,
    // ScrapingLogModule,
    NotificationsModule,
    ScrapingModule,
    PrismaModule,
     ],
  controllers: [ UsersController,TopicsController, UserTopicSubscriptionsController, TopicsController, ArticleController,  ],
  providers: [ UsersService, JwtAuthGuard, TopicsService, UserTopicSubscriptionsService,ArticleService,  
    RolesGuard, ],
})
export class AppModule {}
