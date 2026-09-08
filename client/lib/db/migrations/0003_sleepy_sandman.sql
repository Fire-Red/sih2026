CREATE TYPE "public"."impact_verification_type" AS ENUM('government', 'community', 'third_party');--> statement-breakpoint
CREATE TYPE "public"."measurement_type" AS ENUM('baseline', 'during_pilot', 'post_intervention', 'follow_up');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('verified', 'needs_review', 'unverified', 'conflict');--> statement-breakpoint
CREATE TABLE "capability_requirements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"problem_id" uuid NOT NULL,
	"capability" text NOT NULL,
	"priority" text DEFAULT 'important' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "impact_measurements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"measurement_type" "measurement_type" NOT NULL,
	"metric_name" text NOT NULL,
	"metric_value" text,
	"metric_unit" text,
	"measured_at" timestamp with time zone DEFAULT now() NOT NULL,
	"measured_by" uuid,
	"notes" text,
	"evidence_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "impact_verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"verified_by" uuid NOT NULL,
	"verification_type" "impact_verification_type" NOT NULL,
	"baseline_summary" text,
	"outcome_summary" text,
	"is_impact_verified" boolean DEFAULT false NOT NULL,
	"verification_notes" text,
	"verified_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "institution_capabilities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"institution_id" uuid NOT NULL,
	"capability" text NOT NULL,
	"department" text,
	"research_area" text,
	"description" text,
	"source_url" text,
	"source_type" text,
	"last_verified_at" timestamp with time zone,
	"verification_status" "verification_status" DEFAULT 'needs_review' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "institutions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"district" text,
	"address" text,
	"pin_code" text,
	"latitude" text,
	"longitude" text,
	"website" text,
	"source_url" text,
	"source_type" text,
	"retrieved_at" timestamp with time zone,
	"last_verified_at" timestamp with time zone,
	"verification_status" "verification_status" DEFAULT 'unverified' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "report_endorsements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "solution_memory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"problem_id" uuid NOT NULL,
	"problem_type" text NOT NULL,
	"approach" text NOT NULL,
	"requirements" text[],
	"measured_results" jsonb,
	"constraints" jsonb,
	"verification_status" "verification_status" DEFAULT 'needs_review' NOT NULL,
	"source_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "capability_requirements" ADD CONSTRAINT "capability_requirements_problem_id_problem_reports_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problem_reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "impact_measurements" ADD CONSTRAINT "impact_measurements_project_id_active_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."active_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "impact_measurements" ADD CONSTRAINT "impact_measurements_measured_by_users_id_fk" FOREIGN KEY ("measured_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "impact_verifications" ADD CONSTRAINT "impact_verifications_project_id_active_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."active_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "impact_verifications" ADD CONSTRAINT "impact_verifications_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institution_capabilities" ADD CONSTRAINT "institution_capabilities_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_endorsements" ADD CONSTRAINT "report_endorsements_report_id_problem_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."problem_reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_endorsements" ADD CONSTRAINT "report_endorsements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solution_memory" ADD CONSTRAINT "solution_memory_project_id_active_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."active_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solution_memory" ADD CONSTRAINT "solution_memory_problem_id_problem_reports_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problem_reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "report_endorsements_report_user_idx" ON "report_endorsements" USING btree ("report_id","user_id");