-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Availability" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "interviewerId" INTEGER NOT NULL
);
INSERT INTO "new_Availability" ("end", "id", "interviewerId", "start") SELECT "end", "id", "interviewerId", "start" FROM "Availability";
DROP TABLE "Availability";
ALTER TABLE "new_Availability" RENAME TO "Availability";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
