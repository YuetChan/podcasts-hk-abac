-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_upload_quota" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quotaId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 5,
    "uploaded_at" INTEGER NOT NULL DEFAULT 946684800,
    CONSTRAINT "upload_quota_quotaId_fkey" FOREIGN KEY ("quotaId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_upload_quota" ("count", "id", "quotaId", "uploaded_at") SELECT "count", "id", "quotaId", "uploaded_at" FROM "upload_quota";
DROP TABLE "upload_quota";
ALTER TABLE "new_upload_quota" RENAME TO "upload_quota";
CREATE UNIQUE INDEX "upload_quota_quotaId_key" ON "upload_quota"("quotaId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
