import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ScrapingLogService } from './scraping-log.service';
import { CreateScrapingLogDto } from './dto/create-scraping-log.dto';
import { UpdateScrapingLogDto } from './dto/update-scraping-log.dto';
import { ScrapingLogResponseDto } from './dto/create-scraping-log.dto';
import { ScrapingLogQueryDto } from './dto/create-scraping-log.dto';

@ApiTags('Scraping Logs')
@Controller('scraping-logs')
export class ScrapingLogController {
  constructor(private readonly scrapingLogService: ScrapingLogService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un nouveau log de scraping' })
  @ApiResponse({
    status: 201,
    description: 'Log de scraping créé avec succès',
    type: ScrapingLogResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  async create(@Body() createScrapingLogDto: CreateScrapingLogDto) {
    return await this.scrapingLogService.create(createScrapingLogDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les logs de scraping avec pagination et filtres' })
  @ApiResponse({
    status: 200,
    description: 'Liste des logs de scraping récupérée avec succès',
  })
  async findAll(@Query() query: ScrapingLogQueryDto) {
    return await this.scrapingLogService.findAll(query);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Récupérer les statistiques des logs de scraping' })
  @ApiResponse({
    status: 200,
    description: 'Statistiques récupérées avec succès',
  })
  async getStatistics() {
    return await this.scrapingLogService.getStatistics();
  }

  @Get('recent-errors')
  @ApiOperation({ summary: 'Récupérer les erreurs récentes' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Nombre d\'erreurs à récupérer',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Erreurs récentes récupérées avec succès',
  })
  async getRecentErrors(@Query('limit') limit?: number) {
    return await this.scrapingLogService.getRecentErrors(limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un log de scraping par son ID' })
  @ApiParam({
    name: 'id',
    description: 'ID du log de scraping',
    example: 'clt1234567890abcdef',
  })
  @ApiResponse({ 
    status: 200,
    description: 'Log de scraping récupéré avec succès',
    type: ScrapingLogResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Log de scraping non trouvé',
  })
  async findOne(@Param('id') id: string) {
    return await this.scrapingLogService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un log de scraping' })
  @ApiParam({
    name: 'id',
    description: 'ID du log de scraping',
    example: 'clt1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Log de scraping mis à jour avec succès',
    type: ScrapingLogResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Log de scraping non trouvé',
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  async update(
    @Param('id') id: string,
    @Body() updateScrapingLogDto: UpdateScrapingLogDto,
  ) {
    return await this.scrapingLogService.update(id, updateScrapingLogDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un log de scraping' })
  @ApiParam({
    name: 'id',
    description: 'ID du log de scraping',
    example: 'clt1234567890abcdef',
  })
  @ApiResponse({
    status: 204,
    description: 'Log de scraping supprimé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Log de scraping non trouvé',
  })
  async remove(@Param('id') id: string) {
    await this.scrapingLogService.remove(id);
  }
}
