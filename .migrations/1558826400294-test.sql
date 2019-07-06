--------------------------------------------------
-- Up
--------------------------------------------------

CREATE TABLE "event" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL, 
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--------------------------------------------------
-- Down
--------------------------------------------------

DROP TABLE "event";