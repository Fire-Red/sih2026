CREATE TYPE "public"."report_category" AS ENUM('water_sanitation', 'agriculture_irrigation', 'rural_infrastructure', 'healthcare_nutrition', 'education_skills', 'environment_waste', 'energy_power', 'rural_livelihoods', 'accessibility_public_services');--> statement-breakpoint
CREATE TYPE "public"."report_severity" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('submitted', 'under_review', 'fused_clustered', 'validated', 'assigned_to_hei', 'solution_in_progress', 'resolved_deployed', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('citizen', 'government', 'institution', 'student', 'industry', 'admin');--> statement-breakpoint
CREATE TABLE "government_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"department" text NOT NULL,
	"designation" text NOT NULL,
	"jurisdiction" text,
	"employee_id" text,
	"official_email" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "industry_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"organization_name" text NOT NULL,
	"organization_type" text,
	"sector" text,
	"website" text,
	"csr_focus" text,
	"contact_person_designation" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "institution_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"institution_name" text NOT NULL,
	"aishe_code" text,
	"institution_type" text,
	"departments" text[],
	"website" text,
	"official_email" text,
	"accreditation_status" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "problem_evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"problem_report_id" uuid NOT NULL,
	"media_type" text NOT NULL,
	"media_url" text NOT NULL,
	"caption" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "problem_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporter_id" uuid,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" "report_category" NOT NULL,
	"subcategory" text,
	"severity" "report_severity" DEFAULT 'medium' NOT NULL,
	"affected_population_estimate" integer DEFAULT 100,
	"state" text DEFAULT 'Jharkhand' NOT NULL,
	"district" text,
	"block_or_panchayat" text,
	"pin_code" text,
	"latitude" text,
	"longitude" text,
	"formatted_address" text,
	"status" "report_status" DEFAULT 'submitted' NOT NULL,
	"endorsement_count" integer DEFAULT 0 NOT NULL,
	"assigned_institution_name" text,
	"assigned_project_title" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"institution_name" text NOT NULL,
	"aishe_code" text,
	"department" text NOT NULL,
	"year_of_study" integer,
	"enrollment_number" text,
	"skills" text[],
	"interests" text[],
	"portfolio_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firebase_uid" text NOT NULL,
	"email" text NOT NULL,
	"display_name" text,
	"role" "user_role" DEFAULT 'citizen' NOT NULL,
	"avatar_url" text,
	"phone" text,
	"state" text,
	"district" text,
	"pin_code" text,
	"latitude" text,
	"longitude" text,
	"formatted_address" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_onboarded" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_firebase_uid_unique" UNIQUE("firebase_uid"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "government_profiles" ADD CONSTRAINT "government_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "industry_profiles" ADD CONSTRAINT "industry_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institution_profiles" ADD CONSTRAINT "institution_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem_evidence" ADD CONSTRAINT "problem_evidence_problem_report_id_problem_reports_id_fk" FOREIGN KEY ("problem_report_id") REFERENCES "public"."problem_reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem_reports" ADD CONSTRAINT "problem_reports_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;