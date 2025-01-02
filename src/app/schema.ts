import { relations } from 'drizzle-orm';
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

export const category = t.pgTable('category', {
	id: t.uuid('id').defaultRandom().primaryKey(),
	storeId: t
		.uuid('store_id')
		.notNull()
		.references(() => store.id),
	dashboardId: t
		.uuid('dashboard_id')
		.notNull()
		.references(() => dashboard.id),
	name: t.varchar('name', { length: 255 }).notNull(),
	createdAt: t.timestamp('created_at').defaultNow(),
	updatedAt: t.timestamp('updated_at').defaultNow(),
});

export const size = t.pgTable('size', {
	id: t.uuid('id').defaultRandom().primaryKey(),
	name: t.varchar('name', { length: 255 }).notNull(),
	value: t.varchar('value', { length: 255 }).notNull(),
	storeId: t
		.uuid('store_id')
		.notNull()
		.references(() => store.id),
	createdAt: t.timestamp('created_at').defaultNow(),
	updatedAt: t.timestamp('updated_at').defaultNow(),
});

export const color = t.pgTable('color', {
	id: t.uuid('id').defaultRandom().primaryKey(),
	name: t.varchar('name', { length: 255 }).notNull(),
	value: t.varchar('value', { length: 255 }).notNull(),
	storeId: t
		.uuid('store_id')
		.notNull()
		.references(() => store.id),
	createdAt: t.timestamp('created_at').defaultNow(),
	updatedAt: t.timestamp('updated_at').defaultNow(),
});

export const product = t.pgTable('product', {
	id: t.uuid('id').defaultRandom().primaryKey(),
	name: t.varchar('name', { length: 255 }).notNull(),
	price: t.decimal('price', { precision: 10, scale: 2 }).notNull(),
	isFeatured: t.boolean().notNull().default(false),
	isArchived: t.boolean().notNull().default(false),
	storeId: t
		.uuid('store_id')
		.notNull()
		.references(() => store.id),
	category: t
		.uuid('category_id')
		.notNull()
		.references(() => category.id),
	size: t
		.uuid('size_id')
		.notNull()
		.references(() => size.id),
	color: t
		.uuid('color_id')
		.notNull()
		.references(() => color.id),
	createdAt: t.timestamp('created_at').defaultNow(),
	updatedAt: t.timestamp('updated_at').defaultNow(),
});

export const image = t.pgTable('image', {
	id: t.uuid('id').defaultRandom().primaryKey(),
	url: t.varchar('url', { length: 255 }).notNull(),
	productId: t
		.uuid('product_id')
		.notNull()
		.references(() => product.id, { onDelete: 'cascade' }),
	createdAt: t.timestamp('created_at').defaultNow(),
	updatedAt: t.timestamp('updated_at').defaultNow(),
});

export const categoryRelations = relations(category, ({ one }) => ({
	dashboard: one(dashboard, {
		fields: [category.dashboardId],
		references: [dashboard.id],
	}),
}));

// Types for Insert and Select
export type InsertStore = typeof store.$inferInsert;
export type SelectStore = typeof store.$inferSelect;

export type InsertDashboard = typeof dashboard.$inferInsert;
export type SelectDashboard = typeof dashboard.$inferSelect;

export type InsertCategory = typeof category.$inferInsert;
export type SelectCategory = typeof category.$inferSelect;

export type InsertSize = typeof size.$inferInsert;
export type SelectSize = typeof size.$inferSelect;

export type InsertColor = typeof color.$inferInsert;
export type SelectColor = typeof color.$inferSelect;

export type InsertProduct = typeof product.$inferInsert;
export type SelectProduct = typeof product.$inferSelect;
