import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { UserTopicSubscriptionsService } from './user-topic-subscriptions.service';
import { CreateUserTopicSubscriptionDto, PaginatedUserTopicSubscriptionsDto, UserTopicSubscriptionQueryDto, UserTopicSubscriptionWithRelationsDto } from './dto/create-user-topic-subscription.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { UserRole } from 'generated/prisma';
import { Roles } from 'src/auth/public.decorateur';

@ApiTags('user-topic-subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard) 
@Controller('user-topic-subscriptions')
@ApiBearerAuth()
export class UserTopicSubscriptionsController {
  constructor(private readonly userTopicSubscriptionsService: UserTopicSubscriptionsService) {}

  // Créer une nouvelle subscription
  
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer une nouvelle subscription' })
  @ApiResponse({
    status: 201,
    description: 'Subscription créée avec succès',
    type: UserTopicSubscriptionWithRelationsDto,
  })
  @ApiResponse({ status: 404, description: 'Utilisateur ou topic non trouvé' })
  @ApiResponse({ status: 409, description: 'Subscription déjà existante' })
  create(@Body() createUserTopicSubscriptionDto: CreateUserTopicSubscriptionDto) {
    return this.userTopicSubscriptionsService.create(createUserTopicSubscriptionDto);
  }

  // Récupérer toutes les subscriptions avec pagination et filtres

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
  @Get()
  @ApiOperation({ summary: 'Obtenir toutes les subscriptions avec pagination' })
  @ApiResponse({
    status: 200,
    description: 'Liste des subscriptions récupérée avec succès',
    type: PaginatedUserTopicSubscriptionsDto,
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'topicId', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  async findAll(@Query() query: UserTopicSubscriptionQueryDto): Promise<PaginatedUserTopicSubscriptionsDto> {
    return this.userTopicSubscriptionsService.findAll(query);
  }

  // Récupérer une subscription 
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
  @Get('stats')
  @ApiOperation({ summary: 'Obtenir les statistiques des subscriptions' })
  @ApiResponse({
    status: 200,
    description: 'Statistiques récupérées avec succès',
  })
  getStats() {
    return this.userTopicSubscriptionsService.getSubscriptionStats();
  }

  // Récupérer les subscriptions d'un utilisateur

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtenir les subscriptions d\'un utilisateur' })
  @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Subscriptions de l\'utilisateur récupérées avec succès',
  })
  getUserSubscriptions(@Param('userId') userId: string) {
    return this.userTopicSubscriptionsService.getUserSubscriptions(userId);
  }

  // Vérifier si un utilisateur est abonné à un topic

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
  @Get('topic/:topicId')
  @ApiOperation({ summary: 'Obtenir les subscriptions d\'un topic' })
  @ApiParam({ name: 'topicId', description: 'ID du topic' })
  @ApiResponse({
    status: 200,
    description: 'Subscriptions du topic récupérées avec succès',
  })
  getTopicSubscriptions(@Param('topicId') topicId: string) {
    return this.userTopicSubscriptionsService.getTopicSubscriptions(topicId);
  }

  // Vérifier si un utilisateur est abonné à un topic

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
  @Get('user/:userId/topic/:topicId')
  @ApiOperation({ summary: 'Vérifier si un utilisateur est abonné à un topic' })
  @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur' })
  @ApiParam({ name: 'topicId', description: 'ID du topic' })
  @ApiResponse({
    status: 200,
    description: 'Subscription trouvée',
    type: UserTopicSubscriptionWithRelationsDto,
  })
  @ApiResponse({ status: 404, description: 'Subscription non trouvée' })
  findByUserAndTopic(@Param('userId') userId: string, @Param('topicId') topicId: string) {
    return this.userTopicSubscriptionsService.findByUserAndTopic(userId, topicId);
  }

  // Récupérer une subscription par ID

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une subscription par ID' })
  @ApiParam({ name: 'id', description: 'ID de la subscription' })
  @ApiResponse({
    status: 200,
    description: 'Subscription récupérée avec succès',
    type: UserTopicSubscriptionWithRelationsDto,
  })
  @ApiResponse({ status: 404, description: 'Subscription non trouvée' })
  findOne(@Param('id') id: string) {
    return this.userTopicSubscriptionsService.findOne(id);
  }

  // Supprimer une subscription par ID

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une subscription par ID' })
  @ApiParam({ name: 'id', description: 'ID de la subscription' })
  @ApiResponse({ status: 204, description: 'Subscription supprimée avec succès' })
  @ApiResponse({ status: 404, description: 'Subscription non trouvée' })
  remove(@Param('id') id: string) {
    return this.userTopicSubscriptionsService.remove(id);
  }

  // Supprimer une subscription par utilisateur et topic

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
  @Delete('user/:userId/topic/:topicId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une subscription par utilisateur et topic' })
  @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur' })
  @ApiParam({ name: 'topicId', description: 'ID du topic' })
  @ApiResponse({ status: 204, description: 'Subscription supprimée avec succès' })
  @ApiResponse({ status: 404, description: 'Subscription non trouvée' })
  removeByUserAndTopic(@Param('userId') userId: string, @Param('topicId') topicId: string) {
    return this.userTopicSubscriptionsService.removeByUserAndTopic(userId, topicId);
  }
}