import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateExternalContentDto, UpdateExternalContentDto, ExternalContentQueryDto, ExternalContentResponseDto, ExternalContentType } from './dto/create-external-content.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExternalContentService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateExternalContentDto): Promise<ExternalContentResponseDto> {
    try {
      // Vérifier si le topic existe
      const topic = await this.prisma.topic.findUnique({
        where: { id: createDto.topicId }
      });

      if (!topic) {
        throw new NotFoundException(`Topic avec l'ID ${createDto.topicId} non trouvé`);
      }

      // Créer le contenu externe
      const externalContent = await this.prisma.externalContent.create({
        data: {
          title: createDto.title,
          url: createDto.url,
          summary: createDto.summary,
          content: createDto.content,
          author: createDto.author,
          source: createDto.source,
          type: createDto.type,
          publishedAt: createDto.publishedAt ? new Date(createDto.publishedAt) : null,
          topicId: createDto.topicId,
          isActive: createDto.isActive ?? true,
        },
        include: {
          topic: {
            select: {
              id: true,
              name: true,
            }
          },
          views: {
            select: {
              id: true,
              viewedAt: true,
              userId: true,
            }
          }
        }
      });

      return {
        ...externalContent,
        viewsCount: externalContent.views.length,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('URL déjà existante');
        }
      }
      throw error;
    }
  }

  async findAll(query: ExternalContentQueryDto): Promise<{
    data: ExternalContentResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, search, type, topicId, source, isActive, sortBy = 'scrapedAt', sortOrder = 'desc' } = query;
    
    const skip = (page - 1) * limit;
    
    const where: any = {
      ...(isActive !== undefined && { isActive }),
      ...(type && { type }),
      ...(topicId && { topicId }),
      ...(source && { source: { contains: source, mode: 'insensitive' } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { author: { contains: search, mode: 'insensitive' } },
          { summary: { contains: search, mode: 'insensitive' } },
        ]
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.externalContent.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder
        },
        include: {
          topic: {
            select: {
              id: true,
              name: true,
            }
          },
          views: {
            select: {
              id: true,
              viewedAt: true,
              userId: true,
            }
          }
        }
      }),
      this.prisma.externalContent.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: data.map(item => ({
        ...item,
        viewsCount: item.views.length,
      })),
      total,
      page,
      limit,
      totalPages
    };
  }

  async findOne(id: string): Promise<ExternalContentResponseDto> {
    const externalContent = await this.prisma.externalContent.findUnique({
      where: { id },
      include: {
        topic: {
          select: {
            id: true,
            name: true,
          }
        },
        views: {
          select: {
            id: true,
            viewedAt: true,
            userId: true,
          }
        }
      }
    });

    if (!externalContent) {
      throw new NotFoundException(`Contenu externe avec l'ID ${id} non trouvé`);
    }

    return {
      ...externalContent,
      viewsCount: externalContent.views.length,
    };
  }

  async update(id: string, updateDto: UpdateExternalContentDto): Promise<ExternalContentResponseDto> {
    try {
      // Vérifier si le contenu existe
      const existingContent = await this.prisma.externalContent.findUnique({
        where: { id }
      });

      if (!existingContent) {
        throw new NotFoundException(`Contenu externe avec l'ID ${id} non trouvé`);
      }

      // Vérifier si le topic existe (si fourni)
      if (updateDto.topicId) {
        const topic = await this.prisma.topic.findUnique({
          where: { id: updateDto.topicId }
        });

        if (!topic) {
          throw new NotFoundException(`Topic avec l'ID ${updateDto.topicId} non trouvé`);
        }
      }

      const updatedContent = await this.prisma.externalContent.update({
        where: { id },
        data: {
          ...(updateDto.title && { title: updateDto.title }),
          ...(updateDto.url && { url: updateDto.url }),
          ...(updateDto.summary !== undefined && { summary: updateDto.summary }),
          ...(updateDto.content !== undefined && { content: updateDto.content }),
          ...(updateDto.author !== undefined && { author: updateDto.author }),
          ...(updateDto.source && { source: updateDto.source }),
          ...(updateDto.type && { type: updateDto.type }),
          ...(updateDto.publishedAt !== undefined && { 
            publishedAt: updateDto.publishedAt ? new Date(updateDto.publishedAt) : null 
          }),
          ...(updateDto.topicId && { topicId: updateDto.topicId }),
          ...(updateDto.isActive !== undefined && { isActive: updateDto.isActive }),
        },
        include: {
          topic: {
            select: {
              id: true,
              name: true,
            }
          },
          views: {
            select: {
              id: true,
              viewedAt: true,
              userId: true,
            }
          }
        }
      });

      return {
        ...updatedContent,
        viewsCount: updatedContent.views.length,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('URL déjà existante');
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const existingContent = await this.prisma.externalContent.findUnique({
      where: { id }
    });

    if (!existingContent) {
      throw new NotFoundException(`Contenu externe avec l'ID ${id} non trouvé`);
    }

    await this.prisma.externalContent.delete({
      where: { id }
    });

    return { message: 'Contenu externe supprimé avec succès' };
  }

  async findByTopic(topicId: string, query?: Partial<ExternalContentQueryDto>): Promise<ExternalContentResponseDto[]> {
    const { type, isActive = true, sortBy = 'scrapedAt', sortOrder = 'desc' } = query || {};

    const where: any = {
      topicId,
      isActive,
      ...(type && { type }),
    };

    const contents = await this.prisma.externalContent.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: {
        topic: {
          select: {
            id: true,
            name: true,
          }
        },
        views: {
          select: {
            id: true,
            viewedAt: true,
            userId: true,
          }
        }
      }
    });

    return contents.map(content => ({
      ...content,
      viewsCount: content.views.length,
    }));
  }

  async findBySource(source: string): Promise<ExternalContentResponseDto[]> {
    const contents = await this.prisma.externalContent.findMany({
      where: {
        source: { contains: source, mode: 'insensitive' },
        isActive: true
      },
      include: {
        topic: {
          select: {
            id: true,
            name: true,
          }
        },
        views: {
          select: {
            id: true,
            viewedAt: true,
            userId: true,
          }
        }
      }
    });

    return contents.map(content => ({
      ...content,
      viewsCount: content.views.length,
    }));
  }

  async findByType(type: ExternalContentType): Promise<ExternalContentResponseDto[]> {
    const contents = await this.prisma.externalContent.findMany({
      where: {
        type,
        isActive: true
      },
      include: {
        topic: {
          select: {
            id: true,
            name: true,
          }
        },
        views: {
          select: {
            id: true,
            viewedAt: true,
            userId: true,
          }
        }
      }
    });

    return contents.map(content => ({
      ...content,
      viewsCount: content.views.length,
    }));
  }

  async toggleActive(id: string): Promise<ExternalContentResponseDto> {
    const existingContent = await this.prisma.externalContent.findUnique({
      where: { id }
    });

    if (!existingContent) {
      throw new NotFoundException(`Contenu externe avec l'ID ${id} non trouvé`);
    }

    const updatedContent = await this.prisma.externalContent.update({
      where: { id },
      data: {
        isActive: !existingContent.isActive
      },
      include: {
        topic: {
          select: {
            id: true,
            name: true,
          }
        },
        views: {
          select: {
            id: true,
            viewedAt: true,
            userId: true,
          }
        }
      }
    });

    return {
      ...updatedContent,
      viewsCount: updatedContent.views.length,
    };
  }

  async getStats(): Promise<{
    total: number;
    byType: Record<ExternalContentType, number>;
    bySource: Record<string, number>;
    active: number;
    inactive: number;
  }> {
    const [total, byType, bySource, active, inactive] = await Promise.all([
      this.prisma.externalContent.count(),
      this.prisma.externalContent.groupBy({
        by: ['type'],
        _count: true
      }),
      this.prisma.externalContent.groupBy({
        by: ['source'],
        _count: true
      }),
      this.prisma.externalContent.count({ where: { isActive: true } }),
      this.prisma.externalContent.count({ where: { isActive: false } })
    ]);

    return {
      total,
      byType: byType.reduce((acc, item) => {
        acc[item.type] = item._count;
        return acc;
      }, {} as Record<ExternalContentType, number>),
      bySource: bySource.reduce((acc, item) => {
        acc[item.source] = item._count;
        return acc;
      }, {} as Record<string, number>),
      active,
      inactive
    };
  }
}