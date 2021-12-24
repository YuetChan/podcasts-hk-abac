/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Category";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user'
);

-- CreateTable
CREATE TABLE "categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
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
    CONSTRAINT "contents_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_contents" ("content_id", "created_at", "description", "id", "media_type", "ord", "source", "title") SELECT "content_id", "created_at", "description", "id", "media_type", "ord", "source", "title" FROM "contents";
DROP TABLE "contents";
ALTER TABLE "new_contents" RENAME TO "contents";
CREATE TABLE "new__CategoryToContent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "contents" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__CategoryToContent" ("A", "B") SELECT "A", "B" FROM "_CategoryToContent";
DROP TABLE "_CategoryToContent";
ALTER TABLE "new__CategoryToContent" RENAME TO "_CategoryToContent";
CREATE UNIQUE INDEX "_CategoryToContent_AB_unique" ON "_CategoryToContent"("A", "B");
CREATE INDEX "_CategoryToContent_B_index" ON "_CategoryToContent"("B");
CREATE TABLE "new_play_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "history_id" INTEGER NOT NULL,
    "content_id" INTEGER NOT NULL,
    "created_at" INTEGER NOT NULL,
    "played_at" INTEGER NOT NULL,
    CONSTRAINT "play_history_history_id_fkey" FOREIGN KEY ("history_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "play_history_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "contents" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_play_history" ("content_id", "created_at", "history_id", "id", "played_at") SELECT "content_id", "created_at", "history_id", "id", "played_at" FROM "play_history";
DROP TABLE "play_history";
ALTER TABLE "new_play_history" RENAME TO "play_history";
CREATE UNIQUE INDEX "play_history_history_id_key" ON "play_history"("history_id");
CREATE TABLE "new_upload_quota" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quota_id" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 5,
    "uploaded_at" INTEGER NOT NULL DEFAULT 946684800,
    CONSTRAINT "upload_quota_quota_id_fkey" FOREIGN KEY ("quota_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_upload_quota" ("count", "id", "quota_id", "uploaded_at") SELECT "count", "id", "quota_id", "uploaded_at" FROM "upload_quota";
DROP TABLE "upload_quota";
ALTER TABLE "new_upload_quota" RENAME TO "upload_quota";
CREATE UNIQUE INDEX "upload_quota_quota_id_key" ON "upload_quota"("quota_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
