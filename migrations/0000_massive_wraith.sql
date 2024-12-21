CREATE TABLE "store" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"user_id" text NOT NULL,
	"created_At" timestamp DEFAULT now(),
	"updated_At" timestamp DEFAULT now()
);
