-- CreateTable
CREATE TABLE "LearningAttempt" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "activityType" TEXT NOT NULL DEFAULT 'game',
    "title" TEXT NOT NULL,
    "grade" TEXT,
    "subject" TEXT NOT NULL DEFAULT '',
    "topic" TEXT NOT NULL DEFAULT '',
    "skill" TEXT NOT NULL DEFAULT '',
    "difficulty" TEXT NOT NULL DEFAULT '',
    "gameType" TEXT NOT NULL DEFAULT '',
    "completedLevel" TEXT NOT NULL DEFAULT '',
    "worldId" INTEGER,
    "levelId" INTEGER,
    "isBoss" BOOLEAN NOT NULL DEFAULT false,
    "correct" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,
    "scorePct" INTEGER NOT NULL DEFAULT 0,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningAttempt_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StudentAnswer" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL DEFAULT '',
    "selected" TEXT NOT NULL DEFAULT '',
    "correctAnswer" TEXT NOT NULL DEFAULT '',
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "difficulty" TEXT NOT NULL DEFAULT 'easy',
    "subject" TEXT NOT NULL DEFAULT '',
    "topic" TEXT NOT NULL DEFAULT '',
    "skill" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentAnswer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StudentBadge" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentBadge_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ParentNotification" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "profileId" TEXT,
    "type" TEXT NOT NULL DEFAULT 'info',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL DEFAULT '',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParentNotification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "LearningAttempt_profileId_createdAt_idx" ON "LearningAttempt"("profileId", "createdAt");
CREATE INDEX "LearningAttempt_activityType_idx" ON "LearningAttempt"("activityType");
CREATE INDEX "StudentAnswer_questionId_isCorrect_idx" ON "StudentAnswer"("questionId", "isCorrect");
CREATE INDEX "StudentAnswer_attemptId_idx" ON "StudentAnswer"("attemptId");
CREATE UNIQUE INDEX "StudentBadge_profileId_badgeId_key" ON "StudentBadge"("profileId", "badgeId");
CREATE INDEX "StudentBadge_profileId_idx" ON "StudentBadge"("profileId");
CREATE INDEX "ParentNotification_parentId_read_createdAt_idx" ON "ParentNotification"("parentId", "read", "createdAt");

ALTER TABLE "LearningAttempt" ADD CONSTRAINT "LearningAttempt_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ChildProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentAnswer" ADD CONSTRAINT "StudentAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "LearningAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentBadge" ADD CONSTRAINT "StudentBadge_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ChildProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
