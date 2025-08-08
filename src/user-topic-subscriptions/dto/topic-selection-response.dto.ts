import { ApiProperty } from "@nestjs/swagger";
import { TopicSelectionDto } from "./topic-selection.dto";

export class TopicSelectionResponseDto {
  @ApiProperty({ type: [TopicSelectionDto] })
  topics: TopicSelectionDto[];

  @ApiProperty({ example: 3 })
  userSubscriptionsCount: number;
}