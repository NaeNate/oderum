-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "longevity" INTEGER NOT NULL,
    "sillage" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "fragranceId" INTEGER NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_fragranceId_key" ON "Vote"("userId", "fragranceId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_fragranceId_fkey" FOREIGN KEY ("fragranceId") REFERENCES "Fragrance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
