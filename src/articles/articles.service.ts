// src/articles/article.service.ts
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Article, ArticleStatus, UserRole } from '@prisma/client'; // Importez les modèles et enums de Prisma Client
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateArticleDto,  UpdateArticleDto } from './dto/create-article.dto';
import { FilterArticleDto } from './dto/filter-article.dto';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  
    // Crée un nouvel article.
  
  async create(createArticleDto: CreateArticleDto, authorId: string): Promise<Article> {
    // Vérifier si l'auteur existe
    const author = await this.prisma.user.findUnique({ where: { id: authorId } });
    if (!author) {
      throw new NotFoundException(`Auteur avec l'ID ${authorId} non trouvé.`);
    }

    // Si le statut n'est pas fourni, Prisma utilisera la valeur par défaut 'DRAFT'
    return this.prisma.article.create({
      data: {
        ...createArticleDto,
        author: {
          connect: { id: authorId },
        },
      },
    });
  }

 
// Récupère tous les articles avec des options de filtrage et de pagination.
   
  async findAll(filterDto: FilterArticleDto): Promise<Article[]> {
  let { search, category, status, authorId,  page = 1, limit = 10 } = filterDto;

  // Convertir les valeurs en nombre si jamais elles sont des chaînes
  page = Number(page);
  limit = Number(limit);
  const skip = (page - 1) * limit;

  
  const where: any = {};

  // if (category){
  //   where.category
  // }

  if (search) {
    where.title = { contains: search, mode: 'insensitive' };
  }
  if (category) {
    where.category = Array.isArray(category) ? {in: category} : category ;
  }
  if (status) {
    where.status = status;
  }
  if (authorId) {
    where.authorId = authorId;
  }

  return this.prisma.article.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          jobTitle: true,
        },
      },
    },
  });
}


  // Récupère un article par son ID.
   
  async findOne(id: string): Promise<Article> {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
    if (!article) {
      throw new NotFoundException(`Article avec l'ID ${id} non trouvé.`);
    }
    return article; 
  }

  // Met à jour un article existant.
   
  async update(id: string, updateArticleDto: UpdateArticleDto, userId: string, userRole: UserRole): Promise<Article> {
    const existingArticle = await this.prisma.article.findUnique({ where: { id } });
    if (!existingArticle) {
      throw new NotFoundException(`Article avec l'ID ${id} non trouvé.`);
    }

    // Seul l'auteur, un manager ou un administrateur peut modifier l'article
    if (existingArticle.authorId !== userId && userRole !== UserRole.ADMIN && userRole !== UserRole.MANAGER) {
      throw new UnauthorizedException('Vous n\'êtes pas autorisé à modifier cet article.');
    }

    return this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    }); 
  }

   // Supprime un article.
   
  async remove(id: string, userId: string, userRole: UserRole): Promise<Article> {
    const existingArticle = await this.prisma.article.findUnique({ where: { id } });
    if (!existingArticle) {
      throw new NotFoundException(`Article avec l'ID ${id} non trouvé.`);
    }

    // Seul l'auteur, un manager ou un administrateur peut supprimer l'article
    if (existingArticle.authorId !== userId && userRole !== UserRole.ADMIN && userRole !== UserRole.MANAGER) {
      throw new UnauthorizedException('Vous n\'êtes pas autorisé à supprimer cet article.');
    }

    return this.prisma.article.delete({ where: { id } });
  }

 // Publie un article (change son statut à PUBLISHED et met à jour publishedAt).
   
  async publish(id: string, userId: string, userRole: UserRole): Promise<Article> {
    const existingArticle = await this.prisma.article.findUnique({ where: { id } });
    if (!existingArticle) {
      throw new NotFoundException(`Article avec l'ID ${id} non trouvé.`);
    }

    // Seul l'auteur, un manager ou un administrateur peut publier l'article
    if (existingArticle.authorId !== userId && userRole !== UserRole.ADMIN && userRole !== UserRole.MANAGER) {
      throw new UnauthorizedException('Vous n\'êtes pas autorisé à publier cet article.');
    }

    return this.prisma.article.update({
      where: { id },
      data: {
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });
  }

  
   // Archive un article (change son statut à ARCHIVED).
   
  async archive(id: string, userId: string, userRole: UserRole): Promise<Article> {
    const existingArticle = await this.prisma.article.findUnique({ where: { id } });
    if (!existingArticle) {
      throw new NotFoundException(`Article avec l'ID ${id} non trouvé.`);
    }

    // Seul l'auteur, un manager ou un administrateur peut archiver l'article
    if (existingArticle.authorId !== userId && userRole !== UserRole.ADMIN && userRole !== UserRole.MANAGER) {
      throw new UnauthorizedException('Vous n\'êtes pas autorisé à archiver cet article.');
    }

    return this.prisma.article.update({
      where: { id },
      data: {
        status: ArticleStatus.ARCHIVED,
      },
    });
  }

  // Mettre à jour l'image d'un image 

  async updateArticleImage(articleId: string, imageUrl: string): Promise<Article> {
  const article = await this.prisma.article.findUnique({
    where: { id: articleId },
  });

  if (!article) {
    throw new NotFoundException(`Produit avec l'ID ${articleId} non trouvé`);
  }


  return this.prisma.article.update({
    where: { id: articleId },
    data: {
      url: imageUrl
    }
  });
}


//   async markAsRead(userId: string, articleId: string): Promise<void> {
//   await this.prisma.userArticleRead.upsert({
//     where: { userId_articleId: { userId, articleId } },
//     update: { readAt: new Date() },
//     create: { userId, articleId },
//   });
// }

}
