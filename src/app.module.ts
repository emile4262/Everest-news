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

@Module({
  imports: [
    ConfigModule.forRoot({  
      isGlobal: true,
    }),
    //UsersModule,
    AuthModule,
    UsersModule,
    TopicsModule, 
     ],
  controllers: [AppController, UsersController,TopicsController],
  providers: [AppService, UsersService, JwtAuthGuard, TopicsService,
    RolesGuard, ],
})
export class AppModule {}
