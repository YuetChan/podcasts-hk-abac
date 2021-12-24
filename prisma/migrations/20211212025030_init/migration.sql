-- CreateTable
CREATE TABLE "upload_quota" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quotaId" INTEGER NOT NULL,
    "upload_count" INTEGER NOT NULL,
    "uploaded_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "upload_quota_quotaId_fkey" FOREIGN KEY ("quotaId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "upload_quota_quotaId_key" ON "upload_quota"("quotaId");
