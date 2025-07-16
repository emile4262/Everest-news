import { IsString, IsUrl, IsOptional, IsEnum, IsBoolean, IsDateString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ExternalContentType {
  ARTICLE = 'ARTICLE',
  VIDEO = 'VIDEO',
  COURSE = 'COURSE',
  TUTORIAL = 'TUTORIAL'
}

export class CreateExternalContentDto {
  @ApiProperty({ description: 'Titre du contenu' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'URL du contenu' })
  @IsUrl()
  url: string;

  @ApiPropertyOptional({ description: 'Résumé du contenu' })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional({ description: 'Contenu complet' })
  @IsOptional()
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: 'Auteur du contenu' })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty({ description: 'Source du contenu' })
  @IsString()
  source: string;

  @ApiProperty({ enum: ExternalContentType, description: 'Type de contenu' })
  @IsEnum(ExternalContentType)
  type: ExternalContentType;

  @ApiPropertyOptional({ description: 'Date de publication' })
  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @ApiProperty({ description: 'ID du topic associé' })
  @IsString()
  topicId: string;

  @ApiPropertyOptional({ description: 'Statut actif', default: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean = true;
}

export class UpdateExternalContentDto {

  @ApiProperty({ description: 'ID du contenu externe' })
  @IsString()
  id: string;

  @ApiPropertyOptional({ description: 'Titre du contenu' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'URL du contenu' })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({ description: 'Résumé du contenu' })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional({ description: 'Contenu complet' })
  @IsOptional()
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: 'Auteur du contenu' })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({ description: 'Source du contenu' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({ enum: ExternalContentType, description: 'Type de contenu' })
  @IsOptional()
  @IsEnum(ExternalContentType)
  type?: ExternalContentType;

  @ApiPropertyOptional({ description: 'Date de publication' })
  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @ApiPropertyOptional({ description: 'ID du topic associé' })
  @IsOptional()
  @IsString()
  topicId?: string;

  @ApiPropertyOptional({ description: 'Statut actif' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;
}

export class ExternalContentResponseDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  url: string;

  @ApiProperty({ required: false })
  summary: string | null;

  @ApiProperty({ required: false })
  content: string;

  @ApiProperty({ required: false })
  author?: string;

  @ApiProperty()
  source: string;

  @ApiProperty({ enum: ExternalContentType })
  type: ExternalContentType;

  @ApiProperty({ required: false })
  publishedAt?: Date;

  @ApiProperty()
  scrapedAt: Date;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  topicId: string;

  @ApiProperty({ required: false })
  @IsString()
  topic?: {
    id: string;
    name: string;
  };

//   @ApiProperty({ required: false })
//   @IsUUID()

//   views?: {
//     id: string;
//     viewedAt: Date;
//     userId: string;
//   }[];

  @ApiProperty({ required: false })
  viewsCount?: number;
}

export class ExternalContentQueryDto {
  @ApiPropertyOptional({ description: 'Recherche par titre ou auteur' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ExternalContentType, description: 'Filtrer par type' })
  @IsOptional()
  @IsEnum(ExternalContentType)
  type?: ExternalContentType;

  @ApiPropertyOptional({ description: 'Filtrer par topic' })
  @IsOptional()
  @IsString()
  topicId?: string;

  @ApiPropertyOptional({ description: 'Filtrer par source' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({ description: 'Filtrer par statut actif', default: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Page', default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Limite par page', default: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Trier par', enum: ['scrapedAt', 'publishedAt', 'title'] })
  @IsOptional()
  @IsString()
  sortBy?: 'scrapedAt' | 'publishedAt' | 'title' = 'scrapedAt';

  @ApiPropertyOptional({ description: 'Ordre de tri', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}