import { BadRequestException, ClassSerializerInterceptor, Controller, Get, Param, Query, UseGuards, UseInterceptors } from '@nestjs/common';
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
  constructor(
    private readonly scrapingService: ScrapingService,
    // private readonly mediumService: ScrapingService
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
  @Get('youtube')
  @ApiOperation({ summary: 'Scraper YouTube par mot-clé' })
  @ApiQuery({ name: 'topicId', required: false, type: String, description: 'ID du topic pour filtrer les résultats' })
  @ApiQuery({ name: 'query', required: false, type: String, description: ' recherche' })
  @ApiQuery({ name: 'maxResults', required: false, type: Number, description: 'Nombre maximum de résultats à retourner' })
  async scrapeYouTube(@Query() dto: ScrapingDto) {
    const { query, maxResults = 5 , topicId} = dto;
    return this.scrapingService.scrapePopularVideosByTopic(query, maxResults, topicId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
  @Get('devto')
  @ApiOperation({ summary: 'Scraper les informations du forum develop' })
  @ApiQuery({ name: 'topicId', required: false, type: String, description: 'ID du topic pour filtrer les résultats' })
  @ApiQuery({ name: 'query', required: false, type: String, description: ' recherche' })
  @ApiQuery({ name: 'maxResults', required: false, type: Number, description: 'Nombre maximum de résultats à retourner' })
  async scrapeDevto(@Query() dto: ScrapingDto): Promise<any> {
    const { query, maxResults = 5, topicId } = dto;
    const url = 'https://dev.to/t/' + (query || 'javascript'); // example URL, adjust as needed
    const save = false; // or true, depending on your requirements
    return this.scrapingService.scrapeDevtoListings(query, maxResults, topicId, url, save); 
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
  // @Get('medium')
  // @ApiOperation({ summary: 'Scraper Medium par mot-clé' })
  // @ApiQuery({ name: 'query', required: true, type: String, description: 'recherche' })
  // async getMediumByTag(@Param('tag') tag: string) {
  //   return this.mediumService.scrapeMediumCategory(tag);
  // }
}