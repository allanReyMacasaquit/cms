import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const store = pgTable('store', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	userId: text('user_id').notNull(),
	createdAt: timestamp('created_At').defaultNow(),
	updatedAt: timestamp('updated_At').defaultNow(),
});

// export const postsTable = pgTable('posts_table', {
// 	id: serial('id').primaryKey(),
// 	title: text('title').notNull(),
// 	content: text('content').notNull(),
// 	userId: integer('user_id')
// 		.notNull()
// 		.references(() => usersTable.id, { onDelete: 'cascade' }),
// 	createdAt: timestamp('created_at').notNull().defaultNow(),
// 	updatedAt: timestamp('updated_at')
// 		.notNull()
// 		.$onUpdate(() => new Date()),
// });

export type InsertUser = typeof store.$inferInsert;
export type SelectUser = typeof store.$inferSelect;
