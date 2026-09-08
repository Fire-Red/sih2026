import { NextResponse } from "next/server";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  capabilityRequirements,
  institutionCapabilities,
  institutions,
  problemReports,
} from "@/lib/db/schema";
import { AuthorizationError, requireAuthenticatedUser } from "@/lib/auth/server";

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase();
}

function scoreDistance(distanceKm: number | null): number {
  if (distanceKm === null) return 0.5;
  return Math.max(0, Math.min(1, 1 - distanceKm / 250));
}

function distanceKm(
  firstLatitude: string | null,
  firstLongitude: string | null,
  secondLatitude: string | null,
  secondLongitude: string | null,
): number | null {
  const values = [firstLatitude, firstLongitude, secondLatitude, secondLongitude].map(Number);
  if (values.some((value) => !Number.isFinite(value))) return null;
  const [lat1, lon1, lat2, lon2] = values;
  const radius = 6371;
  const latitudeDelta = (lat2 - lat1) * Math.PI / 180;
  const longitudeDelta = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180)
    * Math.sin(longitudeDelta / 2) ** 2;
  return Math.round(radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 100) / 100;
}

export async function GET(request: Request) {
  try {
    const user = await requireAuthenticatedUser(request);
    if (!["government", "institution", "student", "admin"].includes(user.role)) {
      return NextResponse.json({ success: false, error: "Capability access is restricted." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get("problemId");
    if (!problemId) return NextResponse.json({ success: false, error: "problemId is required." }, { status: 400 });

    const [requirements, problem] = await Promise.all([
      db.select().from(capabilityRequirements).where(eq(capabilityRequirements.problemId, problemId)),
      db.select({ latitude: problemReports.latitude, longitude: problemReports.longitude })
        .from(problemReports)
        .where(eq(problemReports.id, problemId))
        .limit(1),
    ]);

    const required = requirements.map((requirement) => requirement.capability);
    if (required.length === 0) return NextResponse.json({ success: true, requirements: [], matches: [] });

    const capabilities = await db
      .select({ capability: institutionCapabilities, institution: institutions })
      .from(institutionCapabilities)
      .innerJoin(institutions, eq(institutionCapabilities.institutionId, institutions.id))
      .where(and(
        eq(institutionCapabilities.verificationStatus, "verified"),
        inArray(institutionCapabilities.capability, required),
      ));

    const byInstitution = new Map<string, { institution: typeof capabilities[number]["institution"]; matched: string[] }>();
    for (const row of capabilities) {
      const current = byInstitution.get(row.institution.id) ?? { institution: row.institution, matched: [] };
      if (!current.matched.some((item) => normalize(item) === normalize(row.capability.capability))) {
        current.matched.push(row.capability.capability);
      }
      byInstitution.set(row.institution.id, current);
    }

    const matches = [...byInstitution.values()].map(({ institution, matched }) => {
      const missing = required.filter((item) => !matched.some((candidate) => normalize(candidate) === normalize(item)));
      const capabilityFit = matched.length / required.length;
      const distance = distanceKm(problem[0]?.latitude ?? null, problem[0]?.longitude ?? null, institution.latitude, institution.longitude);
      const geographic = scoreDistance(distance);
      return {
        institution,
        matchedCapabilities: matched,
        missingCapabilities: missing,
        capabilityFit,
        geographicScore: geographic,
        institutionalScore: institution.verificationStatus === "verified" ? 1 : 0,
        overallScore: 0.4 * capabilityFit + 0.3 * geographic + 0.2 * 1 + 0.1 * 0,
        distanceKm: distance,
      };
    }).sort((first, second) => second.overallScore - first.overallScore);

    return NextResponse.json({ success: true, requirements, matches });
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json({ success: false, error: "Unable to calculate capability matches." }, { status: 500 });
  }
}
