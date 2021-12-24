/*
  Warnings:

  - You are about to drop the column `upload_count` on the `upload_quota` table. All the data in the column will be lost.
  - Added the required column `count` to the `upload_quota` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_upload_quota" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quotaId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "uploaded_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "upload_quota_quotaId_fkey" FOREIGN KEY ("quotaId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_upload_quota" ("id", "quotaId", "uploaded_at") SELECT "id", "quotaId", "uploaded_at" FROM "upload_quota";
DROP TABLE "upload_quota";
ALTER TABLE "new_upload_quota" RENAME TO "upload_quota";
CREATE UNIQUE INDEX "upload_quota_quotaId_key" ON "upload_quota"("quotaId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
