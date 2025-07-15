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
  UseGuards,
  Put
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody
} from '@nestjs/swagger';
import { ScrapingSourceService } from './scraping-source.service';
import {
  CreateScrapingSourceDto,
  UpdateScrapingSourceDto,
  ScrapingSourceResponseDto,
  ScrapingSourceQueryDto,
  UpdateLastScrapedDto
} from './dto/create-scraping-source.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'generated/prisma';
import { Roles } from 'src/auth/public.decorateur';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

@ApiTags('Scraping Sources')
@Controller('scraping-sources')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ScrapingSourceController {
  constructor(private readonly scrapingSourceService: ScrapingSourceService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Créer une nouvelle source de scraping' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Source de scraping créée avec succès',
    type: ScrapingSourceResponseDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides ou URL déjà existante'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Topic non trouvé'
  })
  async create(@Body() createDto: CreateScrapingSourceDto) {
    return await this.scrapingSourceService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les sources de scraping avec filtres' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Liste des sources de scraping récupérée avec succès',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/ScrapingSourceResponseDto' }
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' }
      }
    }
  })
  @ApiQuery({ name: 'topicId', required: false, description: 'Filtrer par topic ID' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filtrer par statut actif' })
  @ApiQuery({ name: 'search', required: false, description: 'Recherche par nom ou URL' })
  @ApiQuery({ name: 'page', required: false, description: 'Numéro de page' })
  @ApiQuery({ name: 'limit', required: false, description: 'Nombre d\'éléments par page' })
  async findAll(@Query() query: ScrapingSourceQueryDto) {
    return await this.scrapingSourceService.findAll(query);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Obtenir les statistiques des sources de scraping' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Statistiques récupérées avec succès',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        active: { type: 'number' },
        inactive: { type: 'number' },
        recentlyScraped: { type: 'number' }
      }
    }
  })
  async getStatistics() {
    return await this.scrapingSourceService.getStatistics();
  }

  @Get('active')
  @ApiOperation({ summary: 'Récupérer toutes les sources actives' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sources actives récupérées avec succès',
    type: [ScrapingSourceResponseDto]
  })
  async findActiveSources() {
    return await this.scrapingSourceService.findActiveSources();
  }

  @Get('topic/:topicId')
  @ApiOperation({ summary: 'Récupérer les sources d\'un topic spécifique' })
  @ApiParam({ name: 'topicId', description: 'ID du topic' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sources du topic récupérées avec succès',
    type: [ScrapingSourceResponseDto]
  })
  async findByTopic(@Param('topicId') topicId: string) {
    return await this.scrapingSourceService.findByTopic(topicId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une source de scraping par ID' })
  @ApiParam({ name: 'id', description: 'ID de la source de scraping' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Source de scraping récupérée avec succès',
    type: ScrapingSourceResponseDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Source de scraping non trouvée'
  })
  async findOne(@Param('id') id: string) {
    return await this.scrapingSourceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une source de scraping' })
  @ApiParam({ name: 'id', description: 'ID de la source de scraping' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Source de scraping mise à jour avec succès',
    type: ScrapingSourceResponseDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Source de scraping non trouvée'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides'
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateScrapingSourceDto
  ) {
    return await this.scrapingSourceService.update(id, updateDto);
  }

  @Put(':id/last-scraped')
  @ApiOperation({ summary: 'Mettre à jour la date du dernier scraping' })
  @ApiParam({ name: 'id', description: 'ID de la source de scraping' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Date du dernier scraping mise à jour avec succès',
    type: ScrapingSourceResponseDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Source de scraping non trouvée'
  })
  async updateLastScraped(
    @Param('id') id: string,
    @Body() updateDto: UpdateLastScrapedDto
  ) {
    return await this.scrapingSourceService.updateLastScraped(id, updateDto);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Activer/désactiver une source de scraping' })
  @ApiParam({ name: 'id', description: 'ID de la source de scraping' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Statut de la source modifié avec succès',
    type: ScrapingSourceResponseDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Source de scraping non trouvée'
  })
  async toggleActive(@Param('id') id: string) {
    return await this.scrapingSourceService.toggleActive(id);
  }

  @Patch('bulk/toggle-active')
  @ApiOperation({ summary: 'Activer/désactiver plusieurs sources en lot' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: { type: 'string' },
          description: 'Liste des IDs des sources'
        },
        isActive: {
          type: 'boolean',
          description: 'Nouveau statut actif'
        }
      },
      required: ['ids', 'isActive']
    }
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sources mises à jour avec succès',
    schema: {
      type: 'object',
      properties: {
        updated: { type: 'number' }
      }
    }
  })
  async bulkToggleActive(
    @Body() body: { ids: string[]; isActive: boolean }
  ) {
    return await this.scrapingSourceService.bulkToggleActive(body.ids, body.isActive);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une source de scraping' })
  @ApiParam({ name: 'id', description: 'ID de la source de scraping' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Source de scraping supprimée avec succès'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Source de scraping non trouvée'
  })
  async remove(@Param('id') id: string) {
    return await this.scrapingSourceService.remove(id);
  }
}