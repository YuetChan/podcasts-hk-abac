/*
  Warnings:

  - You are about to drop the column `quotaId` on the `upload_quota` table. All the data in the column will be lost.
  - Added the required column `title` to the `contents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quota_id` to the `upload_quota` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "play_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "history_id" INTEGER NOT NULL,
    "content_id" INTEGER NOT NULL,
    "played_at" INTEGER NOT NULL,
    CONSTRAINT "play_history_history_id_fkey" FOREIGN KEY ("history_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "play_history_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "contents" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sub_id" INTEGER NOT NULL,
    CONSTRAINT "Subscription_sub_id_fkey" FOREIGN KEY ("sub_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_contents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "media_type" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "ord" INTEGER NOT NULL,
    "created_at" INTEGER NOT NULL DEFAULT 946684800,
    CONSTRAINT "contents_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_contents" ("content_id", "created_at", "description", "id", "media_type", "ord", "source") SELECT "content_id", "created_at", "description", "id", "media_type", "ord", "source" FROM "contents";
DROP TABLE "contents";
ALTER TABLE "new_contents" RENAME TO "contents";
CREATE TABLE "new_upload_quota" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quota_id" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 5,
    "uploaded_at" INTEGER NOT NULL DEFAULT 946684800,
    CONSTRAINT "upload_quota_quota_id_fkey" FOREIGN KEY ("quota_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_upload_quota" ("count", "id", "uploaded_at") SELECT "count", "id", "uploaded_at" FROM "upload_quota";
DROP TABLE "upload_quota";
ALTER TABLE "new_upload_quota" RENAME TO "upload_quota";
CREATE UNIQUE INDEX "upload_quota_quota_id_key" ON "upload_quota"("quota_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "play_history_history_id_key" ON "play_history"("history_id");

-- CreateIndex
CREATE UNIQUE INDEX "play_history_content_id_key" ON "play_history"("content_id");
