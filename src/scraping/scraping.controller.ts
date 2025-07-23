import { ClassSerializerInterceptor, Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { ScrapingDto } from './dto/create-scraping.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'generated/prisma';
import { Roles } from 'src/auth/public.decorateur';

@ApiTags('Scraping')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('scraping')
export class ScrapingController {
  constructor(private readonly youtubeService: ScrapingService
              , private readonly devtoService: ScrapingService
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
  @Get('youtube')
  @ApiOperation({ summary: 'Scraper YouTube par mot-clé' })
  @ApiQuery({ name: 'query', required: true, type: String, description: ' recherche' })
  @ApiQuery({ name: 'maxResults', required: false, type: Number, description: 'Nombre maximum de résultats à retourner' })
  async scrapeYouTube(@Query() dto: ScrapingDto) {
    const { query, maxResults = 10 } = dto;
    return this.youtubeService.scrapeByKeyword(query, maxResults);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
  @Get('devto')
  @ApiOperation({ summary: 'Scraper les informations du forum develop' })
  @ApiQuery({ name: 'maxResults', required: false, type: Number, description: 'Nombre maximum de résultats à retourner' })
  @ApiQuery({ name: 'query', required: true, type: String, description: 'recherche' })
  async scrapeInformationListing(@Query('query') query: string, @Query('maxResults') maxResults = 10) {
    return this.devtoService.scrapeByKeyword(query, maxResults);
  }
}