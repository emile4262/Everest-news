// import { IsString, IsUrl, IsOptional, IsEnum, IsBoolean, IsDateString, IsUUID } from 'class-validator';
// import { Transform } from 'class-transformer';
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { ExternalContentEnum } from 'src/common/enums/external-content.enum';
// import { ExternalContent } from '../entities/external-content.entity';

// // export enum ExternalContentType {
// //   ARTICLE = 'ARTICLE',
// //   VIDEO = 'VIDEO',
// //   COURSE = 'COURSE',
// //   TUTORIAL = 'TUTORIAL'
// // }

// export class CreateExternalContentDto {

//   @ApiProperty({ description: 'Titre du contenu' })
//   @IsString()
//   title: string;

//   @ApiProperty({ description: 'URL du contenu' })
//   @IsUrl()
//   url: string;

//   @ApiPropertyOptional({ description: 'Résumé du contenu' })
//   @IsOptional()
//   @IsString()
//   summary?: string;

//   @ApiPropertyOptional({ description: 'Contenu complet' })
//   @IsOptional()
//   @IsString()
//   content: string;

//   @ApiPropertyOptional({ description: 'Auteur du contenu' })
//   @IsOptional()
//   @IsString()
//   author?: string;

//   @ApiProperty({ description: 'Source du contenu' })
//   @IsString()
//   source: string;

//   @ApiProperty({ enum: ExternalContentEnum, description: 'Type de contenu' })
//   @IsEnum(ExternalContentEnum)
//   type: ExternalContentEnum;

//   @ApiPropertyOptional({ description: 'Date de publication' })
//   @IsOptional()
//   @IsDateString()
//   publishedAt?: string;

//   @ApiProperty({ description: 'ID du topic associé' })
//   @IsString()
//   topicId: string;

//   @ApiPropertyOptional({ description: 'Statut actif', default: true })
//   @IsOptional()
//   @IsBoolean()
//   @Transform(({ value }) => value === 'true' || value === true)
//   isActive?: boolean = true;
// }

// // export class UpdateExternalContentDto {

// //   @ApiProperty({ description: 'ID du contenu externe' })
// //   @IsString()
// //   id: string;

// //   @ApiPropertyOptional({ description: 'Titre du contenu' })
// //   @IsOptional()
// //   @IsString()
// //   title?: string;

// //   @ApiPropertyOptional({ description: 'URL du contenu' })
// //   @IsOptional()
// //   @IsUrl()
// //   url?: string;

// //   @ApiPropertyOptional({ description: 'Résumé du contenu' })
// //   @IsOptional()
// //   @IsString()
// //   summary?: string;

// //   @ApiPropertyOptional({ description: 'Contenu complet' })
// //   @IsOptional()
// //   @IsString()
// //   content: string;

// //   @ApiPropertyOptional({ description: 'Auteur du contenu' })
// //   @IsOptional()
// //   @IsString()
// //   author?: string;

// //   @ApiPropertyOptional({ description: 'Source du contenu' })
// //   @IsOptional()
// //   @IsString()
// //   source?: string;

// //   @ApiPropertyOptional({ enum: ExternalContentType, description: 'Type de contenu' })
// //   @IsOptional()
// //   @IsEnum(ExternalContentType)
// //   type?: ExternalContentType;

// //   @ApiPropertyOptional({ description: 'Date de publication' })
// //   @IsOptional()
// //   @IsDateString()
// //   publishedAt?: string;

// //   @ApiPropertyOptional({ description: 'ID du topic associé' })
// //   @IsOptional()
// //   @IsString()
// //   topicId?: string;

// //   @ApiPropertyOptional({ description: 'Statut actif' })
// //   @IsOptional()
// //   @IsBoolean()
// //   @Transform(({ value }) => value === 'true' || value === true)
// //   isActive?: boolean;
// // }

// export class ExternalContentResponseDto {

//  data: ExternalContentResponseDto[];
//   @ApiProperty()
//   @IsString()
//   id: string;

