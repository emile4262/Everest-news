// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   Query,
//   UseGuards,
//   HttpCode,
//   HttpStatus,
//   ParseUUIDPipe,
//   UseInterceptors,
//   ClassSerializerInterceptor,
// } from '@nestjs/common';
// import {
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
//   ApiQuery,
//   ApiBearerAuth,
//   ApiParam,
// } from '@nestjs/swagger';
// import { ExternalContentService } from './external-content.service';
// import {
//   CreateExternalContentDto,
//   ExternalContentResponseDto,
// } from './dto/create-external-content.dto';
// import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
// import { RolesGuard } from 'src/auth/roles.guard';
// import { UserRole } from 'generated/prisma';
// import { Roles } from 'src/auth/public.decorateur';
// import { UpdateExternalContentDto } from './dto/update-external-content.dto';
// import { ExternalContentQueryDto } from './dto/External-content-query.dto';
// import { ExternalContentEnum } from 'src/common/enums/external-content.enum';

// @ApiTags('External Content')
// @ApiBearerAuth()
// @UseInterceptors(ClassSerializerInterceptor)
// @Controller('external-content')
// export class ExternalContentController {
//   constructor(private readonly externalContentService: ExternalContentService) {}

//   @Post()
//   @UseGuards(JwtAuthGuard, RolesGuard) 
//   @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
//   @ApiOperation({ summary: 'Créer un nouveau contenu externe' })
//   @ApiResponse({
//     status: 201,
//     description: 'Contenu externe créé avec succès',
//     type: ExternalContentResponseDto,
//   })
//   @ApiResponse({ status: 400, description: 'Données invalides' })
//   @ApiResponse({ status: 404, description: 'Topic non trouvé' })
//   @ApiResponse({ status: 409, description: 'URL déjà existante' })
//   create(@Body() createDto: CreateExternalContentDto): Promise<ExternalContentResponseDto> {
//     return this.externalContentService.create(createDto);
//   }

//   @Get()
//   @UseGuards(JwtAuthGuard, RolesGuard) 
//   @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
//   @ApiOperation({ summary: 'Récupérer tous les contenus externes avec pagination et filtres' })
//   // @ApiResponse({
//   //   status: 200,
//   //   description: 'Liste des contenus externes',
//   //   schema: {
//   //     type: 'object',
//   //     properties: {
//   //       data: {
//   //         type: 'array',
//   //         items: { $ref: '#/components/schemas/ExternalContentResponseDto' },
//   //       },
//   //       total: { type: 'number' },
//   //       page: { type: 'number' },
//   //       limit: { type: 'number' },
//   //       totalPages: { type: 'number' },
//   //     },
//   //   },
//   // })
//   @ApiQuery({ name: 'page', required: false, type: Number, description: 'Numéro de page' })
//   @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Nombre d\'éléments par page' })
//   @ApiQuery({ name: 'search', required: false, type: String, description: 'Recherche par titre, auteur ou résumé' })
//   @ApiQuery({ name: 'type',required: false, isArray: true })
//   // @ApiQuery({ name: 'topicId', required: false, type: String, description: 'Filtrer par topic' })
//   @ApiQuery({ name: 'source', required: false, type: String, description: 'Filtrer par source' })
//   @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filtrer par statut actif' })
//   @ApiQuery({ name: 'sortBy', required: false, enum: ['scrapedAt', 'publishedAt', 'title'], description: 'Trier par' })
//   @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Ordre de tri' })
//   findAll(@Query() query: ExternalContentQueryDto) {
//     return this.externalContentService.findAll(query);
//   }

//   @Get('stats')
//   @UseGuards(JwtAuthGuard, RolesGuard) 
//   @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
//   @ApiOperation({ summary: 'Récupérer les statistiques des contenus externes' })
//   @ApiResponse({
//     status: 200,
//     description: 'Statistiques des contenus externes',
//     schema: {
//       type: 'object',
//       properties: {
//         total: { type: 'number' },
//         byType: { type: 'object' },
//         bySource: { type: 'object' },
//         active: { type: 'number' },
//         inactive: { type: 'number' },
//       },
//     },
//   })
//   getStats() {
//     return this.externalContentService.getStats();
//   }

