-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "source" TEXT,
ADD COLUMN     "topicId" TEXT,
ADD COLUMN     "url" TEXT;

-- AlterTable
ALTER TABLE "scraping_sources" ADD COLUMN     "sourceType" TEXT NOT NULL DEFAULT 'YOUTUBE';

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;
