import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsUUID } from "class-validator";

export class UpdateSubscriptionsDto {
  @ApiProperty({
    description: 'Liste des IDs de topics pour remplacer les abonnements actuels',
    type: [String],
    example: ['cm5abc123def456ghi789jkl', 'cm5def456ghi789jklabc123']
  })
  @IsArray({ message: 'topicIds doit être un tableau' })
  @IsUUID(undefined, { each: true, message: 'Chaque topicId doit être un UUID valide' })
  topicIds: string[];
}