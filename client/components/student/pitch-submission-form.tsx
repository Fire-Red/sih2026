"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { FileUp, Loader2, Send, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getValidAuthToken } from "@/lib/auth/session";

interface ProblemOption { id: string; title: string; district: string | null }
interface TeamOption { id: string; teamName: string; institutionName: string }
interface UploadAuth { success?: boolean; token?: string; expire?: number; signature?: string; publicKey?: string; error?: string }
interface UploadResult { url?: string; fileType?: string; name?: string; message?: string }

async function uploadFile(file: File, folder: string): Promise<string> {
  const authResponse = await fetch("/api/uploads/imagekit-auth");
  const auth = (await authResponse.json()) as UploadAuth;
  if (!authResponse.ok || !auth.success || !auth.token || !auth.expire || !auth.signature || !auth.publicKey) {
    throw new Error(auth.error ?? "File uploads are not configured.");
  }
  const body = new FormData();
  body.append("file", file);
  body.append("fileName", file.name);
  body.append("folder", folder);
  body.append("publicKey", auth.publicKey);
  body.append("token", auth.token);
  body.append("expire", String(auth.expire));
  body.append("signature", auth.signature);
  const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", { method: "POST", body });
  const result = (await response.json()) as UploadResult;
  if (!response.ok || !result.url) throw new Error(result.message ?? "The file could not be uploaded.");
  return result.url;
}

export function PitchSubmissionForm() {
  const [problems, setProblems] = useState<ProblemOption[]>([]);
  const [teams, setTeams] = useState<TeamOption[]>([]);
  const [problemId, setProblemId] = useState("");
  const [teamId, setTeamId] = useState("");
  const [pitchSummary, setPitchSummary] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pptUrl, setPptUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const token = await getValidAuthToken();
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
      const [problemResponse, teamResponse] = await Promise.all([fetch("/api/problems?status=validated", { headers }), fetch("/api/teams", { headers })]);
      const problemData = (await problemResponse.json()) as { problems?: ProblemOption[] };
      const teamData = (await teamResponse.json()) as { teams?: TeamOption[] };
      setProblems(problemData.problems ?? []);
      setTeams(teamData.teams ?? []);
    };
    void load();
  }, []);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>, field: "video" | "ppt") => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const limit = field === "video" ? 100 * 1024 * 1024 : 20 * 1024 * 1024;
    if (file.size > limit) { setError(`Choose a ${field === "video" ? "video" : "document"} within the upload limit.`); return; }
    setUploading(field); setError("");
    try {
      const url = await uploadFile(file, "/civicpulse/pitches");
      if (field === "video") setVideoUrl(url); else setPptUrl(url);
    } catch (uploadError: unknown) { setError(uploadError instanceof Error ? uploadError.message : "The file could not be uploaded."); }
    finally { setUploading(null); }
  };

  const submit = async () => {
    if (!problemId || !teamId || !pitchSummary.trim()) { setError("Choose a challenge, team, and describe your approach."); return; }
    setSaving(true); setError(""); setMessage("");
    try {
      const token = await getValidAuthToken();
      const response = await fetch("/api/applications", { method: "POST", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ problemId, teamId, pitchSummary: pitchSummary.trim(), videoUrl: videoUrl || null, pptUrl: pptUrl || null, repoUrl: repoUrl || null }) });
      const data = (await response.json()) as { success?: boolean; error?: string };
      if (!response.ok || !data.success) throw new Error(data.error ?? "The pitch could not be submitted.");
      setMessage("Pitch submitted for government review."); setPitchSummary(""); setVideoUrl(""); setPptUrl(""); setRepoUrl("");
    } catch (submitError: unknown) { setError(submitError instanceof Error ? submitError.message : "The pitch could not be submitted."); }
    finally { setSaving(false); }
  };

  return <section className="max-w-3xl space-y-6">
    <header><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">Submit a proposal</p><h1 className="mt-2 text-3xl font-medium tracking-[-0.04em] text-foreground">Add your team’s approach</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Choose a validated problem and share a short written approach with supporting files.</p></header>
    <div className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
      <label className="space-y-2 text-xs font-medium text-foreground"><span>Problem</span><select value={problemId} onChange={(event) => setProblemId(event.target.value)} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal"><option value="">Select a problem</option>{problems.map((problem) => <option key={problem.id} value={problem.id}>{problem.title}</option>)}</select></label>
      <label className="space-y-2 text-xs font-medium text-foreground"><span>Team</span><select value={teamId} onChange={(event) => setTeamId(event.target.value)} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal"><option value="">Select your team</option>{teams.map((team) => <option key={team.id} value={team.id}>{team.teamName} · {team.institutionName}</option>)}</select></label>
      <label className="space-y-2 text-xs font-medium text-foreground sm:col-span-2"><span>Approach summary</span><Textarea value={pitchSummary} onChange={(event) => setPitchSummary(event.target.value)} placeholder="What will your team build, test, or measure?" className="min-h-32 rounded-xl bg-background text-sm" /></label>
      <div className="space-y-2"><span className="text-xs font-medium text-foreground">Pitch video</span><label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border px-3 text-xs text-muted-foreground hover:border-primary/50"><Video className="h-4 w-4 text-primary" />{uploading === "video" ? "Uploading video..." : videoUrl ? "Video uploaded" : "Upload up to 100 MB"}<input type="file" accept="video/*" onChange={(event) => void handleUpload(event, "video")} className="sr-only" disabled={Boolean(uploading)} /></label><Input value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} placeholder="Or paste a video link" className="h-10 rounded-xl bg-background text-xs" /></div>
      <div className="space-y-2"><span className="text-xs font-medium text-foreground">Slide deck</span><label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border px-3 text-xs text-muted-foreground hover:border-primary/50"><FileUp className="h-4 w-4 text-primary" />{uploading === "ppt" ? "Uploading deck..." : pptUrl ? "Deck uploaded" : "Upload PDF or PPT"}<input type="file" accept=".pdf,.ppt,.pptx" onChange={(event) => void handleUpload(event, "ppt")} className="sr-only" disabled={Boolean(uploading)} /></label><Input value={pptUrl} onChange={(event) => setPptUrl(event.target.value)} placeholder="Or paste a deck link" className="h-10 rounded-xl bg-background text-xs" /></div>
      <label className="space-y-2 text-xs font-medium text-foreground sm:col-span-2"><span>Source code link <span className="font-normal text-muted-foreground">(optional)</span></span><Input value={repoUrl} onChange={(event) => setRepoUrl(event.target.value)} placeholder="https://github.com/..." className="h-11 rounded-xl bg-background text-sm" /></label>
    </div>
    {error && <p role="alert" className="rounded-xl border border-destructive/25 bg-destructive/5 p-3 text-xs text-destructive">{error}</p>}
    {message && <p role="status" className="rounded-xl border border-success/25 bg-success-soft p-3 text-xs text-success">{message}</p>}
    <Button type="button" onClick={() => void submit()} disabled={saving || Boolean(uploading)} className="gap-2 rounded-xl">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} {saving ? "Submitting" : "Submit pitch"}</Button>
  </section>;
}
