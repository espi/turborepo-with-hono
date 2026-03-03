CREATE TYPE "public"."todo_type" AS ENUM('work', 'personal');--> statement-breakpoint
ALTER TABLE "todos" ADD COLUMN "type" "todo_type" DEFAULT 'personal' NOT NULL;