// src/notifications/notifications.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateNotificationDto, NotificationType } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationQueryDto } from './dto/create-notification.dto';
import { NotificationResponseDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  // Créer une nouvelle notification
  async create(createNotificationDto: CreateNotificationDto): Promise<NotificationResponseDto> {
    try {
      const notification = await this.prisma.notification.create({
        data: {
          userId: createNotificationDto.userId,
          title: createNotificationDto.title,
          message: createNotificationDto.message,
          type: createNotificationDto.type || NotificationType.INFO,
          isRead: createNotificationDto.isRead || false,
        }, 
      });  

      return this.mapToResponseDto(notification);
    } catch (error) {
      throw new BadRequestException('Erreur lors de la création de la notification');
    }
  }

  // Récupérer toutes les notifications avec filtres
  async findAll(query: NotificationQueryDto): Promise<{
    notifications: NotificationResponseDto[];
    total: number;
    hasMore: boolean;
  }> {
    const { userId, type, isRead, limit = 10, offset = 0 } = query;

    const where: any = {};
    
    if (userId) where.userId = userId;
    if (type) where.type = type;
    if (isRead !== undefined) where.isRead = isRead;

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.notification.count({ where }),
    ]);

    const hasMore = offset + limit < total;

    return {
      notifications: notifications.map(notification => this.mapToResponseDto(notification)),
      total,
      hasMore,
    };
  }

  // Récupérer une notification par ID
  async findOne(id: string): Promise<NotificationResponseDto> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification avec l'ID ${id} non trouvée`);
    }

    return this.mapToResponseDto(notification);
  }

  // Récupérer les notifications d'un utilisateur
  async findByUserId(userId: string, query: NotificationQueryDto): Promise<{
    notifications: NotificationResponseDto[];
    total: number;
    unreadCount: number;
    hasMore: boolean;
  }> {
    const { type, isRead, limit = 10, offset = 0 } = query;

    const where: any = { userId };
    if (type) where.type = type;
    if (isRead !== undefined) where.isRead = isRead;

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({ 
        where: { userId, isRead: false } 
      }),
    ]);

    const hasMore = offset + limit < total;

    return {
      notifications: notifications.map(notification => this.mapToResponseDto(notification)),
      total,
      unreadCount,
      hasMore,
    };
  }

  // Mettre à jour une notification
  async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<NotificationResponseDto> {
    const existingNotification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!existingNotification) {
      throw new NotFoundException(`Notification avec l'ID ${id} non trouvée`);
    }

    const updatedNotification = await this.prisma.notification.update({
      where: { id },
      data: updateNotificationDto,
    });

    return this.mapToResponseDto(updatedNotification);
  }

  // Marquer une notification comme lue
  async markAsRead(id: string): Promise<NotificationResponseDto> {
    return this.update(id, { isRead: true });
  }

  // Marquer toutes les notifications d'un utilisateur comme lues
  async markAllAsRead(userId: string): Promise<{ count: number }> {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return { count: result.count };
  }

  // Supprimer une notification
  async remove(id: string): Promise<void> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification avec l'ID ${id} non trouvée`);
    }

    await this.prisma.notification.delete({
      where: { id },
    });
  }

  // Supprimer toutes les notifications d'un utilisateur
  async removeAllByUserId(userId: string): Promise<{ count: number }> {
    const result = await this.prisma.notification.deleteMany({
      where: { userId },
    });

    return { count: result.count };
  }

  // Supprimer les notifications lues anciennes (nettoyage)
  async cleanupOldNotifications(daysOld: number = 30): Promise<{ count: number }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await this.prisma.notification.deleteMany({
      where: {
        isRead: true,
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    return { count: result.count };
  }

  // Obtenir les statistiques des notifications
  async getStats(userId?: string): Promise<{
    total: number;
    unread: number;
    byType: Record<NotificationType, number>;
  }> {
    const where = userId ? { userId } : {};

    const [total, unread, byType] = await Promise.all([
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({ where: { ...where, isRead: false } }),
      this.prisma.notification.groupBy({
        by: ['type'],
        where,
        _count: { type: true },
      }),
    ]);

    const typeStats = Object.values(NotificationType).reduce((acc, type) => {
      acc[type] = 0;
      return acc;
    }, {} as Record<NotificationType, number>);

    byType.forEach((item) => {
      typeStats[item.type as NotificationType] = item._count.type;
    });

    return {
      total,
      unread,
      byType: typeStats,
    };
  }

  // Mapper vers DTO de réponse
  private mapToResponseDto(notification: any): NotificationResponseDto {
    return {
      id: notification.id,
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    };
  }
}