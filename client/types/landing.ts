export interface MetricStat {
  readonly label: string;
  readonly value: string;
  readonly unit?: string;
  readonly change?: string;
  readonly description: string;
}

export interface PipelineStage {
  readonly step: string;
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly provenanceTag: string;
}

export interface StakeholderRoleCard {
  readonly id: "citizen" | "government" | "institution" | "student" | "industry" | "admin";
  readonly title: string;
  readonly badge: string;
  readonly description: string;
  readonly ctaLabel: string;
  readonly href: string;
  readonly capabilities: readonly string[];
}

export interface UniversityMatchDemo {
  readonly institutionName: string;
  readonly district: string;
  readonly distanceKm: number;
  readonly matchedCapabilities: readonly string[];
  readonly capabilityFitPercentage: number;
  readonly verifiedSource: string;
}
