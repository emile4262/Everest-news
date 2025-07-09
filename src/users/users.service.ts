// src/modules/users/users.service.ts
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { CreateUserDto, UsersQueryDto, ChangePasswordDto, UserResponseDto, PaginatedUsersDto, ResetPasswordDto, VerifyOtpDto  } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { UsersQueryDto } from './dto/users-query.dto';
// import { ChangePasswordDto } from './dto/change-password.dto';
// import { UserResponseDto } from './dto/user-response.dto';
// import { PaginatedUsersDto } from './dto/paginated-users.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { User, UserRole } from 'generated/prisma';
import { JwtService } from '@nestjs/jwt';
import { randomInt } from 'crypto';
import * as nodemailer from 'nodemailer';

import { take } from 'rxjs';
import { stringify } from 'querystring';

@Injectable()
export class UsersService {
  [x: string]: any;
  updateProfile // Vérifier si le nouvel email n'est pas déjà utilisé
    (id: any, updateUserDto: UpdateUserDto): UserResponseDto | PromiseLike<UserResponseDto> {
      throw new Error('Method not implemented.');
  }
  getById(id: any) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}
  
  // Méthode pour exclure le mot de passe et le rôle
  private excludeSensitiveFields(user: User): Omit<User, 'password' | 'role'> {
    const { password, role, ...safeUser } = user;
    return safeUser;
  }

   async verifyUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }


  /**
   * Créer un nouvel utilisateur
   */
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Vérifier si l'email existe déjà
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Créer l'utilisateur
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    return new UserResponseDto(user);
  }

  /**
   * Obtenir tous les utilisateurs avec pagination et filtres
   */

  async findAll(query: UsersQueryDto): Promise<PaginatedUsersDto> {
  let { page, limit, role, isActive, search, sortBy, sortOrder } = query;

  // ✅ Conversion en nombre pour éviter les erreurs Prisma (type string → number)
  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit) || 10;
  const skip = (currentPage - 1) * currentLimit;

  // ✅ Préparation du filtre
  const where: any = {};

  if (role) {
    where.role = role;
  }

 if (isActive !== undefined) {
  // Convertir 'true' (string) ou true (boolean) en boolean
  where.isActive = String(isActive) === 'true';
}


  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { jobTitle: { contains: search, mode: 'insensitive' } },
    ];
  }

  // ✅ Préparation du tri
  const orderBy: any = {};
  if (sortBy) {
  orderBy[sortBy] = sortOrder;
  }

  // ✅ Exécution parallèle des requêtes
  const [users, total] = await Promise.all([
    this.prisma.user.findMany({
      where,
      skip,
      take: currentLimit, 
      orderBy,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        jobTitle: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    this.prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / currentLimit);

  return {
    data: users,
    total,
    totalPages,
    page: currentPage,
    limit: currentLimit,
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
  };
}


  /**
   * Obtenir un utilisateur par ID
   */
  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        jobTitle: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return new UserResponseDto(user);
  }

  /**
   * Obtenir un utilisateur par email (pour l'authentification)
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Mettre à jour un utilisateur
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    // Vérifier si l'utilisateur existe
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Vérifier si le nouvel email n'est pas déjà utilisé
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (emailExists) {
        throw new ConflictException('Un utilisateur avec cet email existe déjà');
      }
    }

    // Mettre à jour l'utilisateur
    const updatedUserdto = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        jobTitle: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return new UserResponseDto(updatedUserdto);
  }

  /**
   * Supprimer un utilisateur (soft delete)
   */
  async remove(id: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Utilisateur supprimé avec succès' };
  }

  /**
   * Supprimer définitivement un utilisateur
   */
  async hardDelete(id: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'Utilisateur supprimé définitivement' };
  }

  // Méthode pour rétrograder un admin en utilisateur normal
 async sendOtp(dto: ResetPasswordDto) {
{}  const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

  if (!user) {
    throw new NotFoundException('Utilisateur introuvable');
  }

  // ⚠️ Limite de 1 fois par mois pour les utilisateurs non-admin
  // if (user.role !== 'admin' && user.lastPasswordResetAt) {
  //   const now = new Date();
  //   const nextAllowed = new Date(user.lastPasswordResetAt);
  //   nextAllowed.setMonth(nextAllowed.getMonth() + 1);

  //   if (now < nextAllowed) {
  //     const daysLeft = Math.ceil((nextAllowed.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  //     throw new BadRequestException(
  //       `Vous avez déjà réinitialisé votre mot de passe ce mois-ci. Veuillez réessayer dans ${daysLeft} jour(s).`,
  //     );
  //   }
  // }
  // Générer un OTP aléatoire à 6 chiffres
     if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new BadRequestException('Configuration de l\'email manquante');
  }
  const otp = randomInt(100000, 999999).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // expire dans 10 minutes

  await this.prisma.user.update({  
    where: { email: dto.email },
    data: {
      otp,
      otpExpires,
     lastPasswordResetAt: user.role !== UserRole.ADMIN ? new Date() : user.lastPasswordResetAt,
    },
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  }); 

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <title>Réinitialisation du mot de passe</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
      <table width="100%" cellspacing="0" cellpadding="0" border="0" style="padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; padding: 30px; border-radius: 8px;">
              <tr>
                <td align="center" style="font-size: 24px; font-weight: bold; color: #333333;">
                  Réinitialisation du mot de passe 🔐
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 0; font-size: 16px; color: #555555;">
                  Bonjour ${user.lastName || 'utilisateur'},
                </td>
              </tr>
              <tr>
                <td style="font-size: 16px; color: #555555;">
                  Vous avez demandé à réinitialiser votre mot de passe. Voici votre code de vérification :
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 20px 0;">
                  <div style="font-size: 28px; font-weight: bold; color: #007bff; background-color: #e9f0fb; padding: 12px 24px; display: inline-block; border-radius: 4px;">
                    ${otp}
                  </div>
                </td>
              </tr>
              <tr>
                <td style="font-size: 14px; color: #999999;">
                  Ce code expirera dans <strong>10 minutes</strong>.
                </td>
              </tr>
              <tr>
                <td style="padding-top: 20px; font-size: 14px; color: #999999;">
                  Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet e-mail.
                </td>
              </tr>
              <tr>
                <td style="padding-top: 30px; font-size: 14px; color: #555555;">
                  Merci,<br/>
                  <p> L'équipe Ecommerce Merci </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Support Ecommerce" <${process.env.EMAIL_USER}>`,
    to: dto.email,
    subject: 'Réinitialisation de mot de passe - Code OTP',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email OTP envoyé à ${dto.email}`);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    throw new BadRequestException("Impossible d'envoyer l'OTP par e-mail");
  }

  return {
    message: 'OTP envoyé à votre email', 
  };  
}

   /**
   * Réinitialise le mot de passe avec l'OTP
   */
   async resetPasswordWithOtp(dto: VerifyOtpDto) {
    // Nettoyer les données d'entrée
    const email = dto.email.trim().toLowerCase();
    const otp = dto.otp.trim();

    // Récupérer l'utilisateur avec son OTP
    const user = await this.prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }


    // Vérifier que l'OTP existe et n'est pas expiré
    if (!user.otp || !user.otpExpires) {
      throw new BadRequestException('Aucun OTP généré pour cet utilisateur');
    }

    if (user.otpExpires < new Date()) {
      throw new BadRequestException('OTP expiré');
    }

   // Comparaison plus robuste de l'OTP
    if (user.otp.trim() !== otp) {
      throw new BadRequestException(`OTP invalide - Reçu: "${otp}", Attendu: "${user.otp}"`);
    }    

    
    // Valider le nouveau mot de passe (ajoutez vos règles de validation)
    if (!dto.newPassword || dto.newPassword.length < 8) {
      throw new BadRequestException('Le mot de passe doit contenir au moins 8 caractères');
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(dto.newPassword, 12); // 12 rounds pour plus de sécurité

    try {
      // Mettre à jour le mot de passe et supprimer l'OTP
      await this.prisma.user.update({
        where: { email: dto.email },
        data: { 
          password: hashedPassword,
          otp: null, // Supprimer l'OTP utilisé
          otpExpires: null, // Supprimer la date d'expiration
          updatedAt: new Date() // Mettre à jour la date de modification
        },
      });
      console.log('Mot de passe réinitialisé avec succès pour:', email);


      return { 
        message: 'Mot de passe réinitialisé avec succès' 
      };

    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      throw new BadRequestException('Erreur lors de la réinitialisation du mot de passe');
    }
  }

  /**
   * Nettoie les OTP expirés (à appeler périodiquement)
   */
  async cleanupExpiredOtps() {
    const result = await this.prisma.user.updateMany({
      where: {
        otpExpires: { lt: new Date() }
      },
      data: {
        otp: null,
        otpExpires: null
      }
    });
    
    console.log(`${result.count} OTP expirés nettoyés`);
    return result;
  }

  /**
   * Vérifie si un utilisateur a un OTP valide (utile pour debug)
   */
  async checkOtpStatus(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { 
        email: true, 
        otp: true, 
        otpExpires: true 
      }
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const hasValidOtp = user.otp && user.otpExpires && user.otpExpires > new Date();

    return {
      email: user.email,
      hasOtp: !!user.otp,
      otpExpires: user.otpExpires,
      isValid: hasValidOtp
    };
  }

  /**
   * Obtenir les statistiques des utilisateurs
   */
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byRole: Record<UserRole, number>;
  }> {
    const [total, active, inactive, byRole] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { isActive: false } }),
      this.prisma.user.groupBy({
        by: ['role'],
        _count: { role: true },
      }),
    ]);

    const roleStats = byRole.reduce((acc, curr) => {
      acc[curr.role] = curr._count.role;
      return acc;
    }, {} as Record<UserRole, number>);

    // Initialiser les rôles manquants à 0
    Object.values(UserRole).forEach(role => {
      if (!roleStats[role]) {
        roleStats[role] = 0;
      }
    });

    return {
      total,
      active,
      inactive,
      byRole: roleStats,
    };
  }

  /**
   * Réactiver un utilisateur
   */
  async activate(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { isActive: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        jobTitle: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return new UserResponseDto(updatedUser);
  }

  /**
   * Désactiver un utilisateur
   */
  async deactivate(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        jobTitle: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return new UserResponseDto(updatedUser);
  }

  
 // connexion d'un utilisateur
async login(email: string, password: string): Promise<{
  success: boolean;
  message: string;
  access_token?: string;
  refresh_token?: string;
}> {
  try {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { success: false, message: 'Email incorrect' };
    }

    // Vérifier si le compte est temporairement bloqué
    if (user.accountLockedUntil && new Date() < user.accountLockedUntil) {
      const remainingMinutes = Math.ceil((user.accountLockedUntil.getTime() - Date.now()) / (1000 * 60));
      return {
        success: false,
        message: `Votre compte est bloqué. Réessayez dans ${remainingMinutes} minute(s).`,
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const attempts = user.failedLoginAttempts + 1;

      if (attempts >= 3) {
        const lockDurationMinutes = 15;
        const lockedUntil = new Date(Date.now() + lockDurationMinutes * 60 * 1000);

        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            accountLockedUntil: lockedUntil,
          },
        });

        return {
          success: false,
          message: `Trop de tentatives. Votre compte est bloqué pendant ${lockDurationMinutes} minutes.`,
        };
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: attempts,
        },
      });

      return { success: false, message: 'Mot de passe incorrect' };
    }

    // Le mot de passe est correct : on débloque
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        accountLockedUntil: null,
      },
    });

    // ✅ CORRECTION: Utiliser le rôle depuis la base de données
    // Au lieu de définir le rôle par email, utilisez celui de la BD
    const userRole = user.role || UserRole.EMPLOYEE; // Fallback si pas de rôle défini

    const payload = {
      sub: user.id,
      email: user.email,
      role: userRole, // ✅ Utiliser le rôle de la BD
    };

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '30m',
    });

    const refresh_token = this.jwtService.sign(
      { sub: user.id },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '2d',
      }
    );

    // Sauvegarde du refresh_token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: refresh_token,
      },
    });

    return {
      success: true,
      message: 'Connexion réussie',
      access_token,
      refresh_token,
    };
  } catch (error) {
    return {
      success: false,
      message: `Erreur lors de la connexion: ${error.message}`,
    };
  }
}

async createADMIN(createUserDto: CreateUserDto): Promise<User> {
  const { email, password, firstName, lastName} = createUserDto;

  // Seul 'bnandoemile@gmail.com' peut être créé comme admin
  if (email !== 'bnandoemile@gmail.com') {
    throw new BadRequestException('Seul bnandoemile@gmail.com peut être administrateur');
  }

  const existingUser = await this.prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ConflictException('Cet email est déjà utilisé');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return this.prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      admin: true,
      role: UserRole.ADMIN, // ✅ Utiliser l'enum UserRole
      createdAt: new Date(),
    },
  });
}

// Méthode utilitaire pour vérifier si un utilisateur est admin
async isUserADMIN(email: string): Promise<boolean> {
  return email === 'bnandoemile@gmail.com';
}

// ✅ CORRECTION: Méthode pour promouvoir un utilisateur en admin
async promoteToADMIN(userId: string): Promise<User> {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
  }

  // Seul 'bnandoemile@gmail.com' peut être promu admin
  if (user.email !== 'bnandoemile@gmail.com') {
    throw new BadRequestException('Seul bnandoemile@gmail.com peut être administrateur');
  }

  // ✅ CORRECTION: Utiliser l'enum UserRole
  return this.prisma.user.update({
    where: { id: userId },
    data: {
      role: UserRole.ADMIN,
      admin: true,
    },
  });
}

// ✅ AJOUT: Méthode pour mettre à jour le rôle d'un utilisateur
async updateUserRole(userId: string, role: UserRole): Promise<User> {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
  }

  return this.prisma.user.update({
    where: { id: userId },
    data: {
      role: role,
      admin: role === UserRole.ADMIN,
    },
  });
}
}