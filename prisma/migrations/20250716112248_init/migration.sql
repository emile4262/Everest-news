-- CreateEnum
CREATE TYPE "ExternalContentType" AS ENUM ('ARTICLE', 'VIDEO', 'COURSE', 'TUTORIAL');

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

-- CreateIndex
CREATE UNIQUE INDEX "external_contents_url_key" ON "external_contents"("url");

-- AddForeignKey
ALTER TABLE "external_contents" ADD CONSTRAINT "external_contents_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
