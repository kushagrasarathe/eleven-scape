CREATE TABLE IF NOT EXISTS "annotations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"audio_version_id" text NOT NULL,
	"annotationTimeframe" numeric NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audio_versions" (
	"id" text PRIMARY KEY NOT NULL,
	"voice_id" text NOT NULL,
	"voice_name" text NOT NULL,
	"text" text NOT NULL,
	"date_created" timestamp DEFAULT now(),
	"version" integer NOT NULL,
	"parent_version_id" text,
	"is_latest" boolean NOT NULL,
	"eleven_labs_history_item_id" text
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audio_version_id_idx" ON "annotations" USING btree ("audio_version_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audio_version_timestamp_idx" ON "annotations" USING btree ("audio_version_id","annotationTimeframe");