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
  // private readonly mediumApi = process.env.MEDIUM_API_KEY;
  // private readonly mediumBaseUrl = 'https://api.medium.com/v1/users';
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
      maxResults, 
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

//   await browser.close();
//   return articles;
// }

 }

 