-- CreateTable
CREATE TABLE "Interviewer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "Availability" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "interviewerId" INTEGER NOT NULL,
    FOREIGN KEY ("interviewerId") REFERENCES "Interviewer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "Interview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "interviewerId" INTEGER NOT NULL,
    "candidiateId" INTEGER NOT NULL,
    "start" DATETIME NOT NULL,
    FOREIGN KEY ("interviewerId") REFERENCES "Interviewer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("candidiateId") REFERENCES "Candidate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
