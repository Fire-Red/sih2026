import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  pgEnum,
  jsonb,
  uniqueIndex,
  vector,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "citizen",
  "government",
  "institution",
  "student",
  "industry",
  "admin",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  role: userRoleEnum("role").default("citizen").notNull(),
  avatarUrl: text("avatar_url"),
  phone: text("phone"),
  state: text("state"),
  district: text("district"),
  pinCode: text("pin_code"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  formattedAddress: text("formatted_address"),
  isActive: boolean("is_active").default(true).notNull(),
  isOnboarded: boolean("is_onboarded").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const governmentProfiles = pgTable("government_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  department: text("department").notNull(),
  designation: text("designation").notNull(),
  jurisdiction: text("jurisdiction"),
  employeeId: text("employee_id"),
  officialEmail: text("official_email"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const studentProfiles = pgTable("student_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  institutionName: text("institution_name").notNull(),
  aisheCode: text("aishe_code"),
  department: text("department").notNull(),
  yearOfStudy: integer("year_of_study"),
  enrollmentNumber: text("enrollment_number"),
  skills: text("skills").array(),
  interests: text("interests").array(),
  portfolioUrl: text("portfolio_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const institutionProfiles = pgTable("institution_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  institutionName: text("institution_name").notNull(),
  aisheCode: text("aishe_code"),
  institutionType: text("institution_type"),
  departments: text("departments").array(),
  website: text("website"),
  officialEmail: text("official_email"),
  accreditationStatus: text("accreditation_status"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const industryProfiles = pgTable("industry_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  organizationName: text("organization_name").notNull(),
  organizationType: text("organization_type"),
  sector: text("sector"),
  website: text("website"),
  csrFocus: text("csr_focus"),
  contactPersonDesignation: text("contact_person_designation"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const reportCategoryEnum = pgEnum("report_category", [
  "water_sanitation",
  "agriculture_irrigation",
  "rural_infrastructure",
  "healthcare_nutrition",
  "education_skills",
  "environment_waste",
  "energy_power",
  "rural_livelihoods",
  "accessibility_public_services",
  "other",
]);

export const reportSeverityEnum = pgEnum("report_severity", [
  "low",
  "medium",
  "high",
  "critical",
]);

export const reportStatusEnum = pgEnum("report_status", [
  "submitted",
  "under_review",
  "fused_clustered",
  "validated",
  "assigned_to_hei",
  "solution_in_progress",
  "resolved_deployed",
  "rejected",
]);

export const applicationStatusEnum = pgEnum("application_status", [
  "submitted",
  "under_review",
  "shortlisted",
  "selected_winner",
  "rejected",
]);

export const reviewEventActionEnum = pgEnum("review_event_action", [
  "winner_selected",
]);

export const projectStatusEnum = pgEnum("project_status", [
  "active",
  "prototype",
  "pilot",
  "deployment",
  "completed",
  "blocked",
]);

export const verificationStatusEnum = pgEnum("verification_status", [
  "verified",
  "needs_review",
  "unverified",
  "conflict",
]);

export const similarReviewModeEnum = pgEnum("similar_review_mode", [
  "manual_review",
  "queue_high_confidence",
]);

export const measurementTypeEnum = pgEnum("measurement_type", [
  "baseline",
  "during_pilot",
  "post_intervention",
  "follow_up",
]);

export const impactVerificationTypeEnum = pgEnum("impact_verification_type", [
  "government",
  "community",
  "third_party",
]);

export const problemReports = pgTable("problem_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  reporterId: uuid("reporter_id").references(() => users.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: reportCategoryEnum("category").notNull(),
  subcategory: text("subcategory"),
  severity: reportSeverityEnum("severity").default("medium").notNull(),
  affectedPopulationEstimate: integer("affected_population_estimate").default(100),
  state: text("state").default("India").notNull(),
  district: text("district"),
  blockOrPanchayat: text("block_or_panchayat"),
  pinCode: text("pin_code"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  formattedAddress: text("formatted_address"),
  status: reportStatusEnum("status").default("submitted").notNull(),
  endorsementCount: integer("endorsement_count").default(0).notNull(),
  maxTeamsAllowed: integer("max_teams_allowed").default(3).notNull(),
  appliedTeamsCount: integer("applied_teams_count").default(0).notNull(),
  sponsoringDepartment: text("sponsoring_department"),
  grantAmount: text("grant_amount"),
  selectedTeamId: uuid("selected_team_id"),
  similarReviewMode: similarReviewModeEnum("similar_review_mode").default("manual_review").notNull(),
  assignedInstitutionName: text("assigned_institution_name"),
  assignedProjectTitle: text("assigned_project_title"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const problemEvidence = pgTable("problem_evidence", {
  id: uuid("id").defaultRandom().primaryKey(),
  problemReportId: uuid("problem_report_id")
    .references(() => problemReports.id, { onDelete: "cascade" })
    .notNull(),
  mediaType: text("media_type").notNull(),
  mediaUrl: text("media_url").notNull(),
  caption: text("caption"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const problemEmbeddings = pgTable("problem_embeddings", {
  id: uuid("id").defaultRandom().primaryKey(),
  problemReportId: uuid("problem_report_id")
    .references(() => problemReports.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  embedding: vector("embedding", { dimensions: 1024 }).notNull(),
  modelName: text("model_name").default("mistral-embed").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const problemRelationships = pgTable("problem_relationships", {
  id: uuid("id").defaultRandom().primaryKey(),
  reportId: uuid("report_id").references(() => problemReports.id, { onDelete: "cascade" }).notNull(),
  relatedReportId: uuid("related_report_id").references(() => problemReports.id, { onDelete: "cascade" }).notNull(),
  semanticSimilarity: text("semantic_similarity").notNull(),
  geographicDistanceKm: text("geographic_distance_km"),
  relationshipType: text("relationship_type").notNull(),
  confidenceLevel: text("confidence_level").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [uniqueIndex("problem_relationships_report_pair_idx").on(table.reportId, table.relatedReportId)]);

export const studentTeams = pgTable("student_teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  teamName: text("team_name").notNull(),
  leaderId: uuid("leader_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  institutionName: text("institution_name").notNull(),
  facultyMentorName: text("faculty_mentor_name"),
  members: jsonb("members"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const problemApplications = pgTable("problem_applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  problemId: uuid("problem_id")
    .references(() => problemReports.id, { onDelete: "cascade" })
    .notNull(),
  teamId: uuid("team_id")
    .references(() => studentTeams.id, { onDelete: "cascade" })
    .notNull(),
  applicantUserId: uuid("applicant_user_id").references(() => users.id, { onDelete: "set null" }),
  reviewedBy: uuid("reviewed_by").references(() => users.id, { onDelete: "set null" }),
  pitchSummary: text("pitch_summary").notNull(),
  videoUrl: text("video_url"),
  pptUrl: text("ppt_url"),
  repoUrl: text("repo_url"),
  status: applicationStatusEnum("status").default("submitted").notNull(),
  reviewNotes: text("review_notes"),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("problem_applications_problem_team_idx").on(table.problemId, table.teamId),
]);

export const activeProjects = pgTable("active_projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  problemId: uuid("problem_id")
    .references(() => problemReports.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  teamId: uuid("team_id")
    .references(() => studentTeams.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: projectStatusEnum("status").default("active").notNull(),
  milestones: jsonb("milestones"),
  pilotEvidence: jsonb("pilot_evidence"),
  startDate: timestamp("start_date", { withTimezone: true }).defaultNow().notNull(),
  targetEndDate: timestamp("target_end_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const governmentReviewEvents = pgTable("government_review_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  problemId: uuid("problem_id")
    .references(() => problemReports.id, { onDelete: "cascade" })
    .notNull(),
  applicationId: uuid("application_id")
    .references(() => problemApplications.id, { onDelete: "cascade" })
    .notNull(),
  reviewerId: uuid("reviewer_id").references(() => users.id, { onDelete: "set null" }),
  action: reviewEventActionEnum("action").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const reportEndorsements = pgTable("report_endorsements", {
  id: uuid("id").defaultRandom().primaryKey(),
  reportId: uuid("report_id")
    .references(() => problemReports.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [uniqueIndex("report_endorsements_report_user_idx").on(table.reportId, table.userId)]);

export const institutions = pgTable("institutions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  district: text("district"),
  address: text("address"),
  pinCode: text("pin_code"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  website: text("website"),
  sourceUrl: text("source_url"),
  sourceType: text("source_type"),
  retrievedAt: timestamp("retrieved_at", { withTimezone: true }),
  lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }),
  verificationStatus: verificationStatusEnum("verification_status").default("unverified").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const institutionCapabilities = pgTable("institution_capabilities", {
  id: uuid("id").defaultRandom().primaryKey(),
  institutionId: uuid("institution_id")
    .references(() => institutions.id, { onDelete: "cascade" })
    .notNull(),
  capability: text("capability").notNull(),
  department: text("department"),
  researchArea: text("research_area"),
  description: text("description"),
  sourceUrl: text("source_url"),
  sourceType: text("source_type"),
  lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }),
  verificationStatus: verificationStatusEnum("verification_status").default("needs_review").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const capabilityRequirements = pgTable("capability_requirements", {
  id: uuid("id").defaultRandom().primaryKey(),
  problemId: uuid("problem_id")
    .references(() => problemReports.id, { onDelete: "cascade" })
    .notNull(),
  capability: text("capability").notNull(),
  priority: text("priority").default("important").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const impactMeasurements = pgTable("impact_measurements", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .references(() => activeProjects.id, { onDelete: "cascade" })
    .notNull(),
  measurementType: measurementTypeEnum("measurement_type").notNull(),
  metricName: text("metric_name").notNull(),
  metricValue: text("metric_value"),
  metricUnit: text("metric_unit"),
  measuredAt: timestamp("measured_at", { withTimezone: true }).defaultNow().notNull(),
  measuredBy: uuid("measured_by").references(() => users.id, { onDelete: "set null" }),
  notes: text("notes"),
  evidenceUrl: text("evidence_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const impactVerifications = pgTable("impact_verifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .references(() => activeProjects.id, { onDelete: "cascade" })
    .notNull(),
  verifiedBy: uuid("verified_by")
    .references(() => users.id, { onDelete: "set null" })
    .notNull(),
  verificationType: impactVerificationTypeEnum("verification_type").notNull(),
  baselineSummary: text("baseline_summary"),
  outcomeSummary: text("outcome_summary"),
  isImpactVerified: boolean("is_impact_verified").default(false).notNull(),
  verificationNotes: text("verification_notes"),
  verifiedAt: timestamp("verified_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const solutionMemory = pgTable("solution_memory", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .references(() => activeProjects.id, { onDelete: "cascade" })
    .notNull(),
  problemId: uuid("problem_id")
    .references(() => problemReports.id, { onDelete: "cascade" })
    .notNull(),
  problemType: text("problem_type").notNull(),
  approach: text("approach").notNull(),
  requirements: text("requirements").array(),
  measuredResults: jsonb("measured_results"),
  constraints: jsonb("constraints"),
  verificationStatus: verificationStatusEnum("verification_status").default("needs_review").notNull(),
  sourceUrl: text("source_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type GovernmentProfile = typeof governmentProfiles.$inferSelect;
export type NewGovernmentProfile = typeof governmentProfiles.$inferInsert;
export type StudentProfile = typeof studentProfiles.$inferSelect;
export type NewStudentProfile = typeof studentProfiles.$inferInsert;
export type InstitutionProfile = typeof institutionProfiles.$inferSelect;
export type NewInstitutionProfile = typeof institutionProfiles.$inferInsert;
export type IndustryProfile = typeof industryProfiles.$inferSelect;
export type NewIndustryProfile = typeof industryProfiles.$inferInsert;
export type ProblemReport = typeof problemReports.$inferSelect;
export type NewProblemReport = typeof problemReports.$inferInsert;
export type ProblemEvidence = typeof problemEvidence.$inferSelect;
export type NewProblemEvidence = typeof problemEvidence.$inferInsert;
export type ProblemEmbedding = typeof problemEmbeddings.$inferSelect;
export type ProblemRelationship = typeof problemRelationships.$inferSelect;
export type StudentTeam = typeof studentTeams.$inferSelect;
export type NewStudentTeam = typeof studentTeams.$inferInsert;
export type ProblemApplication = typeof problemApplications.$inferSelect;
export type NewProblemApplication = typeof problemApplications.$inferInsert;
export type GovernmentReviewEvent = typeof governmentReviewEvents.$inferSelect;
export type NewGovernmentReviewEvent = typeof governmentReviewEvents.$inferInsert;
export type ActiveProject = typeof activeProjects.$inferSelect;
export type NewActiveProject = typeof activeProjects.$inferInsert;
export type ReportEndorsement = typeof reportEndorsements.$inferSelect;
export type Institution = typeof institutions.$inferSelect;
export type InstitutionCapability = typeof institutionCapabilities.$inferSelect;
export type CapabilityRequirement = typeof capabilityRequirements.$inferSelect;
export type ImpactMeasurement = typeof impactMeasurements.$inferSelect;
export type ImpactVerification = typeof impactVerifications.$inferSelect;
export type SolutionMemory = typeof solutionMemory.$inferSelect;
