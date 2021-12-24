/*
  Warnings:

  - You are about to drop the column `content_id` on the `contents` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `contents` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_contents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" INTEGER,
    "media_type" TEXT,
    "source" TEXT NOT NULL,
    "ord" INTEGER NOT NULL,
    "created_at" INTEGER NOT NULL DEFAULT 946684800,
    CONSTRAINT "contents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_contents" ("created_at", "description", "duration", "id", "media_type", "ord", "source", "title") SELECT "created_at", "description", "duration", "id", "media_type", "ord", "source", "title" FROM "contents";
DROP TABLE "contents";
ALTER TABLE "new_contents" RENAME TO "contents";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
