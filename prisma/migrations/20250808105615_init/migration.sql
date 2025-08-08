/*
  Warnings:

  - You are about to drop the `external_contents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `scraping_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `scraping_sources` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_article_reads` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "external_contents" DROP CONSTRAINT "external_contents_topicId_fkey";

-- DropForeignKey
ALTER TABLE "scraping_sources" DROP CONSTRAINT "scraping_sources_topicId_fkey";

-- DropForeignKey
ALTER TABLE "user_article_reads" DROP CONSTRAINT "user_article_reads_articleId_fkey";

-- DropForeignKey
ALTER TABLE "user_article_reads" DROP CONSTRAINT "user_article_reads_userId_fkey";

-- DropTable
DROP TABLE "external_contents";

-- DropTable
DROP TABLE "scraping_logs";

-- DropTable
DROP TABLE "scraping_sources";

-- DropTable
DROP TABLE "user_article_reads";

-- CreateTable
CREATE TABLE "Scraping" (
    "title" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "publishedat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "topicId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Scraping_videoUrl_key" ON "Scraping"("videoUrl");

-- AddForeignKey
ALTER TABLE "Scraping" ADD CONSTRAINT "Scraping_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
