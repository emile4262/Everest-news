import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
 // Dans JwtStrategy
constructor(
   configService: ConfigService,
) {
   const secret = configService.get<string>('JWT_SECRET') as string;
  //  console.log('JWT_SECRET utilisé par JwtStrategy:', secret); 
   super({
     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
     ignoreExpiration: false,
     secretOrKey: secret
   });
}
 // Dans JwtStrategy, méthode validate
async validate(payload: any) {
  if (!payload.role) {
    throw new UnauthorizedException('Information de rôle manquante');
  }

  return {
    id: payload.sub,
    userId: payload.sub,
    email: payload.email,
    role: payload.role,
  };
}
  }
