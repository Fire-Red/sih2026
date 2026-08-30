CREATE TYPE "public"."similar_review_mode" AS ENUM('manual_review', 'queue_high_confidence');--> statement-breakpoint
CREATE TABLE "problem_embeddings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"problem_report_id" uuid NOT NULL,
	"embedding" vector(1024) NOT NULL,
	"model_name" text DEFAULT 'mistral-embed' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "problem_embeddings_problem_report_id_unique" UNIQUE("problem_report_id")
);
--> statement-breakpoint
CREATE TABLE "problem_relationships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"related_report_id" uuid NOT NULL,
	"semantic_similarity" text NOT NULL,
	"geographic_distance_km" text,
	"relationship_type" text NOT NULL,
	"confidence_level" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "problem_reports" ADD COLUMN "similar_review_mode" "similar_review_mode" DEFAULT 'manual_review' NOT NULL;--> statement-breakpoint
ALTER TABLE "problem_embeddings" ADD CONSTRAINT "problem_embeddings_problem_report_id_problem_reports_id_fk" FOREIGN KEY ("problem_report_id") REFERENCES "public"."problem_reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem_relationships" ADD CONSTRAINT "problem_relationships_report_id_problem_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."problem_reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem_relationships" ADD CONSTRAINT "problem_relationships_related_report_id_problem_reports_id_fk" FOREIGN KEY ("related_report_id") REFERENCES "public"."problem_reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "problem_relationships_report_pair_idx" ON "problem_relationships" USING btree ("report_id","related_report_id");