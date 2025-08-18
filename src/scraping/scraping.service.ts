import { Injectable, Logger } from '@nestjs/common';
import {HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class ScrapingService {
  [x: string]: any;
  findAll(query: string, maxResults: number) {
  }
  private readonly logger = new Logger(ScrapingService.name);
  private readonly apiKey = process.env.YOUTUBE_API_KEY;
  private readonly baseUrl = 'https://www.googleapis.com/youtube/v3/search';
  private readonly devtoApi = process.env.DEVTO_API_KEY;
  private readonly devtoBaseUrl = 'https://dev.to/api/articles?username=/search';
  // private readonly mediumApi = process.env.MEDIUM_API_KEY;
  // private readonly mediumBaseUrl = 'https://api.medium.com/v1/users';
  constructor(private readonly http: HttpService ,
    private readonly prisma: PrismaService
   ) {}

  async scrapePopularVideosByTopic(query?: string, maxResults = 5, topicId?: string) {
  // Si pas de query ou query vide, mais topicId fourni
  if ((!query || query.trim() === '') && topicId) {
    const topic = await this.prisma.topic.findUnique({
      where: { id: topicId },
      select: { name: true },
    });

    if (!topic) {
      throw new Error(`Topic avec ID ${topicId} introuvable`);
    }

    query = topic.name;  
  }

  // Si après ça, query est toujours vide ou non défini
  if (!query || query.trim() === '') {
    throw new Error("Vous devez fournir au moins un 'query' ou un 'topicId' valide");
  }

  query = query.trim();

  const params = {
    key: this.apiKey,
    q: query,
    part: 'snippet',
    type: 'video',
    maxResults,
  };

  try {
     this.logger.log(`Recherche YouTube avec query = "${query}"`);

    const response = await firstValueFrom(
      this.http.get(this.baseUrl, { params }),
    );

    this.logger.log(`Réponse API YouTube reçue, nombre d'items: ${response.data.items?.length || 0}`);

    if (!response.data.items || response.data.items.length === 0) {
      this.logger.warn('Aucune vidéo trouvée pour la requête.');
      return [];
    }

    // Extraire les IDs des vidéos pour récupérer les stats
    const videoIds = response.data.items
      .map((item) => item.id.videoId)
      .filter((id) => !!id)
      .join(',');

    if (!videoIds) {
      this.logger.warn('Aucun videoId valide trouvé dans la réponse.');
      return [];
    }

    // Récupérer les statistiques des vidéos
    const statsParams = {
      key: this.apiKey,
      id: videoIds,
      part: 'snippet,statistics',
    };

    const statsResponse = await firstValueFrom(
      this.http.get('https://www.googleapis.com/youtube/v3/videos', { params: statsParams }),
    );

    const videos = statsResponse.data.items
      .map((item) => ({
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        videoId: item.id,
        videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
        thumbnail: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt,
        // description: item.snippet.description,
        views: parseInt(item.statistics.viewCount || '0', 10),
        likes: parseInt(item.statistics.likeCount || '0', 10),
        comments: parseInt(item.statistics.commentCount || '0', 10),
      }))
      // Trier par popularité : vues, puis likes, puis commentaires
      .sort((a, b) => b.views - a.views || b.likes - a.likes || b.comments - a.comments);

    this.logger.log(`${videos.length} vidéos récupérées pour "${query}"`);

    return videos;
  } catch (error) {
    this.logger.error(`Erreur scraping YouTube : ${error.message}`);
    throw error;
  }
}


  async scrapeDevtoListings(query?: string, maxResults = 5, topicId?: string) {
  // Si pas de query mais topicId fourni, récupérer le nom du topic
  if ((!query || query.trim() === '') && topicId) {
    const topic = await this.prisma.topic.findUnique({
      where: { id: topicId },
      select: { name: true },
    });

    if (!topic) {
      throw new Error(`Topic avec ID ${topicId} introuvable`);
    }

    query = topic.name;
  }

  if (!query || query.trim() === '') {
    throw new Error("Le paramètre 'query' est obligatoire");
  }

  try {
    this.logger.log(`Recherche Dev.to avec query = "${query}"`);

    // Premier et unique appel à l’API Dev.to
    const response = await firstValueFrom(
      this.http.get('https://dev.to/api/articles', {
        params: {
          tag: query,         
          per_page: maxResults 
        },
        // Si tu as une clé API Dev.to :
        // headers: { 'api-key': this.devtoApi }
      })
    );

    const articles = response.data;

    if (!Array.isArray(articles) || articles.length === 0) {
      this.logger.warn('Aucune information trouvée pour la requête.');
      return [];
    }

    // Mapper les articles avec les bonnes propriétés
    const devtoArticlesList = articles
      .map((item) => ({
        title: item.title,
        url: `https://dev.to/${item.user.username}/${item.slug}`,
        publishedAt: item.published_at,
        author: item.user?.name || item.user?.username,
        description: item.description,
        thumbnail: item.social_image,
        // views: item.page_views_count || 0,
        reactions: item.public_reactions_count || 0,
        comments: item.comments_count || 0,
      }))
      // Tri : plus vues > plus likes > plus de commentaires
      .sort((a, b) =>  b.reactions - a.reactions || b.comments - a.comments);

    this.logger.log(`${devtoArticlesList.length} articles récupérés pour "${query}"`);
    return devtoArticlesList;

  } catch (error) {
    this.logger.error(`Erreur scraping Dev.to : ${error.message}`);
    throw error;
  }
}


// async scrapeMediumCategory(username: string) {
//   const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
//   const page = await browser.newPage();
//   const url = `https://medium.com/@${username}/latest`;

//   await page.goto(url, { waitUntil: 'domcontentloaded' });

//   const articles = await page.evaluate(() => {
//     const data: any[] = [];

//     const cards = document.querySelectorAll('article');

//     cards.forEach((card) => {
//       const title = card.querySelector('h2')?.textContent?.trim();
//       const link = card.querySelector('a')?.href;

//       if (title && link) {
//         data.push({ title, link });
//       }
//     });

//     return data;
//   });

//   await browser.close();²
//   return articles;
 

 }

  