import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsBoolean, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from 'generated/prisma';
import { UserResponseDto } from 'src/users/dto/create-user.dto';

export class CreateTopicDto {

  @ApiProperty()  
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// src/topics/dto/update-topic.dto.ts
// import { IsString, IsOptional, IsBoolean } from 'class-validator';

// export class UpdateTopicDto {
//   @IsOptional()
//   @IsString()
//   name?: string;

//   @IsOptional()
//   @IsString()
//   description?: string;

//   @IsOptional()
//   @IsBoolean()
//   isActive?: boolean;
// }

// src/topics/dto/topic-response.dto.ts
export class TopicResponseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()  
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string | null;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// src/topics/dto/topic-with-relations.dto.ts
// Actuellement commenté car les relations ne sont pas encore définies dans le schéma
// export class TopicWithRelationsDto extends TopicResponseDto {
//   subscriptions?: any[];
//   externalContents?: any[];
//   scrapingSources?: any[];
// }
export class TopicQueryDto {

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

//   @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'sujet' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'firstName' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

//   @ApiPropertyOptional({ example: 'desc' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class PaginatedTopicsDto {
  @ApiProperty({ type: [TopicResponseDto] }) 
  data: TopicResponseDto[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;

  @ApiProperty({ example: true })
  hasNext: boolean;

  @ApiProperty({ example: false })
  hasPrevious: boolean;

}