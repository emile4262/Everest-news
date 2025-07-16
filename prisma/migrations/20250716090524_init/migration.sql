-- CreateTable
CREATE TABLE "scraping_logs" (
    "id" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "itemsScraped" INTEGER NOT NULL DEFAULT 0,
    "executionTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scraping_logs_pkey" PRIMARY KEY ("id")
);
