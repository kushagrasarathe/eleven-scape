import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const historyTable = pgTable('history_table', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  voice_id: varchar('voice_id', { length: 255 }).notNull().unique(),
  voice_name: varchar('voice_name', { length: 255 }).unique(),
  voice_category: varchar('voice_category', { length: 255 }),
});

export type InsertVoiceHistory = typeof historyTable.$inferInsert;
export type SelectVoiceHistory = typeof historyTable.$inferSelect;
