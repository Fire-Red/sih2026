"use client";

import type { ChangeEvent, ReactNode } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, FileText, ImagePlus, Loader2, Paperclip, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocationPickerMap, type LocationAddress } from "@/components/maps/location-picker-map";
import { LOCAL_DISTRICTS, REPORT_CATEGORIES } from "@/lib/constants/report-categories";
import { getSession } from "@/lib/auth/session";
import { useUserStore } from "@/store/use-user-store";

type Severity = "" | "low" | "medium" | "high" | "critical";
interface Evidence { mediaUrl: string; caption: string; mediaType: string; }
interface ReportForm { category: string; subcategory: string; title: string; description: string; severity: Severity; affectedPopulationEstimate: string; state: string; district: string; blockOrPanchayat: string; pinCode: string; latitude: string; longitude: string; formattedAddress: string; evidence: Evidence[]; }
interface UploadAuth { success?: boolean; error?: string; token?: string; expire?: number; signature?: string; publicKey?: string; }
interface UploadResult { url?: string; fileType?: string; name?: string; message?: string; }

const quickTypes = [
  { label: "Road or transport", category: "rural_infrastructure" },
  { label: "Water or sanitation", category: "water_sanitation" },
  { label: "Health or education", category: "healthcare_nutrition" },
  { label: "Something else", category: "other" },
];

function Field({ label, optional, children }: { label: string; optional?: boolean; children: ReactNode }) {
  return (
    <label className="block space-y-1.5 text-xs font-medium text-neutral-900">
      <span>{label} {optional && <span className="font-normal text-neutral-400">Optional</span>}</span>
      {children}
    </label>
  );
}

