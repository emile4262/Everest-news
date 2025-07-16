import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './role.decorateur';
import { UserRole } from 'generated/prisma';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // si aucun rôle n'est requis, autoriser l'accès
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('Requête utilisateur:', user);
    console.log('Rôles requis:', requiredRoles);

    // Vérification plus stricte de la présence de l'utilisateur
    if (!user) {
      console.log('Accès refusé: utilisateur non authentifié');
      throw new UnauthorizedException('Accès interdit : utilisateur non authentifié');
    }

    // Vérification de la présence de l'ID utilisateur
    if (!user.id) {
      console.log('Accès refusé: ID utilisateur manquant');
      throw new UnauthorizedException('Accès interdit : ID utilisateur manquant');
    }

    // Vérification de la présence du rôle
    if (!user.role) {
      console.log('Accès refusé: rôle utilisateur manquant');
      throw new ForbiddenException('Accès interdit : rôle utilisateur manquant');
    }

    const userRole = user.role;
    console.log(`Rôle de l'utilisateur: ${userRole}`);

    // Vérification que le rôle de l'utilisateur est valide
    if (!Object.values(UserRole).includes(userRole)) {
      console.log(`Accès refusé: rôle utilisateur invalide (${userRole})`);
      throw new ForbiddenException('Accès interdit : rôle utilisateur invalide');
    }

    const hasRole = requiredRoles.some(role => role === userRole);

    if (!hasRole) {
      console.log(`Accès refusé: rôle requis non trouvé (a: ${userRole}, requis: ${requiredRoles.join(', ')})`);
      throw new ForbiddenException('Accès interdit : rôle insuffisant');
    }

    console.log('Accès autorisé');
    return true;
  }
}