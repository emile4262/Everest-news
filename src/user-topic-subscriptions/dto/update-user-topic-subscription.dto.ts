import { PartialType } from '@nestjs/swagger';
import { CreateUserTopicSubscriptionDto } from './create-user-topic-subscription.dto';

export class UpdateUserTopicSubscriptionDto extends PartialType(CreateUserTopicSubscriptionDto) {}
