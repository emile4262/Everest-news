// src/notifications/dto/create-notification.dto.ts
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export enum NotificationType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export class CreateNotificationDto {
  @ApiProperty({ description: 'ID de l\'utilisateur destinataire' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Titre de la notification' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Message de la notification' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ 
    description: 'Type de notification',
    enum: NotificationType,
    default: NotificationType.INFO
  })
  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType = NotificationType.INFO;

  @ApiProperty({ description: 'Statut de lecture', default: false })
  @IsBoolean()
  @IsOptional()
  isRead?: boolean = false;
}

// src/notifications/dto/update-notification.dto.ts

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;
}

// src/notifications/dto/notification-response.dto.ts

export class NotificationResponseDto {
  @ApiProperty({ description: 'ID de la notification' })
  id: string;

  @ApiProperty({ description: 'ID de l\'utilisateur destinataire' })
  userId: string;

  @ApiProperty({ description: 'Titre de la notification' })
  title: string;

  @ApiProperty({ description: 'Message de la notification' })
  message: string;

  @ApiProperty({ 
    description: 'Type de notification',
    enum: NotificationType
  })
  type: NotificationType;

  @ApiProperty({ description: 'Statut de lecture' })
  isRead: boolean;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;
}

// src/notifications/dto/notification-query.dto.ts

export class NotificationQueryDto {
  @ApiProperty({ required: false, description: 'ID de l\'utilisateur' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ 
    required: false, 
    description: 'Type de notification',
    enum: NotificationType
  })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiProperty({ required: false, description: 'Statut de lecture' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isRead?: boolean;

  @ApiProperty({ required: false, description: 'Limite de résultats', default: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @ApiProperty({ required: false, description: 'Décalage pour la pagination', default: 0 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  offset?: number = 0;
}