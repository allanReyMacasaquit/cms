ALTER TABLE "store" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "store" ALTER COLUMN "id" SET DEFAULT 'gen_random_uuid()';