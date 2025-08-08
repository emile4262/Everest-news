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
  ParseArrayPipe,
  Req,
  BadRequestException,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UserTopicSubscriptionsService } from './user-topic-subscriptions.service';
import {  CreateUserTopicSubscriptionDto, PaginatedUserTopicSubscriptionsDto, UserTopicSubscriptionQueryDto, UserTopicSubscriptionWithRelationsDto } from './dto/create-user-topic-subscription.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { UserRole } from 'generated/prisma';
import { Roles } from 'src/auth/public.decorateur';
import { Request } from 'express';
import {  TopicSelectionResponseDto } from './dto/topic-selection-response.dto';
import { GetUser } from 'src/common/decorateur-getUser';
import { UpdateSubscriptionsDto } from './dto/update-user-topic-subscription.dto';


@ApiTags('user-topic-subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard) 
@Controller('user-topic-subscriptions')
@ApiBearerAuth()
export class UserTopicSubscriptionsController {
  constructor(private readonly userTopicSubscriptionsService: UserTopicSubscriptionsService) {}

  // Créer une nouvelle subscription
  
  
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
  @Get('topics')
  @ApiOperation({ 
    summary: 'Récupérer tous les topics avec statut d\'abonnement',
    description: 'Retourne tous les topics actifs avec l\'indication si l\'utilisateur y est abonné ou non'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Topics récupérés avec succès',
    type: TopicSelectionResponseDto 
  })
  async getTopicsForSelection(
    @GetUser() user: any
  ): Promise<TopicSelectionResponseDto> {
    return this.userTopicSubscriptionsService.getTopicsWithSubscriptionStatus(user.id);
  }


  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
  @Get()
  @ApiOperation({ summary: 'Récupérer les abonnements actuels de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Abonnements récupérés avec succès' })
  async getUserSubscriptions(@GetUser() user: any) {
    return this.userTopicSubscriptionsService.getUserSubscriptions(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
  @Post()
  @ApiOperation({ 
    summary: 'Ajouter des abonnements topics',
    description: 'Ajoute de nouveaux abonnements en gardant les existants. Utilise skipDuplicates pour éviter les doublons.'
  })
  @ApiBody({
    description: 'Liste des topics à souscrire',
    type: [CreateUserTopicSubscriptionDto],
    examples: {
      'Exemple simple': {
        value: [
          { topicId: 'topicId1' },
          { topicId: 'topicId2' },
          { topicId: 'topicId3' }
        ]
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Abonnements créés avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 404, description: 'Utilisateur ou topics non trouvés' })
  async addSubscriptions(
    @Body(new ValidationPipe({ transform: true })) subscriptions: CreateUserTopicSubscriptionDto[],
    @GetUser() user: any
  ) {
    console.log('Données reçues dans le controller:', subscriptions);
    return this.userTopicSubscriptionsService.createAddTopicsToUser(subscriptions, user.id);
  }


  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
  @Put()
  @ApiOperation({ 
    summary: 'Remplacer tous les abonnements',
    description: 'Supprime tous les abonnements actuels et crée les nouveaux'
  })
  @ApiBody({
    type: UpdateSubscriptionsDto,
    examples: {
      'Remplacer abonnements': {
        value: {
          topicIds: ['topicId']
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Abonnements mis à jour avec succès' })
  async updateSubscriptions(
    @Body(new ValidationPipe()) body: UpdateSubscriptionsDto,
    @GetUser() user: any
  ) {
    return this.userTopicSubscriptionsService.updateUserSubscriptions(
      body.topicIds,
      user.id
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER)
  @Delete()
  @ApiOperation({ summary: 'Supprimer des abonnements spécifiques' })
  @ApiBody({
    type: UpdateSubscriptionsDto,
    examples: {
      'Supprimer abonnements': {
        value: {
          topicIds: ['topicId']
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Abonnements supprimés avec succès' })
  async removeSubscriptions(
    @Body(new ValidationPipe()) body: UpdateSubscriptionsDto,
    @GetUser() user: any
  ) {
    return this.userTopicSubscriptionsService.removeSubscriptions(
      body.topicIds,
      user.id
    );
  }

  // // Route de développement pour créer des topics de test
  // @Post('dev/create-test-topics')
  // @ApiOperation({ 
  //   summary: '[DEV] Créer des topics de test',
  //   description: 'Route de développement pour créer des topics de test. À supprimer en production.'
  // })
  // async createTestTopics() {
  //   return this.userTopicSubscriptionsService.createTestTopics();
  // }
}