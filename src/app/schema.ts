import * as t from 'drizzle-orm/pg-core';
export const store = t.pgTable('store', {
	id: t.uuid('id').primaryKey(),
	name: t.text('name').notNull(),
	userId: t.text('user_id').notNull(),
	createdAt: t.timestamp('created_at').defaultNow(),
	updatedAt: t.timestamp('updated_at').defaultNow(),
});

export const dashboard = t.pgTable('dashboard', {
	id: t.uuid('id').defaultRandom().primaryKey(),
	storeId: t
		.uuid('store_id')
		.notNull()
		.references(() => store.id),
	label: t.varchar('label', { length: 255 }).notNull(),
	description: t.varchar('description', { length: 255 }).notNull(),
	imageUrl: t.varchar('image_url', { length: 255 }).notNull(),
	createdAt: t.timestamp('created_at').defaultNow(),
	updatedAt: t.timestamp('updated_at').defaultNow(),
});

// Types for Insert and Select
export type InsertStore = typeof store.$inferInsert;
export type SelectStore = typeof store.$inferSelect;

export type InsertDashboard = typeof dashboard.$inferInsert;
export type SelectDashboard = typeof dashboard.$inferSelect;
