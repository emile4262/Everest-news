// import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
// import { ExternalContentType } from "@prisma/client";
// import { Transform } from "class-transformer";
// import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString, IsUrl } from "class-validator";

// export class UpdateExternalContentDto {

//   @ApiProperty({ description: 'ID du contenu externe' })
//   @IsString()
//   id: string;

//   @ApiPropertyOptional({ description: 'Titre du contenu' })
//   @IsOptional()
//   @IsString()
//   title?: string;

//   @ApiPropertyOptional({ description: 'URL du contenu' })
//   @IsOptional()
//   @IsUrl()
//   url?: string;

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

//   @ApiPropertyOptional({ description: 'Source du contenu' })
//   @IsOptional()
//   @IsString()
//   source?: string;

//   @ApiPropertyOptional({ enum: ExternalContentType, description: 'Type de contenu' })
//   @IsOptional()
//   @IsEnum(ExternalContentType)
//   type?: ExternalContentType;

//   @ApiPropertyOptional({ description: 'Date de publication' })
//   @IsOptional()
//   @IsDateString()
//   publishedAt?: string;

//   @ApiPropertyOptional({ description: 'ID du topic associé' })
//   @IsOptional()
//   @IsString()
//   topicId?: string;

//   @ApiPropertyOptional({ description: 'Statut actif' })
//   @IsOptional()
//   @IsBoolean()
//   @Transform(({ value }) => value === 'true' || value === true)
//   isActive?: boolean;
// }