export function CitizenReportWizard() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [form, setForm] = useState<ReportForm>({ category: "water_sanitation", subcategory: REPORT_CATEGORIES[0].subcategories[0] ?? "", title: "", description: "", severity: "", affectedPopulationEstimate: "", state: "", district: user?.geoContext?.district ?? "", blockOrPanchayat: "", pinCode: "", latitude: "", longitude: "", formattedAddress: "", evidence: [] });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [link, setLink] = useState("");
  const [caption, setCaption] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const update = <K extends keyof ReportForm>(key: K, value: ReportForm[K]) => setForm((current) => ({ ...current, [key]: value }));
  const chooseCategory = (value: string) => { const next = REPORT_CATEGORIES.find((item) => item.id === value) ?? REPORT_CATEGORIES[0]; setForm((current) => ({ ...current, category: value, subcategory: next.subcategories[0] ?? "" })); };

  const selectLocation = (latitude: string, longitude: string, address?: string, details?: LocationAddress) => { const name = details?.state_district ?? details?.county ?? details?.city ?? details?.town ?? ""; const district = LOCAL_DISTRICTS.find((item) => name.toLowerCase().includes(item.toLowerCase())) ?? name; setForm((current) => ({ ...current, latitude, longitude, state: details?.state ?? current.state, district: district || current.district, blockOrPanchayat: details?.village ?? details?.suburb ?? current.blockOrPanchayat, pinCode: details?.postcode ?? current.pinCode, formattedAddress: address ?? current.formattedAddress })); };

  const addLink = () => {
    const trimmed = link.trim();
    if (!trimmed) return;
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        setError("Please enter a valid web link starting with http:// or https://");
        return;
      }
    } catch {
      setError("Please enter a valid web link starting with http:// or https://");
      return;
    }
    setError("");
    update("evidence", [
      ...form.evidence,
      { mediaUrl: trimmed, caption: caption.trim() || "Supporting evidence", mediaType: "link" },
    ]);
    setLink("");
    setCaption("");
  };
  const upload = async (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; event.target.value = ""; if (!file) return; if (file.size > 5 * 1024 * 1024) { setError("Choose a file smaller than 5 MB."); return; } setUploading(true); setError(""); try { const authResponse = await fetch("/api/uploads/imagekit-auth"); const auth = (await authResponse.json()) as UploadAuth; if (!authResponse.ok || !auth.success || !auth.token || !auth.expire || !auth.signature || !auth.publicKey) throw new Error(auth.error ?? "File uploads are not configured yet."); const body = new FormData(); body.append("file", file); body.append("fileName", file.name); body.append("folder", "/civicpulse/evidence"); body.append("publicKey", auth.publicKey); body.append("token", auth.token); body.append("expire", String(auth.expire)); body.append("signature", auth.signature); const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", { method: "POST", body }); const result = (await response.json()) as UploadResult; if (!response.ok || !result.url) throw new Error(result.message ?? "We could not upload that file."); update("evidence", [...form.evidence, { mediaUrl: result.url, caption: caption.trim() || result.name || file.name, mediaType: result.fileType || file.type || "file" }]); setCaption(""); } catch (uploadError: unknown) { setError(uploadError instanceof Error ? uploadError.message : "We could not upload that file."); } finally { setUploading(false); } };
  const submit = async () => { if (!form.title.trim() || !form.description.trim()) { setError("Add a title and description of the issue."); return; } setSubmitting(true); setError(""); try { const session = getSession(); const response = await fetch("/api/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reporterId: user?.id || session?.id || null, ...form, state: form.state || undefined, severity: form.severity || undefined, affectedPopulationEstimate: form.affectedPopulationEstimate || undefined }) }); const result = (await response.json()) as { success?: boolean; error?: string; report?: { id: string } }; if (!response.ok || !result.success || !result.report) throw new Error(result.error ?? "Unable to submit report."); setSuccess(result.report.id); } catch (submitError: unknown) { setError(submitError instanceof Error ? submitError.message : "Unable to submit report."); } finally { setSubmitting(false); } };

  if (success) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center space-y-4">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Report submitted</h1>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
          Your report is in queue for official review. Follow progress from your activity feed.
        </p>
        <p className="text-xs font-mono text-neutral-400">Reference #{success.slice(0, 8)}</p>
        <div className="pt-4 flex justify-center gap-3">
          <Button onClick={() => router.push("/activity")} className="bg-neutral-900 text-white">View activity</Button>
          <Button variant="outline" onClick={() => window.location.reload()}>Report another</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-10 space-y-8">
        {error && (
          <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <header className="border-b border-neutral-100 pb-6">
          <p className="text-xs font-medium text-neutral-500 mb-1">Citizen intake</p>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">Report a community issue</h1>
          <p className="mt-1 text-xs text-neutral-500">Provide clear details. You can update or attach more context later.</p>
        </header>

        <div className="space-y-6">
          <Section title="Problem details">
            <Field label="Title">
              <Input autoFocus value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Broken water pipeline on Main Road" className="h-10 text-xs" />
            </Field>
            <Field label="Description">
              <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} placeholder="Describe what you observed, when it occurred, and who is affected..." className="flex w-full resize-y rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs leading-relaxed text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900" />
            </Field>
          </Section>

          <Section title="Category topic">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {quickTypes.map((item) => (
                <button key={item.category} type="button" onClick={() => chooseCategory(item.category)} className={`rounded-xl border p-3 text-left text-xs font-medium transition-colors ${form.category === item.category ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"}`}>
                  {item.label}
                </button>
              ))}
            </div>
            <details className="mt-2 text-xs">
              <summary className="cursor-pointer text-neutral-500 hover:text-neutral-900">Show all topics</summary>
              <select value={form.category} onChange={(e) => chooseCategory(e.target.value)} className="mt-2 flex h-9 w-full rounded-lg border border-neutral-200 bg-white px-2.5 text-xs text-neutral-800">
                {REPORT_CATEGORIES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </details>
          </Section>

          <details className="group rounded-xl border border-neutral-200/80 bg-neutral-50/30">
            <summary className="cursor-pointer list-none p-4 text-xs font-medium text-neutral-900 flex justify-between items-center">
              <span>Location context <span className="font-normal text-neutral-400 ml-1">Optional</span></span>
              <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="border-t border-neutral-200/80 p-4 space-y-4 bg-white rounded-b-xl">
              <LocationPickerMap latitude={form.latitude} longitude={form.longitude} onLocationSelect={selectLocation} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="District" optional>
                  <select value={form.district} onChange={(e) => update("district", e.target.value)} className="flex h-9 w-full rounded-lg border border-neutral-200 bg-white px-2.5 text-xs text-neutral-800">
                    <option value="">Select district</option>
                    {LOCAL_DISTRICTS.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </Field>
                <Field label="Nearby landmark" optional>
                  <Input value={form.blockOrPanchayat} onChange={(e) => update("blockOrPanchayat", e.target.value)} placeholder="Village, ward, or landmark" className="h-9 text-xs" />
                </Field>
              </div>
            </div>
          </details>

          <details className="group rounded-xl border border-neutral-200/80 bg-neutral-50/30">
            <summary className="cursor-pointer list-none p-4 text-xs font-medium text-neutral-900 flex justify-between items-center">
              <span>Evidence & attachments <span className="font-normal text-neutral-400 ml-1">Optional</span></span>
              <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="border-t border-neutral-200/80 p-4 space-y-4 bg-white rounded-b-xl">
              <label htmlFor="report-evidence" className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50/50 p-4 text-center hover:bg-neutral-50 transition-colors">
                <ImagePlus className="h-5 w-5 text-neutral-500" />
                <span className="mt-1.5 text-xs font-medium text-neutral-900">Upload photo or document</span>
                <span className="text-[11px] text-neutral-400">Up to 5 MB (PNG, JPG, PDF)</span>
                <input id="report-evidence" type="file" accept="image/*,.pdf,.doc,.docx" onChange={upload} disabled={uploading} className="sr-only" />
                {uploading && <span className="mt-2 flex items-center gap-1.5 text-xs text-neutral-600"><Loader2 className="h-3 w-3 animate-spin" /> Uploading...</span>}
              </label>

              <div className="flex gap-2">
                <Input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Or paste external document link..." className="h-9 text-xs" />
                <Button type="button" variant="outline" size="sm" onClick={addLink} disabled={!link.trim()} className="h-9 text-xs">
                  <Paperclip className="h-3.5 w-3.5 mr-1" /> Add
                </Button>
              </div>

              {form.evidence.length > 0 && (
                <div className="space-y-2 pt-2">
                  {form.evidence.map((item, index) => (
                    <div key={`${item.mediaUrl}-${index}`} className="flex items-center justify-between rounded-lg border border-neutral-200 p-2.5 text-xs">
                      <span className="flex items-center gap-2 truncate pr-2 text-neutral-800">
                        <FileText className="h-3.5 w-3.5 shrink-0 text-neutral-500" />
                        <span className="truncate">{item.caption}</span>
                      </span>
                      <Button type="button" variant="ghost" size="icon" onClick={() => update("evidence", form.evidence.filter((_, itemIndex) => itemIndex !== index))} className="h-6 w-6">
                        <Trash2 className="h-3.5 w-3.5 text-neutral-400 hover:text-rose-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </details>
        </div>

        <div className="flex items-center justify-between border-t border-neutral-100 pt-6">
          <p className="text-xs text-neutral-400">Your report will be publicly tracked.</p>
          <Button type="button" onClick={() => void submit()} disabled={submitting || uploading} className="bg-neutral-900 text-white hover:bg-neutral-800 gap-1.5">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {submitting ? "Submitting..." : "Submit report"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold text-neutral-900">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
