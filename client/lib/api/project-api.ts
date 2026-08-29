import { getSession } from "@/lib/auth/session";
import type { ProjectDetail } from "@/types/project-detail";

interface ProjectResponse { success: true; };

export async function getProjectDetail(projectId: string): Promise<ProjectDetail> {
  const session = getSession();
  const response = await fetch(`/api/projects/${projectId}`, {
    headers: session?.token ? { Authorization: `Bearer ${session.token}` } : {},
  });
  const payload = (await response.json()) as ProjectResponse & Partial<ProjectDetail> & { error?: string };
  if (!response.ok || !payload.success || !payload.project || !payload.problem || !payload.team) {
    throw new Error(payload.error || "Unable to load this project.");
  }
  return payload as ProjectDetail;
}
