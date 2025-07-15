/*
  Warnings:

  - You are about to drop the `article_tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ExternalContentType" AS ENUM ('ARTICLE', 'VIDEO', 'COURSE', 'TUTORIAL');

-- DropForeignKey
ALTER TABLE "article_tags" DROP CONSTRAINT "article_tags_articleId_fkey";

-- DropForeignKey
ALTER TABLE "article_tags" DROP CONSTRAINT "article_tags_tagId_fkey";

-- DropTable
DROP TABLE "article_tags";

-- DropTable
DROP TABLE "tags";

-- CreateTable
CREATE TABLE "external_contents" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT,
    "author" TEXT,
    "source" TEXT NOT NULL,
    "type" "ExternalContentType" NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "external_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_content_views" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "externalContentId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "external_content_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "external_contents_url_key" ON "external_contents"("url");

-- CreateIndex
CREATE UNIQUE INDEX "external_content_views_userId_externalContentId_key" ON "external_content_views"("userId", "externalContentId");

-- AddForeignKey
ALTER TABLE "external_contents" ADD CONSTRAINT "external_contents_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_content_views" ADD CONSTRAINT "external_content_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_content_views" ADD CONSTRAINT "external_content_views_externalContentId_fkey" FOREIGN KEY ("externalContentId") REFERENCES "external_contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
