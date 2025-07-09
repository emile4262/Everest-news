// src/modules/users/dto/update-user.dto.ts
import { IsEmail, IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from 'generated/prisma';
// import { Role } from '@prisma/client';


export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'john.doe@everest.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 'Senior Software Developer' })
  @IsOptional()
  @IsString()
  jobTitle?: string | null;

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.MANAGER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
  user: string;

 
}