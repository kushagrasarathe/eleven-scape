CREATE TABLE IF NOT EXISTS "history_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"voice_id" varchar(255) NOT NULL,
	"voice_name" varchar(255),
	"voice_category" varchar(255),
	CONSTRAINT "history_table_voice_id_unique" UNIQUE("voice_id"),
	CONSTRAINT "history_table_voice_name_unique" UNIQUE("voice_name")
);
