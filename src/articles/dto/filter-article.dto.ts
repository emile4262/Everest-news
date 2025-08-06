import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";
import { ArticleStatus } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { CategoryEnum } from "src/common/enums/category.enum";

export class FilterArticleDto {
  // @ApiProperty({
  //   description: 'Filtre les articles par titre (recherche partielle)',
  //   required: false,
  //   example: 'nouvelles',
  // })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
     description: 'les différents catégories',
    //  example: ['PROJECT_NEWS', 'TUTORIAL', 'OPINION', 'REVIEW', 'HR_HOLIDAYS'],
    //  type: 'array',
    //  items: {
    //    type: 'string',
    //  },
    enum: CategoryEnum
   })
   @IsEnum(CategoryEnum)
   @IsOptional()
  //  @Transform(({ value }) => {
  //    if (typeof value === 'string') {
  //      try {
  //        return JSON.parse(value);
  //      } catch (e) {
  //        return value.split(',').map((item) => item.trim());
  //      }
  //    }
  //    return value;
  //  })
  category?: CategoryEnum;


  // @ApiProperty({
  //   description: 'URL de l\'article (optionnel)',
  //   example: 'https://example.com/article',
  //   required: false,
  // })
  // @IsString()
  // @IsOptional()
  // url?: string;

  @ApiProperty({
    description: 'Source de l\'article (optionnel)',
    example: 'YouTube',
    required: false,
  })
  @IsString()
  @IsOptional()
  source?: string;



  // @ApiProperty({
  //   description: 'Filtre les articles par statut',
  //   enum: ArticleStatus,
  //   required: false,
  //   example: ArticleStatus.PUBLISHED,
  // })
  @IsEnum(ArticleStatus)
  @IsOptional()
  status?: ArticleStatus;

  // @ApiProperty({
  //   description: 'ID de l\'auteur pour filtrer les articles écrits par un utilisateur spécifique',
  //   required: false,
  //   example: 'clw67v2440000w4n23m9d4g5j', 
  // })
  @IsString()
  @IsUUID()
  @IsOptional()
  authorId?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Numéro de page pour la pagination (commence à 1)',
    required: false,
    example: 1,
    default: 1,
  })
  @IsOptional()
  page?: number;

  @ApiProperty({
    description: 'Nombre d\'articles par page',
    required: false,
    example: 10,
    default: 10,
  })
  @IsOptional()
  limit?: number;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  search?: string;
}