import { IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";

export class ScrapingDto {

  @ValidateIf(o => !o.topicId)  
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  maxResults?: number;

  @IsOptional()
  @IsString()
  topicId?: string;
}

