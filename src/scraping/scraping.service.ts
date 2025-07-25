import { Injectable, Logger } from '@nestjs/common';
import {HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import cheerio from 'cheerio';
import axios from 'axios';
import puppeteer from 'puppeteer';


@Injectable()
export class ScrapingService {
  [x: string]: any;
  findAll(query: string, maxResults: number) {
  }
  private readonly logger = new Logger(ScrapingService.name);
  private readonly apiKey = process.env.YOUTUBE_API_KEY;
   private readonly baseUrl = 'https://www.googleapis.com/youtube/v3/search';
  private readonly devtoApi = process.env.DEVTO_API_KEY;
  private readonly devtoBaseUrl = 'https://dev.to/api/articles?username=';
  private readonly mediumApi = process.env.MEDIUM_API_KEY;
  

  constructor(private readonly http: HttpService  ) {}

  async scrapeByKeyword(query: string, maxResults = 10) {
    const params = {
      key: this.apiKey,
      q: query,
      part: 'snippet',
      type: 'video',
      maxResults,
    };

    try {
      const response = await firstValueFrom(
        this.http.get(this.baseUrl, { params })
      );

      const videos = response.data.items.map((item) => ({
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        videoId: item.id.videoId,
        videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        thumbnail: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description,
      }));

      this.logger.log(`${videos.length} vidéos récupérées pour "${query}"`);
 
      return videos;
    } catch (error) {
      this.logger.error(`Erreur scraping YouTube : ${error.message}`);
      throw error;
    }
  }

  async scrapeDevtoListings(query: string, maxResults: number, ) {
  const params = {
      key: this.devtoApi,
      q: query,
      part: 'snippet',
      type: 'article',
      take: maxResults || 10, 
    };


  try {
     const response = await firstValueFrom(
        this.http.get(this.devtoBaseUrl, { params})
      );

  const devtoArticles = response.data.map((item) => ({
  title: item.title,
  url: `https://dev.to/${item.user.username}/${item.slug}`,
  publishedAt: item.published_at,
  author: item.user.name,
  description: item.description,
  thumbnail: item.social_image,
 

}));
  this.logger.log(`${devtoArticles.length} articles récupérés pour "${query}"`);
    return devtoArticles;

  } catch (error) {
    this.logger.error(`Erreur scraping Dev.to : ${error.message}`);
    throw error;
  } 
}

async scrapeMediumCategory(tag: string): Promise<{ title: string; link: string }[]> {
    const url = `https://medium.com/tag/${tag}`;
    this.logger.log(`Navigation vers ${url}`);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    const data: { title: string; link: string }[] = [];

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

      await page.waitForSelector('div.js-postListHandle', { timeout: 30000 });

      const articles = await page.$$eval('div.js-postListHandle article', (nodes) => {
        return nodes.map((el) => {
          const titleElement = el.querySelector('h2');
          const linkElement = el.querySelector('a');

          const title = titleElement?.textContent?.trim() || 'Sans titre';
          const link = linkElement?.getAttribute('href') || '';

          return { title, link };
        });
      });

      data.push(...articles);
      this.logger.log(`${data.length} articles trouvés pour la catégorie "${tag}"`);
    } catch (error) {
      this.logger.error(`Erreur lors du scraping de Medium : ${error.message}`);
    } finally {
      await browser.close();
    }

    return data;
  }
}
 