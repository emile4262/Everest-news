import { PartialType } from '@nestjs/swagger';
import { CreateScrapingSourceDto } from './create-scraping-source.dto';

export class UpdateScrapingSourceDto extends PartialType(CreateScrapingSourceDto) {}
