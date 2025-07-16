// src/notifications/notifications.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationQueryDto } from './dto/create-notification.dto';
import { NotificationResponseDto } from './dto/create-notification.dto';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle notification' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Notification créée avec succès',
    type: NotificationResponseDto
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Données invalides' })
  async create(@Body() createNotificationDto: CreateNotificationDto): Promise<NotificationResponseDto> {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les notifications avec filtres' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Liste des notifications récupérée avec succès',
    type: [NotificationResponseDto]
  })
  @ApiQuery({ name: 'userId', required: false, description: 'ID de l\'utilisateur' })
  @ApiQuery({ name: 'type', required: false, enum: ['INFO', 'WARNING', 'SUCCESS', 'ERROR'] })
  @ApiQuery({ name: 'isRead', required: false, type: 'boolean' })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 10 })
  @ApiQuery({ name: 'offset', required: false, type: 'number', example: 0 })
  async findAll(@Query() query: NotificationQueryDto) {
    return this.notificationsService.findAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtenir les statistiques des notifications' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Statistiques récupérées avec succès'
  })
  @ApiQuery({ name: 'userId', required: false, description: 'ID de l\'utilisateur pour filtrer les stats' })
  async getStats(@Query('userId') userId?: string) {
    return this.notificationsService.getStats(userId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Récupérer les notifications d\'un utilisateur' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Notifications de l\'utilisateur récupérées avec succès',
    type: [NotificationResponseDto]
  })
  @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur' })
  async findByUserId(
    @Param('userId') userId: string,
    @Query() query: NotificationQueryDto
  ) {
    return this.notificationsService.findByUserId(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une notification par ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Notification récupérée avec succès',
    type: NotificationResponseDto
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Notification non trouvée' })
  @ApiParam({ name: 'id', description: 'ID de la notification' })
  async findOne(@Param('id') id: string): Promise<NotificationResponseDto> {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une notification' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Notification mise à jour avec succès',
    type: NotificationResponseDto
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Notification non trouvée' })
  @ApiParam({ name: 'id', description: 'ID de la notification' })
  async update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto
  ): Promise<NotificationResponseDto> {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marquer une notification comme lue' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Notification marquée comme lue',
    type: NotificationResponseDto
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Notification non trouvée' })
  @ApiParam({ name: 'id', description: 'ID de la notification' })
  async markAsRead(@Param('id') id: string): Promise<NotificationResponseDto> {
    return this.notificationsService.markAsRead(id);
  }

  @Patch('user/:userId/read-all')
  @ApiOperation({ summary: 'Marquer toutes les notifications d\'un utilisateur comme lues' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Toutes les notifications marquées comme lues'
  })
  @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur' })
  async markAllAsRead(@Param('userId') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une notification' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Notification supprimée avec succès' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Notification non trouvée' })
  @ApiParam({ name: 'id', description: 'ID de la notification' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.notificationsService.remove(id);
  }

  @Delete('user/:userId/all')
  @ApiOperation({ summary: 'Supprimer toutes les notifications d\'un utilisateur' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Toutes les notifications supprimées'
  })
  @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur' })
  async removeAllByUserId(@Param('userId') userId: string) {
    return this.notificationsService.removeAllByUserId(userId);
  }

  @Delete('cleanup/:days')
  @ApiOperation({ summary: 'Nettoyer les anciennes notifications lues' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Anciennes notifications nettoyées'
  })
  @ApiParam({ name: 'days', description: 'Nombre de jours (notifications plus anciennes seront supprimées)' })
  async cleanupOldNotifications(@Param('days', ParseIntPipe) days: number) {
    return this.notificationsService.cleanupOldNotifications(days);
  }
}