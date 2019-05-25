--------------------------------------------------
-- Up
--------------------------------------------------

CREATE TABLE "gameMetadata" (
    "fileHash" TEXT PRIMARY KEY NOT NULL,
    "title" TEXT NOT NULL, 
    "completed" BOOLEAN NOT NULL DEFAULT 0  -- Default to not completed
);

--------------------------------------------------
-- Down
--------------------------------------------------

DROP TABLE "gameMetadata";