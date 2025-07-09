import { Module } from '@nestjs/common';
// import { JwtStrategy } from './jwt.strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from 'src/users/users.controller';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy/jwt.strategy';




@Module({
  imports: [ AuthModule,
    PassportModule, UsersModule,   ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'mon_secret_jwt_par_defaut',
      signOptions: { expiresIn: '48h' },
    }),
  ],
  controllers:[ UsersController],
  providers: [JwtStrategy ],
   exports: [JwtModule],
})
export class AuthModule {}

