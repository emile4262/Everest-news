import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma.module';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, UsersModule, 
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' }, // Durée du token
    }),],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService, JwtModule],
})
export class UsersModule {}

