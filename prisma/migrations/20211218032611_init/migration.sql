/*
  Warnings:

  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `A` on the `_CategoryToContent` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_categories" ("name") SELECT "name" FROM "categories";
DROP TABLE "categories";
ALTER TABLE "new_categories" RENAME TO "categories";
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");
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
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
