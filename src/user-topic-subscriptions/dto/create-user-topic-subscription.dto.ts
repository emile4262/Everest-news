import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'stream';

export class CreateUserTopicSubscriptionDto {
  @ApiProperty({ description: 'ID de l\'utilisateur' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'ID du topic' })
  @IsString()
  @IsNotEmpty()
  topicId: string;
}

// user-topic-subscription-response.dto.ts

export class UserTopicSubscriptionResponseDto {
  @ApiProperty({ description: 'ID unique de la subscription' })
  id: string;

  //@ApiProperty({ description: 'ID de l\'utilisateur' })
  userId: string;

  //@ApiProperty({ description: 'ID du topic' })
  topicId: string;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;
}

// user-topic-subscription-with-relations.dto.ts

export class UserTopicSubscriptionWithRelationsDto {
  @ApiProperty({ description: 'ID unique de la subscription' })
  id: string;

  @ApiProperty({ description: 'ID de l\'utilisateur' })
  userId: string;

  @ApiProperty({ description: 'ID du topic' })
  topicId: string;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Informations de l\'utilisateur' })
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };

  @ApiProperty({ description: 'Informations du topic' })
  topic: {
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
  };
}

// user-topic-subscription-query.dto.ts

export class UserTopicSubscriptionQueryDto {
  @ApiPropertyOptional({ description: 'Numéro de page', example: 1 })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ description: 'Nombre d\'éléments par page', example: 10 })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ description: 'Filtrer par ID utilisateur' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'Filtrer par ID topic' })
  @IsOptional()
  @IsString()
  topicId?: string;

  @ApiPropertyOptional({ description: 'Champ de tri', example: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Ordre de tri', enum: ['asc', 'desc'] })
  @IsOptional()
  sortOrder?: 'asc' | 'desc';
}

// src/user-topic-subscriptions/dto/paginated-user-topic-subscriptions.dto.ts

export class PaginatedUserTopicSubscriptionsDto {
  @ApiProperty({ type: [UserTopicSubscriptionResponseDto], description: 'Liste des subscriptions' })
  data: UserTopicSubscriptionResponseDto[];

  @ApiProperty({ description: 'Nombre total de subscriptions' })
  total: number;

  @ApiProperty({ description: 'Nombre total de pages' })
  totalPages: number;

  @ApiProperty({ description: 'Page actuelle' })
  page: number;

  @ApiProperty({ description: 'Nombre d\'éléments par page' })
  limit: number;

  @ApiProperty({ description: 'Indique s\'il y a une page suivante' })
  hasNext: boolean;

  @ApiProperty({ description: 'Indique s\'il y a une page précédente' })
  hasPrevious: boolean;
}