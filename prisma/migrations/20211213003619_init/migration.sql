/*
  Warnings:

  - You are about to drop the column `sourceId` on the `contents` table. All the data in the column will be lost.
  - You are about to drop the column `channelId` on the `Channel` table. All the data in the column will be lost.
  - Added the required column `content_id` to the `contents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `contents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channel_id` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_contents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "media_type" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "ord" INTEGER NOT NULL,
    "created_at" INTEGER NOT NULL DEFAULT 946684800,
    CONSTRAINT "contents_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_contents" ("created_at", "description", "id", "media_type", "ord") SELECT "created_at", "description", "id", "media_type", "ord" FROM "contents";
DROP TABLE "contents";
ALTER TABLE "new_contents" RENAME TO "contents";
CREATE TABLE "new_Channel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "channel_id" INTEGER NOT NULL,
    CONSTRAINT "Channel_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Channel" ("id") SELECT "id" FROM "Channel";
DROP TABLE "Channel";
ALTER TABLE "new_Channel" RENAME TO "Channel";
CREATE UNIQUE INDEX "Channel_channel_id_key" ON "Channel"("channel_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
