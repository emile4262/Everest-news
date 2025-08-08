// import { ApiPropertyOptional } from "@nestjs/swagger";
// import { ExternalContentType } from "@prisma/client";
// import { Transform } from "class-transformer";
// import { IsOptional, IsString, IsBoolean } from "class-validator";

// export class ExternalContentQueryDto {

//   @ApiPropertyOptional({ description: 'Recherche par titre ou auteur' })
//   @IsOptional()
//   @IsString()
//   search?: string;

//   @ApiPropertyOptional({ enum: ExternalContentType, description: 'Filtrer par type', 
//     example: ['ARTICLE', 'VIDEO', 'COURSE', 'TUTORIAL'],
//     type: 'array',
//     items: {
//       type: 'string',
//     },
//   })
//   @IsOptional()
//   @Transform(({ value }) => {
//     if (typeof value === 'string') {
//       try {
//         return JSON.parse(value);
//       } catch (e) {
//         return value.split(',').map((item) => item.trim());
//       }
//     }
//     return value;
//   })
//   externalContent?: ExternalContentType[];

//   // @ApiPropertyOptional({ description: 'Filtrer par topic' })
//   @IsOptional()
//   @IsString()
//   topicId?: string;

//   // @ApiPropertyOptional({ description: 'Filtrer par source' })
//   // @IsOptional()
//   // @IsString()
//   // source?: string;

//   @ApiPropertyOptional({ description: 'Filtrer par statut actif', default: true })
//   @IsOptional()
//   @IsBoolean()
//   @Transform(({ value }) => value === 'true' || value === true)
//   isActive?: boolean;

//   // @ApiPropertyOptional({ description: 'Page', default: 1 })
//   @IsOptional()
//   @Transform(({ value }) => parseInt(value))
//   page?: number = 1;

//   // @ApiPropertyOptional({ description: 'Limite par page', default: 10 })
//   @IsOptional()
//   @Transform(({ value }) => parseInt(value))
//   limit?: number = 10;

//   @ApiPropertyOptional({ description: 'Trier par', enum: ['scrapedAt', 'publishedAt', 'title'] })
//   @IsOptional()
//   @IsString()
//   sortBy?: 'scrapedAt' | 'publishedAt' | 'title' = 'scrapedAt';

//   @ApiPropertyOptional({ description: 'Ordre de tri', enum: ['asc', 'desc'] })
//   @IsOptional()
//   @IsString()
//   sortOrder?: 'asc' | 'desc' = 'desc';
// }