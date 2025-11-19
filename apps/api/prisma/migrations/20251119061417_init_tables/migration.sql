-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "nickname" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "cluster_id" INTEGER NOT NULL,
    "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diary_reminder" TIME,
    "bgm_volume" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "sfx_volume" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "used_flag" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Diary" (
    "diary_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "original_text" TEXT NOT NULL,
    "emotion_id" INTEGER NOT NULL,
    "object_id" INTEGER,
    "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "input_type" VARCHAR(10) NOT NULL,
    "flag" VARCHAR(10) NOT NULL,

    CONSTRAINT "Diary_pkey" PRIMARY KEY ("diary_id")
);

-- CreateTable
CREATE TABLE "EmotionResult" (
    "emotion_id" SERIAL NOT NULL,
    "diary_id" INTEGER NOT NULL,
    "summary_text" TEXT NOT NULL,
    "main_emotion" VARCHAR(20) NOT NULL,
    "keyword_1" VARCHAR(30),
    "keyword_2" VARCHAR(30),
    "keyword_3" VARCHAR(30),
    "embedding" DOUBLE PRECISION[],

    CONSTRAINT "EmotionResult_pkey" PRIMARY KEY ("emotion_id")
);

-- CreateTable
CREATE TABLE "Object" (
    "object_id" SERIAL NOT NULL,
    "emotion_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "diary_id" INTEGER NOT NULL,
    "object_name" VARCHAR(50) NOT NULL,
    "object_image" TEXT NOT NULL,
    "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Object_pkey" PRIMARY KEY ("object_id")
);

-- CreateTable
CREATE TABLE "BGM" (
    "bgm_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "emotion_id" INTEGER NOT NULL,
    "diary_id" INTEGER NOT NULL,
    "bgm_url" TEXT NOT NULL,
    "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BGM_pkey" PRIMARY KEY ("bgm_id")
);

-- CreateTable
CREATE TABLE "Report" (
    "report_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "emotion_id" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "summary_text" TEXT NOT NULL,
    "encouragement_text" TEXT NOT NULL,
    "emotion_distribution" JSONB NOT NULL,
    "created_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("report_id")
);

-- CreateTable
CREATE TABLE "ClusterGroup" (
    "cluster_id" SERIAL NOT NULL,
    "centroid_vector" DOUBLE PRECISION[],
    "representative_emotions" INTEGER NOT NULL,
    "representative_keywords" TEXT[],
    "user_count" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,

    CONSTRAINT "ClusterGroup_pkey" PRIMARY KEY ("cluster_id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notify_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "notify_time" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" VARCHAR(20) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notify_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Diary_emotion_id_key" ON "Diary"("emotion_id");

-- CreateIndex
CREATE UNIQUE INDEX "Diary_object_id_key" ON "Diary"("object_id");

-- CreateIndex
CREATE UNIQUE INDEX "EmotionResult_diary_id_key" ON "EmotionResult"("diary_id");

-- CreateIndex
CREATE UNIQUE INDEX "Object_diary_id_key" ON "Object"("diary_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_cluster_id_fkey" FOREIGN KEY ("cluster_id") REFERENCES "ClusterGroup"("cluster_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diary" ADD CONSTRAINT "Diary_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diary" ADD CONSTRAINT "Diary_emotion_id_fkey" FOREIGN KEY ("emotion_id") REFERENCES "EmotionResult"("emotion_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Object" ADD CONSTRAINT "Object_emotion_id_fkey" FOREIGN KEY ("emotion_id") REFERENCES "EmotionResult"("emotion_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Object" ADD CONSTRAINT "Object_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Object" ADD CONSTRAINT "Object_diary_id_fkey" FOREIGN KEY ("diary_id") REFERENCES "Diary"("diary_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BGM" ADD CONSTRAINT "BGM_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BGM" ADD CONSTRAINT "BGM_emotion_id_fkey" FOREIGN KEY ("emotion_id") REFERENCES "EmotionResult"("emotion_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BGM" ADD CONSTRAINT "BGM_diary_id_fkey" FOREIGN KEY ("diary_id") REFERENCES "Diary"("diary_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_emotion_id_fkey" FOREIGN KEY ("emotion_id") REFERENCES "EmotionResult"("emotion_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
