/*
  Warnings:

  - You are about to alter the column `uploaded_at` on the `upload_quota` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.
  - You are about to alter the column `created_at` on the `contents` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_upload_quota" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quotaId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "uploaded_at" INTEGER NOT NULL DEFAULT 946684800,
    CONSTRAINT "upload_quota_quotaId_fkey" FOREIGN KEY ("quotaId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_upload_quota" ("count", "id", "quotaId", "uploaded_at") SELECT "count", "id", "quotaId", "uploaded_at" FROM "upload_quota";
DROP TABLE "upload_quota";
ALTER TABLE "new_upload_quota" RENAME TO "upload_quota";
CREATE UNIQUE INDEX "upload_quota_quotaId_key" ON "upload_quota"("quotaId");
CREATE TABLE "new_contents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "media_type" TEXT NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "ord" INTEGER NOT NULL,
    "created_at" INTEGER NOT NULL DEFAULT 946684800
);
INSERT INTO "new_contents" ("created_at", "description", "id", "media_type", "ord", "sourceId") SELECT "created_at", "description", "id", "media_type", "ord", "sourceId" FROM "contents";
DROP TABLE "contents";
ALTER TABLE "new_contents" RENAME TO "contents";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
