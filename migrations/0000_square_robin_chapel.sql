CREATE TYPE "public"."log_type" AS ENUM('CREATE', 'UPDATE', 'DELETE');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('NOT_STARTED', 'ON_PROGRESS', 'DONE', 'REJECT');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('LEAD', 'TEAM');--> statement-breakpoint
CREATE TABLE "task_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" integer NOT NULL,
	"changed_by" integer NOT NULL,
	"log_type" "log_type" NOT NULL,
	"old_status" jsonb,
	"new_status" jsonb,
	"notes" text,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" "task_status" DEFAULT 'NOT_STARTED' NOT NULL,
	"created_by" integer NOT NULL,
	"assigned_to" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"role" "user_role" DEFAULT 'TEAM' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "assigned_to_index" ON "tasks" USING btree ("assigned_to");--> statement-breakpoint
CREATE INDEX "username_index" ON "users" USING btree ("username");