import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserTopicSubscriptionDto, PaginatedUserTopicSubscriptionsDto, UserTopicSubscriptionQueryDto } from './dto/create-user-topic-subscription.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserTopicSubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async create(createUserTopicSubscriptionDto: CreateUserTopicSubscriptionDto) {
    const { userId, topicId } = createUserTopicSubscriptionDto;

    // Vérifier que l'utilisateur existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    // Vérifier que le topic existe et est actif
    const topic = await this.prisma.topic.findUnique({
      where: { id: topicId },
    });

    if (!topic) {
      throw new NotFoundException(`Topic avec l'ID ${topicId} non trouvé`);
    }

    if (!topic.isActive) {
      throw new BadRequestException('Impossible de s\'abonner à un topic inactif');
    }

    try {
      return await this.prisma.userTopicSubscription.create({
        data: {
          userId,
          topicId,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          topic: {
            select: {
              id: true,
              name: true,
              description: true,
              isActive: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Cet utilisateur est déjà abonné à ce topic');
        }
      }
      throw error;
    }
  }
 
  // Récupère toutes les subscriptions avec pagination et filtrage.
  
  async findAll(query: UserTopicSubscriptionQueryDto): Promise<PaginatedUserTopicSubscriptionsDto> {
    const { page, limit, userId, topicId, sortBy, sortOrder } = query;

    const currentPage = Number(page) || 1;
    const currentLimit = Number(limit) || 10;
    const skip = (currentPage - 1) * currentLimit;

    // Préparation du filtre
    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (topicId) {
      where.topicId = topicId;
    }

    // Préparation du tri
    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder || 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    // Exécution parallèle des requêtes
    const [subscriptions, total] = await Promise.all([
      this.prisma.userTopicSubscription.findMany({
        where,
        skip,
        take: currentLimit,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          topic: {
            select: {
              id: true,
              name: true,
              description: true,
              isActive: true,
            },
          },
        },
      }),
      this.prisma.userTopicSubscription.count({ where }),
    ]);

    const totalPages = Math.ceil(total / currentLimit);

    return {
      data: subscriptions,
      total,
      totalPages,
      page: currentPage,
      limit: currentLimit,
      hasNext: currentPage < totalPages,
      hasPrevious: currentPage > 1,
    };
  }

  async findOne(id: string) {
    const subscription = await this.prisma.userTopicSubscription.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        topic: {
          select: {
            id: true,
            name: true,
            description: true,
            isActive: true,
          },
        },
      },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription avec l'ID ${id} non trouvée`);
    }

    return subscription;
  }

  async findByUserAndTopic(userId: string, topicId: string) {
    return await this.prisma.userTopicSubscription.findUnique({
      where: {
        userId_topicId: {
          userId,
          topicId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        topic: {
          select: {
            id: true,
            name: true,
            description: true,
            isActive: true,
          },
        },
      },
    });
  }

  async getUserSubscriptions(userId: string) {
    return await this.prisma.userTopicSubscription.findMany({
      where: { userId },
      include: {
        user: {
           select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        topic: {
          select: {
            id: true,
            name: true,
            description: true,
            isActive: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getTopicSubscriptions(topicId: string) {
    return await this.prisma.userTopicSubscription.findMany({
      where: { topicId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async remove(id: string) {
    try {
      return await this.prisma.userTopicSubscription.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Subscription avec l'ID ${id} non trouvée`);
        }
      }
      throw error;
    }
  }

  async removeByUserAndTopic(userId: string, topicId: string) {
    try {
      return await this.prisma.userTopicSubscription.delete({
        where: {
          userId_topicId: {
            userId,
            topicId,
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Subscription non trouvée pour l'utilisateur ${userId} et le topic ${topicId}`);
        }
      }
      throw error;
    }
  }

  async getSubscriptionStats() {
    const [totalSubscriptions, activeTopicSubscriptions, uniqueUsers] = await Promise.all([
      this.prisma.userTopicSubscription.count(),
      this.prisma.userTopicSubscription.count({
        where: {
          topic: {
            isActive: true,
          },
        },
      }),
      this.prisma.userTopicSubscription.groupBy({
        by: ['userId'],
        _count: {
          userId: true,
        },
      }),
    ]);

    return {
      totalSubscriptions,
      activeTopicSubscriptions,
      uniqueUsers: uniqueUsers.length,
    };
  }
}
