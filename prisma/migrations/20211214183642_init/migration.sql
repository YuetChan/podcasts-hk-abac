/*
  Warnings:

  - Added the required column `created_at` to the `play_history` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_play_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "history_id" INTEGER NOT NULL,
    "content_id" INTEGER NOT NULL,
    "created_at" INTEGER NOT NULL,
    "played_at" INTEGER NOT NULL,
    CONSTRAINT "play_history_history_id_fkey" FOREIGN KEY ("history_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "play_history_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "contents" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_play_history" ("content_id", "history_id", "id", "played_at") SELECT "content_id", "history_id", "id", "played_at" FROM "play_history";
DROP TABLE "play_history";
ALTER TABLE "new_play_history" RENAME TO "play_history";
CREATE UNIQUE INDEX "play_history_history_id_key" ON "play_history"("history_id");
CREATE UNIQUE INDEX "play_history_content_id_key" ON "play_history"("content_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
