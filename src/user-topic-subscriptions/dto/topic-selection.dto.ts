import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class TopicSelectionDto {
  @ApiProperty({ example: 'cm5abc123def456ghi789jkl' })
  id: string;

  @ApiProperty({ example: 'Technologie' })
  name: string;

  @ApiProperty({ required: false, nullable: true })
  description?: string | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: true, description: 'Indique si l\'utilisateur est abonné à ce topic' })
  isSubscribed: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}