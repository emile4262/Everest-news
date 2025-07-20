// src/articles/article.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport'; 
import { UserRole } from '@prisma/client'; 
import { Request } from 'express'; 
import { ArticleService } from './articles.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/public.decorateur';
import { CreateArticleDto, FilterArticleDto, UpdateArticleDto } from './dto/create-article.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

// Interface pour étendre l'objet Request d'Express avec l'utilisateur authentifié
interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: UserRole; 
  };
}

@ApiTags('Articles') 
@ApiBearerAuth() 
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  
    //Crée un nouvel article.
    //Seuls les administrateurs et managers peuvent créer des articles.
   
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Créer un nouvel article' })
  @ApiResponse({ status: 201, description: 'Article créé avec succès.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  async create(@Body() createArticleDto: CreateArticleDto, @Req() req: AuthenticatedRequest) {
    const authorId = req.user.userId;
    return this.articleService.create(createArticleDto, authorId);
  }

  
   // Récupère tous les articles, avec des options de filtrage et de pagination.
    // Tous les utilisateurs authentifiés peuvent lister les articles.
   
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Lister tous les articles avec filtres par status et pagination' })
  @ApiResponse({ status: 200, description: 'Liste des articles récupérée avec succès.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  async findAll(@Query() filterDto: FilterArticleDto) {
    return this.articleService.findAll(filterDto);
  }

  
    // Récupère un article spécifique par son ID.
    // Tous les utilisateurs authentifiés peuvent lire un article.
   
  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Récupérer un article par ID' })
  @ApiResponse({ status: 200, description: 'Article récupéré avec succès.' })
  @ApiResponse({ status: 404, description: 'Article non trouvé.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  async findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  // Met à jour un article existant.
   // Seuls l'auteur de l'article, les managers et les administrateurs peuvent le modifier.
   
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE) 
  @ApiOperation({ summary: 'Mettre à jour un article' })
  @ApiResponse({ status: 200, description: 'Article mis à jour avec succès.' })
  @ApiResponse({ status: 404, description: 'Article non trouvé.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  async update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto, @Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    const userRole = req.user.role;
    return this.articleService.update(id, updateArticleDto, userId, userRole);
  }

  // Supprime un article.
   // Seuls l'auteur de l'article, les managers et les administrateurs peuvent le supprimer.
   
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content pour une suppression réussie
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE) // L'employé peut supprimer s'il est l'auteur
  @ApiOperation({ summary: 'Supprimer un article' })
  @ApiResponse({ status: 204, description: 'Article supprimé avec succès.' })
  @ApiResponse({ status: 404, description: 'Article non trouvé.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    const userRole = req.user.role;
    await this.articleService.remove(id, userId, userRole);
  }

  // Publie un article (change son statut à PUBLISHED).
   // Seuls l'auteur de l'article, les managers et les administrateurs peuvent publier.
   
  @Patch(':id/publish')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE) 
  @ApiOperation({ summary: 'Publier un article' })
  @ApiResponse({ status: 200, description: 'Article publié avec succès.' })
  @ApiResponse({ status: 404, description: 'Article non trouvé.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  async publish(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    const userRole = req.user.role;
    return this.articleService.publish(id, userId, userRole);
  }

  
   // Archive un article (change son statut à ARCHIVED).
    //Seuls l'auteur de l'article, les managers et les administrateurs peuvent archiver.
   
  @Patch(':id/archive')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE) 
  @ApiOperation({ summary: 'Archiver un article' })
  @ApiResponse({ status: 200, description: 'Article archivé avec succès.' })
  @ApiResponse({ status: 404, description: 'Article non trouvé.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  async archive(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    const userRole = req.user.role;
    return this.articleService.archive(id, userId, userRole);
  }

  // Marque un article comme lu par l'utilisateur.
   
  @Patch(':id/read')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE) 
  @ApiOperation({ summary: 'Marquer un article comme lu' })
  @ApiResponse({ status: 200, description: 'Article marqué comme lu.' })
  @ApiResponse({ status: 404, description: 'Article non trouvé.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  async markAsRead(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.articleService.markAsRead(userId, id);
  }
} 
