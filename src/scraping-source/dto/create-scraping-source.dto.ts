import { IsString, IsOptional, IsBoolean, IsUrl, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateScrapingSourceDto {
  @ApiProperty({
    description: 'Nom de la source de scraping',
    example: 'Tech News RSS'
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'URL à scraper',
    example: 'https://example.com/rss'
  })
  @IsUrl()
  url: string;


  sourceType: string  // 'API' | 'HTML'


  @ApiPropertyOptional({
    description: 'Sélecteur CSS pour le scraping',
    example: '.article-content'
  })
  @IsOptional()
  @IsString()
  selector?: string;

  @ApiPropertyOptional({
    description: 'Statut actif de la source',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'ID du topic associé',
    example: 'cluixyz123456'
  })
  @IsString()
  topicId: string;
}

export class UpdateScrapingSourceDto {
  @ApiPropertyOptional({
    description: 'Nom de la source de scraping',
    example: 'Tech News RSS Updated'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'URL à scraper',
    example: 'https://example.com/new-rss'
  })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({
    description: 'Sélecteur CSS pour le scraping',
    example: '.new-article-content'
  })
  @IsOptional()
  @IsString()
  selector?: string;

  @ApiPropertyOptional({
    description: 'Statut actif de la source',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'ID du topic associé',
    example: 'cluixyz789012'
  })
  @IsOptional()
  @IsString()
  topicId?: string;
}

export class ScrapingSourceResponseDto {
  @ApiProperty({
    description: 'ID unique de la source',
    example: 'cluixyz123456'
  })
  id: string;

  @ApiProperty({
    description: 'Nom de la source de scraping',
    example: 'Tech News RSS'
  })
  name: string;

  @ApiProperty({
    description: 'URL à scraper',
    example: 'https://example.com/rss'
  })
  url: string;

  @ApiPropertyOptional({
    description: 'Sélecteur CSS pour le scraping',
    example: '.article-content'
  })
  selector?: string;

  @ApiProperty({
    description: 'Statut actif de la source',
    example: true
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Date du dernier scraping',
    example: '2024-01-15T10:30:00Z'
  })
  lastScrapedAt?: Date;

  @ApiProperty({
    description: 'Date de création',
    example: '2024-01-01T00:00:00Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date de mise à jour',
    example: '2024-01-15T10:30:00Z'
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'ID du topic associé',
    example: 'cluixyz789012'
  })
  topicId: string;
}

export class ScrapingSourceQueryDto {
  @ApiPropertyOptional({
    description: 'Filtrer par topic ID',
    example: 'cluixyz789012'
  })
  @IsOptional()
  @IsString()
  topicId?: string;

  @ApiPropertyOptional({
    description: 'Filtrer par statut actif',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Recherche par nom',
    example: 'Tech News'
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Numéro de page',
    example: 1,
    default: 1
  })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    description: 'Nombre d\'éléments par page',
    example: 10,
    default: 10
  })
  @IsOptional()
  limit?: number;
}

export class UpdateLastScrapedDto {
  @ApiProperty({
    description: 'Date du dernier scraping',
    example: '2024-01-15T10:30:00Z'
  })
  @IsDateString()
  lastScrapedAt: string;
}