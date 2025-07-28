// import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// import { PrismaService } from '../prisma.service';
// import { CreateScrapingLogDto } from './dto/create-scraping-log.dto';
// import { UpdateScrapingLogDto } from './dto/update-scraping-log.dto';
// import { ScrapingLogQueryDto } from './dto/create-scraping-log.dto';
// import { ScrapingLog } from './entities/scraping-log.entity';

// @Injectable()
// export class ScrapingLogService {
//   constructor(private prisma: PrismaService) {}

//   async create(createScrapingLogDto: CreateScrapingLogDto): Promise<ScrapingLog> {
//     try {
//       return await this.prisma.scrapingLog.create({
//         data: {
//           sourceUrl: createScrapingLogDto.sourceUrl,
//           status: createScrapingLogDto.status,
//           message: createScrapingLogDto.message,
//           itemsScraped: createScrapingLogDto.itemsScraped || 0,
//           executionTime: createScrapingLogDto.executionTime,
//         },
//       });
//     } catch (error) {
//       throw new BadRequestException('Erreur lors de la création du log de scraping');
//     }
//   }

//    async findAll(query: ScrapingLogQueryDto) {
//     const { status, sourceUrl, dateFrom, dateTo, page = 1, limit = 10 } = query;
    
//     // S'assurer que page et limit sont des nombres
//     const numericPage = typeof page === 'string' ? parseInt(page, 10) : page;
//     const numericLimit = typeof limit === 'string' ? parseInt(limit, 10) : limit;
    
//     // Validation et valeurs par défaut
//     const validPage = isNaN(numericPage) || numericPage < 1 ? 1 : numericPage;
//     const validLimit = isNaN(numericLimit) || numericLimit < 1 ? 10 : Math.min(numericLimit, 100);
    
//     const where: any = {};
    
//     if (status) {
//       where.status = status;
//     }
    
//     if (sourceUrl) {
//       where.sourceUrl = {
//         contains: sourceUrl,
//         mode: 'insensitive',
//       };
//     }
    
//     if (dateFrom || dateTo) {
//       where.createdAt = {};
//       if (dateFrom) {
//         where.createdAt.gte = new Date(dateFrom);
//       }
//       if (dateTo) {
//         where.createdAt.lte = new Date(dateTo);
//       }
//     }

//     const skip = (validPage - 1) * validLimit;

//     const [logs, total] = await Promise.all([
//       this.prisma.scrapingLog.findMany({
//         where,
//         skip,
//         take: validLimit,
//         orderBy: {
//           createdAt: 'desc',
//         },
//       }),
//       this.prisma.scrapingLog.count({ where }),
//     ]);

//     return {
//       data: logs,
//       pagination: {
//         page: validPage,
//         limit: validLimit,
//         total,
//         totalPages: Math.ceil(total / validLimit),
//       },
//     };
//   }

//   async findOne(id: string): Promise<ScrapingLog> {
//     const scrapingLog = await this.prisma.scrapingLog.findUnique({
//       where: { id },
//     });

//     if (!scrapingLog) {
//       throw new NotFoundException(`Log de scraping avec l'ID ${id} non trouvé`);
//     }

//     return scrapingLog;
//   }

//   async update(id: string, updateScrapingLogDto: UpdateScrapingLogDto): Promise<ScrapingLog> {
//     await this.findOne(id); // Vérifie que le log existe

//     try {
//       return await this.prisma.scrapingLog.update({
//         where: { id },
//         data: updateScrapingLogDto,
//       });
//     } catch (error) {
//       throw new BadRequestException('Erreur lors de la mise à jour du log de scraping');
//     }
//   }

//   async remove(id: string): Promise<void> {
//     await this.findOne(id); // Vérifie que le log existe

//     try {
//       await this.prisma.scrapingLog.delete({
//         where: { id },
//       });
//     } catch (error) {
//       throw new BadRequestException('Erreur lors de la suppression du log de scraping');
//     }
//   }

//   // Méthodes utilitaires spécifiques au scraping
//   async getStatistics() {
//     const [totalLogs, successCount, errorCount, warningCount, avgExecutionTime] = await Promise.all([
//       this.prisma.scrapingLog.count(),
//       this.prisma.scrapingLog.count({ where: { status: 'SUCCESS' } }),
//       this.prisma.scrapingLog.count({ where: { status: 'ERROR' } }),
//       this.prisma.scrapingLog.count({ where: { status: 'WARNING' } }),
//       this.prisma.scrapingLog.aggregate({
//         _avg: {
//           executionTime: true,
//         },
//         where: {
//           executionTime: {
//             not: null,
//           },
//         },
//       }),
//     ]);

//     return {
//       totalLogs,
//       successCount,
//       errorCount,
//       warningCount,
//       successRate: totalLogs > 0 ? (successCount / totalLogs) * 100 : 0,
//       avgExecutionTime: avgExecutionTime._avg.executionTime || 0,
//     };
//   }

//   async getLogsByDateRange(dateFrom: Date, dateTo: Date) {
//     return await this.prisma.scrapingLog.findMany({
//       where: {
//         createdAt: {
//           gte: dateFrom,
//           lte: dateTo,
//         },
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });
//   }

//   async getRecentErrors(limit: number = 10) {
//     // S'assurer que limit est un nombre
//     const numericLimit = typeof limit === 'string' ? parseInt(limit, 10) : limit;
//     const validLimit = isNaN(numericLimit) ? 10 : Math.max(1, numericLimit);
    
//     return await this.prisma.scrapingLog.findMany({
//       where: {
//         status: 'ERROR',
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//       take: validLimit,
//     });
//   }
// }
