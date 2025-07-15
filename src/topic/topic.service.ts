import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTopicDto, PaginatedTopicsDto, TopicQueryDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Prisma } from '@prisma/client';
import { promises } from 'dns';
import { take } from 'rxjs';

@Injectable()
export class TopicsService {
  constructor(private prisma: PrismaService) {}

  async create(createTopicDto: CreateTopicDto) {
    try {
      return await this.prisma.topic.create({
        data: {
          name: createTopicDto.name,
          description: createTopicDto.description,
          isActive: createTopicDto.isActive ?? true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Un topic avec ce nom existe déjà');
        }
      }
      throw error;
    }
  }

   // Obtenir tous les topics avec pagination et filtres
  async findAll(query: TopicQueryDto): Promise<PaginatedTopicsDto> {
    let { page, limit, isActive, search, sortBy, sortOrder } = query;

    // ✅ Conversion en nombre pour éviter les erreurs Prisma (type string → number)
    const currentPage = Number(page) || 1;
    const currentLimit = Number(limit) || 10;
    const skip = (currentPage - 1) * currentLimit;

    // Préparation du filtre
    const where: any = {};

    if (isActive !== undefined) {
      // convertir 'true' (string) ou true (boolean) en boolean
      where.isActive = Boolean(isActive);
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Préparation du tri
    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder || 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    // Exécution parallèle des requêtes
    const [topics, total] = await Promise.all([
      this.prisma.topic.findMany({
        where,
        skip,
        take: currentLimit,
        orderBy,
        select: {
          id: true,
          name: true,
          description: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.topic.count({ where }),
    ]);

    const totalPages = Math.ceil(total / currentLimit);

    return {
      data: topics,
      total,
      totalPages,
      page: currentPage,
      limit: currentLimit,
      hasNext: currentPage < totalPages,
      hasPrevious: currentPage > 1,
    };
  }

  // obténir tout les sujets actives

  async findActive() {
    return await this.prisma.topic.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const topic = await this.prisma.topic.findUnique({
      where: { id },
    });

    if (!topic) {
      throw new NotFoundException(`Topic avec l'ID ${id} non trouvé`);
    }

    return topic;
  }

  async findByName(name: string) {
    return await this.prisma.topic.findUnique({
      where: { name },
    });
  }

  async update(id: string, updateTopicDto: UpdateTopicDto) {
    try {
      return await this.prisma.topic.update({
        where: { id },
        data: updateTopicDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Topic avec l'ID ${id} non trouvé`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Un topic avec ce nom existe déjà');
        }
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.topic.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Topic avec l'ID ${id} non trouvé`);
        }
      }
      throw error;
    }
  }

  async toggleActive(id: string) {
    const topic = await this.findOne(id);
    return await this.update(id, { isActive: !topic.isActive });
  }

  async getTopicStats(id: string) {
    const topic = await this.findOne(id);
    
    // Les statistiques seront disponibles quand les relations seront activées
    // const [subscriptionsCount,  scrapingSourcesCount] = await Promise.all([
    //   this.prisma.userTopicSubscription.count({
    //     where: { topicId: id },
    //   }),
    //   this.prisma.scrapingSource.count({
    //     where: { topicId: id },
    //   }),
    // ]);

    return {
      ...topic,
      stats: {
        subscriptionsCount: 0,
        scrapingSourcesCount: 0,
      },
    };
  }
}
