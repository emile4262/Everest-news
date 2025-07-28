// import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// import { PrismaService } from '../prisma.service';
// import { 
//   CreateScrapingSourceDto, 
//   UpdateScrapingSourceDto, 
//   ScrapingSourceQueryDto,
//   UpdateLastScrapedDto 
// } from './dto/create-scraping-source.dto';
// import { ScrapingSource } from './entities/scraping-source.entity';

// @Injectable()
// export class ScrapingSourceService {
//   constructor(private prisma: PrismaService) {}

//   async create(createDto: CreateScrapingSourceDto): Promise<ScrapingSource> {
//     try {
//       // Vérifier si le topic existe
//       const topic = await this.prisma.topic.findUnique({
//         where: { id: createDto.topicId }
//       });

//       if (!topic) {
//         throw new NotFoundException(`Topic avec l'ID ${createDto.topicId} non trouvé`);
//       }

//       // Vérifier si l'URL n'existe pas déjà pour ce topic
//       const existingSource = await this.prisma.scrapingSource.findFirst({
//         where: {
//           url: createDto.url,
//           topicId: createDto.topicId
//         }
//       });

//       if (existingSource) {
//         throw new BadRequestException('Une source avec cette URL existe déjà pour ce topic');
//       }

//       return await this.prisma.scrapingSource.create({
//         data: createDto,
//         include: {
//           topic: true
//         }
//       });
//     } catch (error) {
//       if (error instanceof NotFoundException || error instanceof BadRequestException) {
//         throw error;
//       }
//       throw new BadRequestException('Erreur lors de la création de la source de scraping');
//     }
//   }

//   async findAll(query: ScrapingSourceQueryDto): Promise<{
//     data: ScrapingSource[];
//     total: number;
//     page: number;
//     limit: number;
//   }> {
//     const { topicId, isActive, search, page = 1, limit = 10 } = query;
    
//     const where: any = {};
    
//     if (topicId) {
//       where.topicId = topicId;
//     }
    
//     if (isActive !== undefined) {
//       where.isActive = isActive;
//     }
    
//     if (search) {
//       where.OR = [
//         { name: { contains: search, mode: 'insensitive' } },
//         { url: { contains: search, mode: 'insensitive' } }
//       ];
//     }

//     const [data, total] = await Promise.all([
//       this.prisma.scrapingSource.findMany({
//         where,
//         include: {
//           topic: true
//         },
//         orderBy: {
//           createdAt: 'desc'
//         },
//         skip: (page - 1) * limit,
//         take: limit
//       }),
//       this.prisma.scrapingSource.count({ where })
//     ]);

//     return {
//       data,
//       total,
//       page,
//       limit
//     };
//   }

//   async findOne(id: string): Promise<ScrapingSource> {
//     const source = await this.prisma.scrapingSource.findUnique({
//       where: { id },
//       include: {
//         topic: true
//       }
//     });

//     if (!source) {
//       throw new NotFoundException(`Source de scraping avec l'ID ${id} non trouvée`);
//     }

//     return source;
//   }

//   async findByTopic(topicId: string): Promise<ScrapingSource[]> {
//     return await this.prisma.scrapingSource.findMany({
//       where: { topicId },
//       include: {
//         topic: true
//       },
//       orderBy: {
//         createdAt: 'desc'
//       }
//     });
//   }

//   async findActiveSources(): Promise<ScrapingSource[]> {
//     return await this.prisma.scrapingSource.findMany({
//       where: { isActive: true },
//       include: {
//         topic: true
//       },
//       orderBy: {
//         lastScrapedAt: 'asc' 
//       }
//     });
//   }

//   async update(id: string, updateDto: UpdateScrapingSourceDto): Promise<ScrapingSource> {
//     const existingSource = await this.findOne(id);

//     try {
//       // Si on change le topicId, vérifier que le nouveau topic existe
//       if (updateDto.topicId && updateDto.topicId !== existingSource.topicId) {
//         const topic = await this.prisma.topic.findUnique({
//           where: { id: updateDto.topicId }
//         });

//         if (!topic) {
//           throw new NotFoundException(`Topic avec l'ID ${updateDto.topicId} non trouvé`);
//         }
//       }

//       // Si on change l'URL, vérifier qu'elle n'existe pas déjà
//       if (updateDto.url && updateDto.url !== existingSource.url) {
//         const duplicateSource = await this.prisma.scrapingSource.findFirst({
//           where: {
//             url: updateDto.url,
//             topicId: updateDto.topicId || existingSource.topicId,
//             NOT: { id }
//           }
//         });

//         if (duplicateSource) {
//           throw new BadRequestException('Une source avec cette URL existe déjà pour ce topic');
//         }
//       }

//       return await this.prisma.scrapingSource.update({
//         where: { id },
//         data: updateDto,
//         include: {
//           topic: true
//         }
//       });
//     } catch (error) {
//       if (error instanceof NotFoundException || error instanceof BadRequestException) {
//         throw error;
//       }
//       throw new BadRequestException('Erreur lors de la mise à jour de la source de scraping');
//     }
//   }

//   async updateLastScraped(id: string, updateDto: UpdateLastScrapedDto): Promise<ScrapingSource> {
//     await this.findOne(id); // Vérifier que la source existe

//     return await this.prisma.scrapingSource.update({
//       where: { id },
//       data: {
//         lastScrapedAt: new Date(updateDto.lastScrapedAt)
//       },
//       include: {
//         topic: true
//       }
//     });
//   }

//   async toggleActive(id: string): Promise<ScrapingSource> {
//     const source = await this.findOne(id);

//     return await this.prisma.scrapingSource.update({
//       where: { id },
//       data: {
//         isActive: !source.isActive
//       },
//       include: {
//         topic: true
//       }
//     });
//   }

//   async remove(id: string): Promise<void> {
//     await this.findOne(id); 

//     try {
//       await this.prisma.scrapingSource.delete({
//         where: { id }
//       });
//     } catch (error) {
//       throw new BadRequestException('Erreur lors de la suppression de la source de scraping');
//     }
//   }

//   async getStatistics(): Promise<{
//     total: number;
//     active: number;
//     inactive: number;
//     recentlyScraped: number;
//   }> {
//     const oneDayAgo = new Date();
//     oneDayAgo.setDate(oneDayAgo.getDate() - 1);

//     const [total, active, inactive, recentlyScraped] = await Promise.all([
//       this.prisma.scrapingSource.count(),
//       this.prisma.scrapingSource.count({ where: { isActive: true } }),
//       this.prisma.scrapingSource.count({ where: { isActive: false } }),
//       this.prisma.scrapingSource.count({
//         where: {
//           lastScrapedAt: {
//             gte: oneDayAgo
//           }
//         }
//       })
//     ]);

//     return {
//       total,
//       active,
//       inactive,
//       recentlyScraped
//     };
//   }

//   async bulkToggleActive(ids: string[], isActive: boolean): Promise<{ updated: number }> {
//     const result = await this.prisma.scrapingSource.updateMany({
//       where: {
//         id: {
//           in: ids
//         }
//       },
//       data: {
//         isActive
//       }
//     });

//     return { updated: result.count };
//   }
// }