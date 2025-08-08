import { Injectable, NotFoundException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateUserTopicSubscriptionDto, PaginatedUserTopicSubscriptionsDto, UserTopicSubscriptionQueryDto } from './dto/create-user-topic-subscription.dto';
import { Prisma } from '@prisma/client';
import { TopicSelectionDto } from './dto/topic-selection.dto';
import { TopicSelectionResponseDto } from './dto/topic-selection-response.dto';

@Injectable()
export class UserTopicSubscriptionsService {
  removeSubscriptions(topicIds: string[], id: any) {
    throw new Error('Method not implemented.');
  }
  constructor(private prisma: PrismaService,
      // private readonly userTopicSubscriptionsService: UserTopicSubscriptionsService

  ) {}

// Méthode pour afficher tous les topics avec leur statut d'abonnement pour l'utilisateur
   // Méthode pour créer quelques topics de test (à supprimer en production)
  // async createTestTopics() {
  //   const testTopics = [
  //     { name: 'Technologie', description: 'Topics sur la technologie et l\'innovation' },
  //     { name: 'Sport', description: 'Topics sur le sport et la santé' },
  //     { name: 'Culture', description: 'Topics sur la culture et les arts' },
  //     { name: 'Science', description: 'Topics sur les sciences et la recherche' },
  //     { name: 'Économie', description: 'Topics sur l\'économie et la finance' }
  //   ];

  //   for (const topic of testTopics) {
  //     await this.prisma.topic.upsert({
  //       where: { name: topic.name },
  //       update: {},
  //       create: {
  //         name: topic.name,
  //         description: topic.description,
  //         isActive: true
  //       }
  //     });
  //   }

  //   return { message: 'Topics de test créés' };
  // }

  async getTopicsWithSubscriptionStatus(userId: string): Promise<TopicSelectionResponseDto> {
    // Vérifier que l'utilisateur existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    // Récupérer tous les topics actifs
    const topics = await this.prisma.topic.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    // Si aucun topic n'existe, en créer quelques-uns pour les tests
    if (topics.length === 0) {
      console.log('Aucun topic trouvé, création de topics de test...');
      // await this.createTestTopics();
      // Récupérer les topics créés
      const newTopics = await this.prisma.topic.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      });
      console.log(`${newTopics.length} topics de test créés`);
    }

    // Récupérer les topics (avec ceux potentiellement créés)
    const allTopics = await this.prisma.topic.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    // Récupérer les abonnements de l'utilisateur
    const userSubscriptions = await this.prisma.userTopicSubscription.findMany({
      where: { userId },
      select: { topicId: true },
    });

    // Créer un Set pour une recherche rapide
    const subscribedTopicIds = new Set(userSubscriptions.map(sub => sub.topicId));

    // Mapper les topics avec leur statut d'abonnement
    const topicsWithStatus: TopicSelectionDto[] = allTopics.map(topic => ({
      id: topic.id,
      name: topic.name,
      description: topic.description,
      isActive: topic.isActive,
      isSubscribed: subscribedTopicIds.has(topic.id),
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt,
    }));

    return {
      topics: topicsWithStatus,
      userSubscriptionsCount: userSubscriptions.length,
    };
  }

  async createAddTopicsToUser(
    subscriptions: CreateUserTopicSubscriptionDto[],
    userId: string,
  ) {
    if (!subscriptions || subscriptions.length === 0) {
      throw new BadRequestException('Aucun topic sélectionné');
    }

    // Extraire les topicIds depuis le tableau DTO
    const topicIds: any[] = subscriptions.map(s => s.topicId);

    console.log('TopicIds reçus:', topicIds);
    console.log('UserId:', userId);

    // Vérifier que l'utilisateur existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    // Récupérer les topics en base
    const topics = await this.prisma.topic.findMany({
      where: { id: { in: topicIds } },
    });

    console.log('Topics trouvés:', topics.map(t => ({ id: t.id, name: t.name })));

    // Vérifier que tous les topics existent
    if (topics.length !== topicIds.length) {
      const existingTopicIds = topics.map(t => t.id);
      const missingTopicIds = topicIds.filter(id => !existingTopicIds.includes(id));
      throw new NotFoundException(
        `Topics non trouvés: ${missingTopicIds.join(', ')}`
      );
    }

    // Vérifier qu'ils sont actifs
    const inactiveTopics = topics.filter(t => !t.isActive);
    if (inactiveTopics.length > 0) {
      throw new BadRequestException(
        `Impossible de s'abonner aux topics inactifs: ${inactiveTopics.map(t => t.name).join(', ')}`
      );
    }

    try {
      // Créer les abonnements en bulk avec skipDuplicates
      const result = await this.prisma.userTopicSubscription.createMany({
        data: topicIds.map(topicId => ({
          userId,
          topicId,
        })),
        skipDuplicates: true,
      });

      console.log('Résultat createMany:', result);

      // Récupérer les abonnements créés/existants avec les détails des topics
      const subscriptionsCreated = await this.prisma.userTopicSubscription.findMany({
        where: {
          userId,
          topicId: { in: topicIds },
        },
        include: {
          topic: true,
        },
      });

      return {
        message: `${result.count} nouveaux abonnements créés`,
        totalSubscriptions: subscriptionsCreated.length,
        subscriptions: subscriptionsCreated,
      };
    } catch (error) {
      console.error('Erreur lors de la création des abonnements:', error);
      throw new InternalServerErrorException(
        'Erreur lors de la création des abonnements: ' + error.message
      );
    }
  }

  // Autres méthodes du service...
  async updateUserSubscriptions(newTopicIds: string[], userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    if (newTopicIds.length > 0) {
      const topics = await this.prisma.topic.findMany({
        where: { 
          id: { in: newTopicIds },
          isActive: true 
        },
      });

      if (topics.length !== newTopicIds.length) {
        throw new BadRequestException('Certains topics sont invalides ou inactifs');
      }
    }

    return await this.prisma.$transaction(async (prisma) => {
      await prisma.userTopicSubscription.deleteMany({
        where: { userId },
      });

      if (newTopicIds.length > 0) {
        await prisma.userTopicSubscription.createMany({
          data: newTopicIds.map(topicId => ({
            userId,
            topicId,
          })),
        });
      }

      return await prisma.userTopicSubscription.findMany({
        where: { userId },
        include: { topic: true },
      });
    });
  }

  async getUserSubscriptions(userId: string) {
    const subscriptions = await this.prisma.userTopicSubscription.findMany({
      where: { userId },
      include: {
        topic: true,
      },
      orderBy: {
        topic: { name: 'asc' },
      },
    });

    return {
      subscriptions,
      count: subscriptions.length,
    };
  }
}