//   @ApiProperty()
//   title: string;

//   @ApiProperty()
//   url: string;

//   @ApiProperty({ required: false })
//   summary: string | null;

//   @ApiProperty({ required: false })
//   content: string;

//   @ApiProperty({ required: false })
//   author?: string;

//   @ApiProperty()
//   source: string;

//   @ApiProperty({ enum: ExternalContentEnum })
//   type: ExternalContentEnum;

//   @ApiProperty({ required: false })
//   publishedAt?: Date;

//   @ApiProperty()
//   scrapedAt: Date;

//   @ApiProperty()
//   isActive: boolean;

//   @ApiProperty()
//   topicId: string;

//   @ApiProperty({ required: false })
//   @IsString()
//   topic?: {
//     id: string;
//     name: string;
//   };

// //   @ApiProperty({ required: false })
// //   @IsUUID()

// //   views?: {
// //     id: string;
// //     viewedAt: Date;
// //     userId: string;
// //   }[];

//   @ApiProperty({ required: false })
//   viewsCount?: number;
// }

// // export class ExternalContentQueryDto {

// //   @ApiPropertyOptional({ description: 'Recherche par titre ou auteur' })
// //   @IsOptional()
// //   @IsString()
// //   search?: string;

// //   @ApiPropertyOptional({ enum: ExternalContentType, description: 'Filtrer par type', 
// //     example: ['ARTICLE', 'VIDEO', 'COURSE', 'TUTORIAL'],
// //     type: 'array',
// //     items: {
// //       type: 'string',
// //     },
// //   })
// //   @IsOptional()
// //   @Transform(({ value }) => {
// //     if (typeof value === 'string') {
// //       try {
// //         return JSON.parse(value);
// //       } catch (e) {
// //         return value.split(',').map((item) => item.trim());
// //       }
// //     }
// //     return value;
// //   })
// //   type?: ExternalContentType[];

// //   // @ApiPropertyOptional({ description: 'Filtrer par topic' })
// //   @IsOptional()
// //   @IsString()
// //   topicId?: string;

// //   @ApiPropertyOptional({ description: 'Filtrer par source' })
// //   @IsOptional()
// //   @IsString()
// //   source?: string;

// //   @ApiPropertyOptional({ description: 'Filtrer par statut actif', default: true })
// //   @IsOptional()
// //   @IsBoolean()
// //   @Transform(({ value }) => value === 'true' || value === true)
// //   isActive?: boolean;

// //   // @ApiPropertyOptional({ description: 'Page', default: 1 })
// //   @IsOptional()
// //   @Transform(({ value }) => parseInt(value))
// //   page?: number = 1;

// //   // @ApiPropertyOptional({ description: 'Limite par page', default: 10 })
// //   @IsOptional()
// //   @Transform(({ value }) => parseInt(value))
// //   limit?: number = 10;

// //   @ApiPropertyOptional({ description: 'Trier par', enum: ['scrapedAt', 'publishedAt', 'title'] })
// //   @IsOptional()
// //   @IsString()
// //   sortBy?: 'scrapedAt' | 'publishedAt' | 'title' = 'scrapedAt';

// //   @ApiPropertyOptional({ description: 'Ordre de tri', enum: ['asc', 'desc'] })
// //   @IsOptional()
// //   @IsString()
// //   sortOrder?: 'asc' | 'desc' = 'desc';
// // }

// export class PaginatedExternalContentDto {

//   @ApiProperty()
//   data: ExternalContent[];

//   @ApiProperty({ example: 100 })
//   total: number;

//   @ApiProperty({ example: 1 })
//   page: number;

//   @ApiProperty({ example: 10 })
//   limit: number;

//   @ApiProperty({ example: 10 })
//   totalPages: number;

//   @ApiProperty({ example: true })
//   hasNext: boolean;

//   @ApiProperty({ example: false })
//   hasPrevious: boolean;

// }
