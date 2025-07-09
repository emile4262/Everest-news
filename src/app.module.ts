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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    //UsersModule,
    AuthModule,
    UsersModule, 
     ],
  controllers: [AppController, UsersController,],
  providers: [AppService, UsersService, JwtAuthGuard,
    RolesGuard, ],
})
export class AppModule {}
