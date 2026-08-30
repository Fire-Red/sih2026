CREATE TYPE "public"."application_status" AS ENUM('submitted', 'under_review', 'shortlisted', 'selected_winner', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('active', 'prototype', 'pilot', 'deployment', 'completed', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."review_event_action" AS ENUM('winner_selected');--> statement-breakpoint
CREATE TABLE "active_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"problem_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" "project_status" DEFAULT 'active' NOT NULL,
	"milestones" jsonb,
	"pilot_evidence" jsonb,
	"start_date" timestamp with time zone DEFAULT now() NOT NULL,
	"target_end_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "active_projects_problem_id_unique" UNIQUE("problem_id")
);
--> statement-breakpoint
CREATE TABLE "government_review_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"problem_id" uuid NOT NULL,
	"application_id" uuid NOT NULL,
	"reviewer_id" uuid,
	"action" "review_event_action" NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "problem_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"problem_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	"applicant_user_id" uuid,
	"reviewed_by" uuid,
	"pitch_summary" text NOT NULL,
	"video_url" text,
	"ppt_url" text,
	"repo_url" text,
	"status" "application_status" DEFAULT 'submitted' NOT NULL,
	"review_notes" text,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_name" text NOT NULL,
	"leader_id" uuid NOT NULL,
	"institution_name" text NOT NULL,
	"faculty_mentor_name" text,
	"members" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "problem_reports" ADD COLUMN "max_teams_allowed" integer DEFAULT 3 NOT NULL;--> statement-breakpoint
ALTER TABLE "problem_reports" ADD COLUMN "applied_teams_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "problem_reports" ADD COLUMN "sponsoring_department" text;--> statement-breakpoint
ALTER TABLE "problem_reports" ADD COLUMN "grant_amount" text;--> statement-breakpoint
ALTER TABLE "problem_reports" ADD COLUMN "selected_team_id" uuid;--> statement-breakpoint
ALTER TABLE "active_projects" ADD CONSTRAINT "active_projects_problem_id_problem_reports_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problem_reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "active_projects" ADD CONSTRAINT "active_projects_team_id_student_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."student_teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "government_review_events" ADD CONSTRAINT "government_review_events_problem_id_problem_reports_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problem_reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "government_review_events" ADD CONSTRAINT "government_review_events_application_id_problem_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."problem_applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "government_review_events" ADD CONSTRAINT "government_review_events_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem_applications" ADD CONSTRAINT "problem_applications_problem_id_problem_reports_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problem_reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem_applications" ADD CONSTRAINT "problem_applications_team_id_student_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."student_teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem_applications" ADD CONSTRAINT "problem_applications_applicant_user_id_users_id_fk" FOREIGN KEY ("applicant_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem_applications" ADD CONSTRAINT "problem_applications_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_teams" ADD CONSTRAINT "student_teams_leader_id_users_id_fk" FOREIGN KEY ("leader_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "problem_applications_problem_team_idx" ON "problem_applications" USING btree ("problem_id","team_id");