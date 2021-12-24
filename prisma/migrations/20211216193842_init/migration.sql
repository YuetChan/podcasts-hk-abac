/*
  Warnings:

  - Added the required column `description` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `contents` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "description" TEXT NOT NULL
);
INSERT INTO "new_users" ("email", "id", "name", "role") SELECT "email", "id", "name", "role" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE TABLE "new_contents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "media_type" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "ord" INTEGER NOT NULL,
    "created_at" INTEGER NOT NULL DEFAULT 946684800,
    CONSTRAINT "contents_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_contents" ("content_id", "created_at", "description", "id", "media_type", "ord", "source", "title") SELECT "content_id", "created_at", "description", "id", "media_type", "ord", "source", "title" FROM "contents";
DROP TABLE "contents";
ALTER TABLE "new_contents" RENAME TO "contents";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
