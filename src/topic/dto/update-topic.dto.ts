import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateTopicDto {
   
  @ApiProperty()  
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;
  

  @ApiProperty() 
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}