import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name);
  private readonly apiKey = process.env.YOUTUBE_API_KEY;
  private readonly baseUrl = 'https://www.googleapis.com/youtube/v3/search';

  constructor(private readonly http: HttpService) {}

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
        // thumbnail: item.snippet.thumbnails.medium.url,
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
}