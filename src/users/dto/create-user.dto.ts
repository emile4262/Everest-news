import { IsEmail, IsString, IsOptional, IsEnum, MinLength, IsBoolean, IsNotEmpty, Matches, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { UserRole } from '@prisma/client';
import { Exclude, Transform } from 'class-transformer';
import { UserRole } from 'generated/prisma';

export class CreateUserDto {

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john.doe@everest.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePassword123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ example: 'Software Developer' })
  @IsOptional()
  @IsString()
  jobTitle?: string | null;

  @ApiProperty({ enum: UserRole, example: UserRole.EMPLOYEE })
  @IsEnum(UserRole)
  role: UserRole;


  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  // @ApiProperty({})
  // userTopicSubscription: never[];
}

export class LoginUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
   }

// // src/modules/users/dto/update-user.dto.ts
// import { IsEmail, IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
// import { ApiPropertyOptional } from '@nestjs/swagger';
// import { UserRole } from '@prisma/client';

// export class UpdateUserDto {
//   @ApiPropertyOptional({ example: 'john.doe@everest.com' })
//   @IsOptional()
//   @IsEmail()
//   email?: string;

//   @ApiPropertyOptional({ example: 'John' })
//   @IsOptional()
//   @IsString()
//   firstName?: string;

//   @ApiPropertyOptional({ example: 'Doe' })
//   @IsOptional()
//   @IsString()
//   lastName?: string;

//   @ApiPropertyOptional({ example: 'Senior Software Developer' })
//   @IsOptional()
//   @IsString()
//   jobTitle?: string;

//   @ApiPropertyOptional({ enum: UserRole, example: UserRole.MANAGER })
//   @IsOptional()
//   @IsEnum(UserRole)
//   role?: UserRole;

//   @ApiPropertyOptional({ example: true })
//   @IsOptional()
//   @IsBoolean()
//   isActive?: boolean;
// }

// src/modules/users/dto/user-response.dto.ts


export class UserResponseDto {
  @ApiProperty({ example: 'clxxxxx' })
  id: string;

  @ApiProperty({ example: 'john.doe@everest.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiPropertyOptional({ example: 'Software Developer' })
  jobTitle?: string | null;

  @ApiProperty({ enum: UserRole, example: UserRole.EMPLOYEE })
  role: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;

  @Exclude()
  password?: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}

// src/modules/users/dto/users-query.dto.ts


export class UsersQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'le role des utilisateurs',
    example: ['ADMIN', 'EMPLOYEE', 'MANAGER'],
    type: 'array',
    items: {
      type: 'string',
    },
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value.split(',').map((item) => item.trim());
      }
    }
    return value;
  })
  role?:UserRole[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'john' })
  @IsOptional()
  @IsString()
  search?: string;
 
  @ApiPropertyOptional({ example: 'firstName' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

//   @ApiPropertyOptional({ example: 'desc' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

// src/modules/users/dto/change-password.dto.ts

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldPassword123' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: 'newSecurePassword123' })
  @IsString()
  @MinLength(8)
  newPassword: string;
}

// src/modules/users/dto/paginated-users.dto.ts

export class PaginatedUsersDto {
  @ApiProperty({ type: [UserResponseDto] })
  data: UserResponseDto[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;

  @ApiProperty({ example: true })
  hasNext: boolean;

  @ApiProperty({ example: false })
  hasPrevious: boolean;

}

export class ResetPasswordDto {
  @ApiProperty({ example: '', description: 'Email de l\'utilisateur' })
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: 'Email requis' })
  email: string;
}

// dto/verify-otp.dto.ts
export class VerifyOtpDto {
  @ApiProperty({ example: '', description: 'Email de l\'utilisateur' })
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: 'Email requis' })
  email: string;

  @ApiProperty({ example: '', description: 'Code OTP à 6 chiffres' })
  @IsString({ message: 'OTP doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'OTP requis' })
  @Matches(/^\d{6}$/, { message: 'OTP doit contenir exactement 6 chiffres' })
  otp: string;

  @ApiProperty({ example: '', description: 'Nouveau mot de passe (min 8 caractères)' })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @IsNotEmpty({ message: 'Nouveau mot de passe requis' })
  newPassword: string;
   }