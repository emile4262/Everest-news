import { PartialType } from '@nestjs/swagger';
import { CreateExternalContentDto } from './create-external-content.dto';

export class UpdateExternalContentDto extends PartialType(CreateExternalContentDto) {}
