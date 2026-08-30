"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, MapPin, ExternalLink } from "lucide-react";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { REPORT_CATEGORIES } from "@/lib/constants/report-categories";
import { getSession } from "@/lib/auth/session";

interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string | null;
  severity: string;
  district: string | null;
  blockOrPanchayat: string | null;
  pinCode: string | null;
  formattedAddress: string | null;
  latitude: string | null;
  longitude: string | null;
  status: string;
  endorsementCount: number;
  appliedTeamsCount: number;
  maxTeamsAllowed: number;
  sponsoringDepartment: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Evidence {
  id: string;
  mediaType: string;
  mediaUrl: string;
  caption: string | null;
}

interface DetailResponse {
  success?: boolean;
  problem?: Problem;
  evidence?: Evidence[];
  error?: string;
}

const statuses = [
  "submitted",
  "under_review",
  "fused_clustered",
  "validated",
  "assigned_to_hei",
  "solution_in_progress",
  "resolved_deployed",
];

const statusLabels: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  fused_clustered: "Clustering",
  validated: "Validated",
  assigned_to_hei: "Team assigned",
  solution_in_progress: "In progress",
  resolved_deployed: "Outcome recorded",
  rejected: "Closed",
};

const categoryName = (value: string) =>
  REPORT_CATEGORIES.find((item) => item.id === value)?.name ??
  value.replaceAll("_", " ");

export default function ProblemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<DetailResponse>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    void fetch(`/api/problems/${id}`, {
      headers: session?.token ? { Authorization: `Bearer ${session.token}` } : {},
    })
      .then(async (response) => {
        const result = (await response.json()) as DetailResponse;
        setData(result);
      })
      .catch(() => setData({ error: "Unable to load this problem." }))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <LandingNav />
        <main className="flex-1 pt-14">
          <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:py-10">
            <div className="flex items-center justify-center gap-2 py-20 text-xs text-neutral-400">
              <Loader2 className="h-4 w-4 animate-spin text-neutral-900" />
              Loading problem details...
            </div>
          </div>
        </main>
        <LandingFooter />
      </div>
    );
  }

  if (!data.success || !data.problem) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <LandingNav />
        <main className="flex-1 pt-14">
          <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:py-10">
            <div className="py-16 text-center">
              <p className="text-xs text-rose-600">{data.error ?? "Problem not found."}</p>
              <Link href="/problems" className="mt-4 inline-block">
                <Button variant="outline" size="sm">Back to problems</Button>
              </Link>
            </div>
          </div>
        </main>
        <LandingFooter />
      </div>
    );
  }

  const { problem, evidence = [] } = data;
  const currentStatus = statuses.indexOf(problem.status);
  const place = [problem.formattedAddress, problem.blockOrPanchayat, problem.district, problem.pinCode]
    .filter(Boolean)
    .join(", ");
  const isImage = (item: Evidence) => item.mediaType.startsWith("image/") || item.mediaType === "image";

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <LandingNav />
      <main className="flex-1 pt-14">
        <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:py-10 space-y-8">
          <Link
            href="/problems"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All problem statements
          </Link>

          <header className="border-b border-neutral-200/80 pb-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{categoryName(problem.category)}</Badge>
              <Badge variant="secondary">{statusLabels[problem.status] ?? problem.status}</Badge>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
              {problem.title}
            </h1>
            <p className="mt-3 text-sm text-neutral-600 max-w-3xl leading-relaxed whitespace-pre-wrap">
              {problem.description}
            </p>
            <p className="mt-4 text-xs text-neutral-400">
              Updated {new Date(problem.updatedAt).toLocaleDateString()} • Reported {new Date(problem.createdAt).toLocaleDateString()}
            </p>
          </header>

          <section className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <section className="space-y-2">
                <h2 className="text-xs font-semibold text-neutral-900">Confirmed metadata</h2>
                <dl className="divide-y divide-neutral-100 rounded-xl border border-neutral-200/80 bg-white">
                  <div className="flex justify-between p-3 text-xs">
                    <dt className="text-neutral-500">Category</dt>
                    <dd className="text-neutral-900 font-medium">
                      {categoryName(problem.category)}{problem.subcategory ? `, ${problem.subcategory}` : ""}
                    </dd>
                  </div>
                  <div className="flex justify-between p-3 text-xs">
                    <dt className="text-neutral-500">Severity level</dt>
                    <dd className="text-neutral-900 font-medium capitalize">{problem.severity}</dd>
                  </div>
                  <div className="flex justify-between p-3 text-xs">
                    <dt className="text-neutral-500">Endorsements</dt>
                    <dd className="text-neutral-900 font-medium">{problem.endorsementCount} supporting reports</dd>
                  </div>
                </dl>
              </section>

              <section className="space-y-2">
                <h2 className="text-xs font-semibold text-neutral-900">Location context</h2>
                <div className="rounded-xl border border-neutral-200/80 bg-white p-4 space-y-2">
                  {place ? (
                    <p className="flex items-start gap-2 text-xs text-neutral-700 leading-relaxed">
                      <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-neutral-900" />
                      {place}
                    </p>
                  ) : (
                    <p className="text-xs text-neutral-400">Location not specified.</p>
                  )}
                  {problem.latitude && problem.longitude && (
                    <p className="text-xs text-neutral-400 font-mono pt-2 border-t border-neutral-100">
                      Coordinates: {problem.latitude}, {problem.longitude}
                    </p>
                  )}
                </div>
              </section>

              <section className="space-y-2">
                <h2 className="text-xs font-semibold text-neutral-900">Submitted evidence</h2>
                {evidence.length === 0 ? (
                  <p className="text-xs text-neutral-400 p-4 rounded-xl border border-neutral-200/80 bg-white">
                    No attachments provided with this report.
                  </p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {evidence.map((item) => (
                      <div key={item.id} className="overflow-hidden rounded-xl border border-neutral-200/80 bg-white">
                        {isImage(item) && (
                          <img src={item.mediaUrl} alt={item.caption ?? "Attached evidence"} className="aspect-video w-full object-cover" />
                        )}
                        <div className="flex items-center justify-between p-3">
                          <div className="min-w-0 pr-2">
                            <p className="truncate text-xs font-medium text-neutral-900">{item.caption ?? "Attachment"}</p>
                            <p className="text-[11px] text-neutral-400">{isImage(item) ? "Photo evidence" : "Document"}</p>
                          </div>
                          <a href={item.mediaUrl} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-neutral-900">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <aside className="space-y-4">
              <section className="rounded-xl border border-neutral-200/80 bg-white p-4 space-y-3">
                <h2 className="text-xs font-semibold text-neutral-900">Resolution lifecycle</h2>
                <ol className="space-y-2.5">
                  {statuses.map((status, index) => (
                    <li key={status} className="flex items-center gap-2.5 text-xs">
                      <span className={`h-2 w-2 rounded-full shrink-0 ${index <= currentStatus ? "bg-neutral-900" : "bg-neutral-200"}`} />
                      <span className={index <= currentStatus ? "text-neutral-900 font-medium" : "text-neutral-400"}>
                        {statusLabels[status]}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-4 space-y-1">
                <p className="text-xs text-neutral-500">Student team slots</p>
                <p className="text-xl font-semibold text-neutral-900">
                  {problem.appliedTeamsCount} of {problem.maxTeamsAllowed} filled
                </p>
                <p className="text-[11px] text-neutral-400">
                  Maximum 3 teams quota enforced per problem statement.
                </p>
              </section>
            </aside>
          </section>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
