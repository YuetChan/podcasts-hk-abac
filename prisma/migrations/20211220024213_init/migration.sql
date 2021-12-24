-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_subscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "subscriber_id" INTEGER NOT NULL,
    "created_at" INTEGER NOT NULL DEFAULT 946684800,
    CONSTRAINT "subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_subscription" ("id", "subscriber_id", "user_id") SELECT "id", "subscriber_id", "user_id" FROM "subscription";
DROP TABLE "subscription";
ALTER TABLE "new_subscription" RENAME TO "subscription";
CREATE UNIQUE INDEX "subscription_user_id_subscriber_id_key" ON "subscription"("user_id", "subscriber_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
