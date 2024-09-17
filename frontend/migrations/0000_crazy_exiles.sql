CREATE TABLE IF NOT EXISTS "annotations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"audio_version_id" uuid NOT NULL,
	"timestamp" timestamp NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audio_versions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"voice_id" text NOT NULL,
	"voice_name" text NOT NULL,
	"text" text NOT NULL,
	"date_created" timestamp DEFAULT now(),
	"version" integer NOT NULL,
	"parent_version_id" uuid,
	"is_latest" boolean NOT NULL,
	"eleven_labs_history_item_id" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "annotations" ADD CONSTRAINT "annotations_audio_version_id_audio_versions_id_fk" FOREIGN KEY ("audio_version_id") REFERENCES "public"."audio_versions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audio_version_id_idx" ON "annotations" USING btree ("audio_version_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audio_version_timestamp_idx" ON "annotations" USING btree ("audio_version_id","timestamp");