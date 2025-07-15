/*
  Warnings:

  - You are about to drop the `external_content_views` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `external_contents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "external_content_views" DROP CONSTRAINT "external_content_views_externalContentId_fkey";

-- DropForeignKey
ALTER TABLE "external_content_views" DROP CONSTRAINT "external_content_views_userId_fkey";

-- DropForeignKey
ALTER TABLE "external_contents" DROP CONSTRAINT "external_contents_topicId_fkey";

-- DropTable
DROP TABLE "external_content_views";

-- DropTable
DROP TABLE "external_contents";

-- DropEnum
DROP TYPE "ExternalContentType";

-- CreateTable
CREATE TABLE "scraping_sources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "selector" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastScrapedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "scraping_sources_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "scraping_sources" ADD CONSTRAINT "scraping_sources_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
