// import { PartialType } from '@nestjs/mapped-types';
// import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
// import { CreateArticleDto } from './create-article.dto';
// // import { ArticleStatus } from '../entities/article.entity';


// export enum ArticleStatus {
//   DRAFT = 'draft',
//   PUBLISHED = 'published',
//   ARCHIVED = 'archived',
// }

// export class UpdateArticleDto extends PartialType(CreateArticleDto) {
//   @IsString()
//   @IsOptional()
//   title?: string;

//   @IsString()
//   @IsOptional()
//   content?: string;

//   @IsString()
//   @IsOptional()
//   summary?: string;

//   // @IsEnum(ArticleCategory)
//   // @IsOptional()
//   // category?: ArticleCategory;

// //   @IsEnum(ArticleStatus)
// //   @IsOptional()
// //   status?: ArticleStatus;

//   @IsDateString()
//   @IsOptional()
//   publishedAt?: string;

//   @IsString()
//   @IsOptional()
//   authorId?: string;
// }