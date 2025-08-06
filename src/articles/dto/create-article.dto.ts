// src/articles/dto/create-article.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsUUID, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArticleCategory, ArticleStatus } from '@prisma/client'; // Assurez-vous que @prisma/client est correctement importé

//  DTO pour la création d'un article.
export class CreateArticleDto {
  @ApiProperty({
    description: 'Titre de l\'article',
    example: 'Nouvelles fonctionnalités de l\'application',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Contenu complet de l\'article',
    example: 'Nous sommes ravis d\'annoncer les dernières mises à jour...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Résumé concis de l\'article (optionnel)',
    example: 'Un bref aperçu des nouveautés.',
    required: false,
  })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiProperty({
    description: 'URL de l\'article (optionnel)',
    example: 'https://example.com/article',
    required: false,
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({
    description: 'Source de l\'article (optionnel)',
    example: 'YouTube',
    required: false,
  })
  @IsString()
  @IsOptional()
  source?: string;

  @ApiProperty({
    description: 'Catégorie de l\'article',
    enum: ArticleCategory,
    example: ArticleCategory.PROJECT_NEWS,
  })
  @IsEnum(ArticleCategory)
  @IsNotEmpty()
  category: ArticleCategory;

  @ApiProperty({
    description: 'Statut initial de l\'article (brouillon, publié, archivé). Par défaut: DRAFT.',
    enum: ArticleStatus,
    example: ArticleStatus.DRAFT,
    required: false,
  })
  @IsEnum(ArticleStatus)
  @IsOptional()
  status?: ArticleStatus; 
}

import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { CategoryEnum } from 'src/common/enums/category.enum';


// DTO pour la mise à jour d'un article. 
export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  
}



 
//  DTO pour filtrer les articles lors de la recherche ou de la récupération.

// export class FilterArticleDto {
//   // @ApiProperty({
//   //   description: 'Filtre les articles par titre (recherche partielle)',
//   //   required: false,
//   //   example: 'nouvelles',
//   // })
//   @IsString()
//   @IsOptional()
//   title?: string;

//   @ApiPropertyOptional({
//      description: 'les différents catégories',
//     //  example: ['PROJECT_NEWS', 'TUTORIAL', 'OPINION', 'REVIEW', 'HR_HOLIDAYS'],
//     //  type: 'array',
//     //  items: {
//     //    type: 'string',
//     //  },
//     enum: CategoryEnum
//    })
//    @IsEnum(CategoryEnum)
//    @IsOptional()
//   //  @Transform(({ value }) => {
//   //    if (typeof value === 'string') {
//   //      try {
//   //        return JSON.parse(value);
//   //      } catch (e) {
//   //        return value.split(',').map((item) => item.trim());
//   //      }
//   //    }
//   //    return value;
//   //  })
//   category?: CategoryEnum;


//   // @ApiProperty({
//   //   description: 'URL de l\'article (optionnel)',
//   //   example: 'https://example.com/article',
//   //   required: false,
//   // })
//   // @IsString()
//   // @IsOptional()
//   // url?: string;

//   @ApiProperty({
//     description: 'Source de l\'article (optionnel)',
//     example: 'YouTube',
//     required: false,
//   })
//   @IsString()
//   @IsOptional()
//   source?: string;



//   // @ApiProperty({
//   //   description: 'Filtre les articles par statut',
//   //   enum: ArticleStatus,
//   //   required: false,
//   //   example: ArticleStatus.PUBLISHED,
//   // })
//   @IsEnum(ArticleStatus)
//   @IsOptional()
//   status?: ArticleStatus;

//   // @ApiProperty({
//   //   description: 'ID de l\'auteur pour filtrer les articles écrits par un utilisateur spécifique',
//   //   required: false,
//   //   example: 'clw67v2440000w4n23m9d4g5j', 
//   // })
//   @IsString()
//   @IsUUID()
//   @IsOptional()
//   authorId?: string;

//   @IsOptional()
//   @Transform(({ value }) => value === 'true')
//   @IsBoolean()
//   isActive?: boolean;

//   @ApiProperty({
//     description: 'Numéro de page pour la pagination (commence à 1)',
//     required: false,
//     example: 1,
//     default: 1,
//   })
//   @IsOptional()
//   page?: number;

//   @ApiProperty({
//     description: 'Nombre d\'articles par page',
//     required: false,
//     example: 10,
//     default: 10,
//   })
//   @IsOptional()
//   limit?: number;

//   @ApiProperty()
//   @IsOptional()
//   @IsArray()
//   search?: string;
// }
