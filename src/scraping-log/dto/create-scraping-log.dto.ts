import { IsString, IsInt, IsOptional, IsIn, Min, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateScrapingLogDto {
  @ApiProperty({
    description: 'URL source du scraping',
    example: 'https://example.com/data'
  })
  @IsString()
  sourceUrl: string;

  @ApiProperty({
    description: 'Status du scraping',
    enum: ['SUCCESS', 'ERROR', 'WARNING'],
    example: 'SUCCESS'
  })
  @IsString()
  @IsIn(['SUCCESS', 'ERROR', 'WARNING'])
  status: string;

  @ApiPropertyOptional({
    description: 'Message détaillé du scraping',
    example: 'Scraping completed successfully'
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({
    description: 'Nombre d\'éléments scrapés',
    example: 150,
    default: 0
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  itemsScraped?: number;

  @ApiPropertyOptional({
    description: 'Temps d\'exécution en millisecondes',
    example: 5000
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  executionTime?: number;
}

// update-scraping-log.dto.ts


export class UpdateScrapingLogDto extends PartialType(CreateScrapingLogDto) {}

// scraping-log-response.dto.ts

export class ScrapingLogResponseDto {
  @ApiProperty({
    description: 'ID unique du log',
    example: 'clt1234567890abcdef'
  })
  id: string;

  @ApiProperty({
    description: 'URL source du scraping',
    example: 'https://example.com/data'
  })
  sourceUrl: string;

  @ApiProperty({
    description: 'Status du scraping',
    enum: ['SUCCESS', 'ERROR', 'WARNING'],
    example: 'SUCCESS'
  })
  status: string;

  @ApiPropertyOptional({
    description: 'Message détaillé du scraping',
    example: 'Scraping completed successfully'
  })
  message?: string;

  @ApiProperty({
    description: 'Nombre d\'éléments scrapés',
    example: 150
  })
  itemsScraped: number;

  @ApiPropertyOptional({
    description: 'Temps d\'exécution en millisecondes',
    example: 5000
  })
  executionTime?: number;

  @ApiProperty({
    description: 'Date de création',
    example: '2024-01-15T10:30:00.000Z'
  })
  createdAt: Date;
}

// scraping-log-query.dto.ts

export class ScrapingLogQueryDto {
  @ApiPropertyOptional({
    description: 'Filtrer par status',
    enum: ['SUCCESS', 'ERROR', 'WARNING']
  })
  @IsOptional()
  @IsString()
  @IsIn(['SUCCESS', 'ERROR', 'WARNING'])
  status?: string;

  @ApiPropertyOptional({
    description: 'Filtrer par URL source',
    example: 'https://example.com'
  })
  @IsOptional()
  @IsString()
  sourceUrl?: string;

  @ApiPropertyOptional({
    description: 'Date de début (ISO)',
    example: '2024-01-01T00:00:00.000Z'
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({
    description: 'Date de fin (ISO)',
    example: '2024-12-31T23:59:59.999Z'
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({
    description: 'Numéro de page',
    example: 1,
    default: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Nombre d\'éléments par page',
    example: 10,
    default: 10
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}