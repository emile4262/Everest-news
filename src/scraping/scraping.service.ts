import { Injectable, Logger } from '@nestjs/common';
import {HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { writeFileSync } from 'fs';
import axios from 'axios';
import cheerio from 'cheerio';
import { Article } from 'src/articles/entities/article.entity';


interface ArticleData {
  title: string;
  url: string;
  image: string | null;
}
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


  

async  scrapeDevtoListings(
  query: string | undefined,
  maxResults: number,
  topicId: string | undefined,
  url: string,
  save: boolean
): Promise<ArticleData[]> {
  try {
    // console.log(`Fetching data from ${url}...`);

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 10000,
    });

    if (!response.data || typeof response.data !== 'string') {
      throw new Error('Contenu non valide (pas de HTML)');
    }

    const $ = cheerio.load(response.data);

    let articles: ArticleData[] = [];

    $('article').each((_, el) => {
      const title = $(el).find('h2').text().trim();
      const url = 'https://dev.to' + ($(el).find('a').attr('href') || '');
      const image = $(el).find('img').attr('src') || null;

      if (title && url) {
        articles.push({ title, url, image });
      }
    });

    if (maxResults > 0) {
      articles = articles.slice(0, maxResults);
    }

    if (articles.length > 0) {
      // console.log('Scraped Articles:');
      articles.forEach((a, i) =>
        console.log(`${i + 1}. ${a.title} (${a.url})`)
      );

      if (save) {
        writeFileSync('articles.json', JSON.stringify(articles, null, 2), 'utf8');
        // console.log('Articles saved to articles.json');
      }

      return articles;
    }

    // console.warn('Aucun article trouvé en scraping, fallback API dev.to...');
    throw new Error('Scraping vide');
  } catch (error: any) {
    // console.error('Scraping échoué:', error.message);

    // ✅ Fallback API dev.to
    try {
      const tag = query ? query.split(' ')[0].toLowerCase() : 'javascript';
      const apiUrl = `https://dev.to/api/articles?tag=${encodeURIComponent(
        tag
      )}&per_page=${maxResults || 10}`;
      // console.log(`Fetching data from API: ${apiUrl}`);

      const apiResponse = await axios.get(apiUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });

      const articles: ArticleData[] = apiResponse.data.map((article: any) => ({
        title: article.title,
        url: article.url,
        image: article.cover_image || null,
        views: article.public_reactions_count || 0,
        comments: article.comments_count || 0,
      }));

      if (save && articles.length > 0) {
        writeFileSync('articles.json', JSON.stringify(articles, null, 2), 'utf8');
        // console.log('Articles saved to articles.json');
      }

      return articles;
    } catch (apiError: any) {
      // console.error('Fallback API dev.to échoué:', apiError.message);
      return [];
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
 }
   

  