//   // @Get('topic/:topicId')
//   // @UseGuards(JwtAuthGuard, RolesGuard) 
//   // @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
//   // @ApiOperation({ summary: 'Récupérer les contenus externes par topic' })
//   // @ApiParam({ name: 'topicId', description: 'ID du topic' })
//   // @ApiResponse({
//   //   status: 200,
//   //   description: 'Liste des contenus externes du topic',
//   //   type: [ExternalContentResponseDto],
//   // })
//   // @ApiQuery({ name: 'type', required: false, enum: ExternalContentType, description: 'Filtrer par type' })
//   // @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filtrer par statut actif' })
//   // @ApiQuery({ name: 'sortBy', required: false, enum: ['scrapedAt', 'publishedAt', 'title'], description: 'Trier par' })
//   // @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Ordre de tri' })
//   // findByTopic(
//   //   @Param('topicId', ParseUUIDPipe) topicId: string,
//   //   @Query() query?: Partial<ExternalContentQueryDto>
//   // ): Promise<ExternalContentResponseDto[]> {
//   //   return this.externalContentService.findByTopic(topicId, query);
//   // }

//   @Get('source/:source')
//   @UseGuards(JwtAuthGuard, RolesGuard) 
//   @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
//   @ApiOperation({ summary: 'Récupérer les contenus externes par source' })
//   @ApiParam({ name: 'source', description: 'Source du contenu' })
//   @ApiResponse({
//     status: 200,
//     description: 'Liste des contenus externes de la source',
//     type: [ExternalContentResponseDto],
//   })
//   findBySource(@Param('source') source: string): Promise<ExternalContentResponseDto[]> {
//     return this.externalContentService.findBySource(source);
//   }

//   @Get('type/:type')
//   @UseGuards(JwtAuthGuard, RolesGuard) 
//   @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
//   @ApiOperation({ summary: 'Récupérer les contenus externes par type' })
//   @ApiParam({ name: 'type', enum: ExternalContentEnum, description: 'Type de contenu' })
//   @ApiResponse({
//     status: 200,
//     description: 'Liste des contenus externes du type',
//     type: [ExternalContentResponseDto],
//   })
//   findByType(@Param('type') type: ExternalContentEnum): Promise<ExternalContentResponseDto[]> {
//     return this.externalContentService.findByType(type);
//   }

//   @Get(':id')
//   @UseGuards(JwtAuthGuard, RolesGuard) 
//   @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
//   @ApiOperation({ summary: 'Récupérer un contenu externe par ID' })
//   @ApiParam({ name: 'id', description: 'ID du contenu externe' })
//   @ApiResponse({
//     status: 200,
//     description: 'Contenu externe trouvé',
//     type: ExternalContentResponseDto,
//   })
//   @ApiResponse({ status: 404, description: 'Contenu externe non trouvé' })
//   async findOne(@Param('id') id: string): Promise<ExternalContentResponseDto> {
//   return this.externalContentService.findOne(id);
// }

// @Patch(':id')
// @UseGuards(JwtAuthGuard, RolesGuard) 
// @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
// @ApiOperation({ summary: 'Mettre à jour un contenu externe' })
// @ApiParam({ name: 'id', description: 'ID du contenu externe' })
// @ApiResponse({
//   status: 200,
//   description: 'Contenu externe mis à jour',
//   type: ExternalContentResponseDto,
// })
// @ApiResponse({ status: 404, description: 'Contenu externe non trouvé' })
// @ApiResponse({ status: 409, description: 'URL déjà existante' })
// update(
//   @Param('id', ParseUUIDPipe) id: string,
//   @Body() dto: UpdateExternalContentDto
// ): Promise<ExternalContentResponseDto> {
//   return this.externalContentService.update({ ...dto, id });
// }

//   @Patch(':id/toggle-active')
//   @UseGuards(JwtAuthGuard, RolesGuard) 
//   @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
//   @ApiOperation({ summary: 'Activer/Désactiver un contenu externe' })
//   @ApiParam({ name: 'id', description: 'ID du contenu externe' })
//   @ApiResponse({
//     status: 200,
//     description: 'Statut du contenu externe modifié',
//     type: ExternalContentResponseDto,
//   })
//   @ApiResponse({ status: 404, description: 'Contenu externe non trouvé' })
//     async toggleActive(@Param('id') id: string) {
//   return this.externalContentService.toggleActive(id);
// }

//   @Delete(':id')
//   @UseGuards(JwtAuthGuard, RolesGuard) 
//   @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
//   @HttpCode(HttpStatus.NO_CONTENT)
//   @ApiOperation({ summary: 'Supprimer un contenu externe' })
//   @ApiParam({ name: 'id', description: 'ID du contenu externe' })
//   @ApiResponse({ status: 204, description: 'Contenu externe supprimé' })
//   @ApiResponse({ status: 404, description: 'Contenu externe non trouvé' })
//   remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
//     return this.externalContentService.remove(id);
//   }
// }