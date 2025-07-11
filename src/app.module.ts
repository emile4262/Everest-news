import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RolesGuard } from './auth/roles.guard';
import { JwtAuthGuard } from './auth/jwt-auth/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config/dist';
import { TopicsModule } from './topic/topic.module';
import { TopicsController } from './topic/topic.controller';
import { TopicsService } from './topic/topic.service';
import { UserTopicSubscriptionsModule } from './user-topic-subscriptions/user-topic-subscriptions.module';
import { User } from './auth/public.decorateur';
import { UserTopicSubscriptionsController } from './user-topic-subscriptions/user-topic-subscriptions.controller';
import { UserTopicSubscriptionsService } from './user-topic-subscriptions/user-topic-subscriptions.service';
import { ArticleModule } from './articles/articles.module';
import { ArticleService } from './articles/articles.service';
import { ArticleController } from './articles/articles.controller';

@Module({
  imports: [
    ConfigModule.forRoot({  
      isGlobal: true,
    }),
    //UsersModule,
    AuthModule,
    UsersModule,
    TopicsModule,
    UserTopicSubscriptionsModule,
    ArticleModule, 
     ],
  controllers: [AppController, UsersController,TopicsController, UserTopicSubscriptionsController, TopicsController, ArticleController],
  providers: [AppService, UsersService, JwtAuthGuard, TopicsService, UserTopicSubscriptionsService,ArticleService, 
    RolesGuard, ],
})
export class AppModule {}
