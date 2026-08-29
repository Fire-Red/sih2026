"use client";

import { use } from "react";
import { ProjectWorkspace } from "@/components/projects/project-workspace";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectPage({ params }: PageProps) {
  const { id } = use(params);
  return <ProjectWorkspace projectId={id} />;
}
