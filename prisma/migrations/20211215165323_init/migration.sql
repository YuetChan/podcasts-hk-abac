/*
  Warnings:

  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `categories` table. All the data in the column will be lost.
  - The primary key for the `tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `tags` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new__CategoryToContent" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "categories" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "contents" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__CategoryToContent" ("A", "B") SELECT "A", "B" FROM "_CategoryToContent";
DROP TABLE "_CategoryToContent";
ALTER TABLE "new__CategoryToContent" RENAME TO "_CategoryToContent";
CREATE UNIQUE INDEX "_CategoryToContent_AB_unique" ON "_CategoryToContent"("A", "B");
CREATE INDEX "_CategoryToContent_B_index" ON "_CategoryToContent"("B");
CREATE TABLE "new__ContentToTag" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    FOREIGN KEY ("A") REFERENCES "contents" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "tags" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__ContentToTag" ("A", "B") SELECT "A", "B" FROM "_ContentToTag";
DROP TABLE "_ContentToTag";
ALTER TABLE "new__ContentToTag" RENAME TO "_ContentToTag";
CREATE UNIQUE INDEX "_ContentToTag_AB_unique" ON "_ContentToTag"("A", "B");
CREATE INDEX "_ContentToTag_B_index" ON "_ContentToTag"("B");
CREATE TABLE "new_categories" (
    "name" TEXT NOT NULL PRIMARY KEY
);
INSERT INTO "new_categories" ("name") SELECT "name" FROM "categories";
DROP TABLE "categories";
ALTER TABLE "new_categories" RENAME TO "categories";
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");
CREATE TABLE "new_tags" (
    "name" TEXT NOT NULL PRIMARY KEY
);
INSERT INTO "new_tags" ("name") SELECT "name" FROM "tags";
DROP TABLE "tags";
ALTER TABLE "new_tags" RENAME TO "tags";
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
