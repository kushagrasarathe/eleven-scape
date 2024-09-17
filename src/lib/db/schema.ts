import {
  boolean,
  decimal,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const audioVersions = pgTable('audio_versions', {
  id: text('id').primaryKey(),
  voice_id: text('voice_id').notNull(),
  voice_name: text('voice_name').notNull(),
  text: text('text').notNull(),
  date_created: timestamp('date_created').defaultNow(),
  version: integer('version').notNull(),
  parent_version_id: text('parent_version_id'),
  is_latest: boolean('is_latest').notNull(),
  eleven_labs_history_item_id: text('eleven_labs_history_item_id'),
});

export const annotations = pgTable(
  'annotations',
  {
    id: uuid('id').primaryKey(),
    audio_version_id: text('audio_version_id').notNull(),
    annotationTimeframe: decimal('annotationTimeframe').notNull(),
    text: text('text').notNull(),
    created_at: timestamp('created_at').defaultNow(),
  },
  (annotations) => ({
    audioVersionIdIdx: index('audio_version_id_idx').on(
      annotations.audio_version_id
    ),
    audioVersionTimestampIdx: index('audio_version_timestamp_idx').on(
      annotations.audio_version_id,
      annotations.annotationTimeframe
    ),
  })
);

export type TAudioVersions = typeof audioVersions.$inferInsert;
export type SelectVoiceHistory = typeof audioVersions.$inferSelect;
export type TAnnotation = typeof annotations.$inferInsert;
