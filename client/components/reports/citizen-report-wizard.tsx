"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/use-user-store";
import { getSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LOCAL_DISTRICTS, REPORT_CATEGORIES } from "@/lib/constants/report-categories";
import { AlertCircle, ArrowLeft, ArrowRight, Check, CheckCircle2, Droplets, FileText, HeartPulse, ImagePlus, Leaf, Lightbulb, Loader2, MapPin, Paperclip, Sprout, Trash2, Truck, Zap } from "lucide-react";

type Severity = "" | "low" | "medium" | "high" | "critical";
interface EvidenceItem { mediaUrl: string; caption: string; mediaType: string; }
interface ReportForm {
  category: string; subcategory: string; title: string; description: string; severity: Severity;
  affectedPopulationEstimate: string; state: string; district: string; blockOrPanchayat: string;
  pinCode: string; latitude: string; longitude: string; formattedAddress: string; evidence: EvidenceItem[];
}

const steps = ["Issue", "Location", "Evidence", "Review"];

function CategoryIcon({ category }: { category: string }) {
  const props = { className: "h-4 w-4" };
  if (category.includes("water")) return <Droplets {...props} />;
  if (category.includes("agriculture")) return <Sprout {...props} />;
  if (category.includes("infrastructure")) return <Truck {...props} />;
  if (category.includes("healthcare")) return <HeartPulse {...props} />;
  if (category.includes("environment")) return <Leaf {...props} />;
  if (category.includes("energy")) return <Zap {...props} />;
  return <FileText {...props} />;
}

export function CitizenReportWizard() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [evidenceCaption, setEvidenceCaption] = useState("");
  const [uploadingEvidence, setUploadingEvidence] = useState(false);
  const [form, setForm] = useState<ReportForm>({
    category: "water_sanitation", subcategory: REPORT_CATEGORIES[0].subcategories[0] ?? "", title: "", description: "", severity: "", affectedPopulationEstimate: "", state: "", district: user?.geoContext?.district ?? "", blockOrPanchayat: "", pinCode: "", latitude: "", longitude: "", formattedAddress: "", evidence: [],
  });
  const activeCategory = REPORT_CATEGORIES.find((item) => item.id === form.category) ?? REPORT_CATEGORIES[0];
  const update = <K extends keyof ReportForm>(field: K, value: ReportForm[K]) => setForm((current) => ({ ...current, [field]: value }));

  const captureLocation = () => {
    if (!navigator.geolocation) { setError("Location detection is not available in this browser."); return; }
    setLocating(true); setError("");
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const latitude = coords.latitude.toFixed(6); const longitude = coords.longitude.toFixed(6);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data: { display_name?: string; address?: Record<string, string> } = await response.json();
        const address = data.address ?? {}; const districtName = address.state_district ?? address.county ?? address.city ?? "";
        const district = LOCAL_DISTRICTS.find((item) => districtName.toLowerCase().includes(item.toLowerCase())) ?? districtName;
        setForm((current) => ({ ...current, latitude, longitude, state: address.state ?? current.state, district, pinCode: address.postcode ?? current.pinCode, blockOrPanchayat: address.village ?? address.suburb ?? current.blockOrPanchayat, formattedAddress: data.display_name ?? `Coordinates: ${latitude}, ${longitude}` }));
      } catch { setForm((current) => ({ ...current, latitude, longitude })); } finally { setLocating(false); }
    }, (locationError) => { setLocating(false); setError(`Unable to detect location: ${locationError.message}`); }, { timeout: 10000 });
  };

  const addEvidence = () => {
    if (!evidenceUrl.trim()) return;
    update("evidence", [...form.evidence, { mediaUrl: evidenceUrl.trim(), caption: evidenceCaption.trim() || "Supporting evidence", mediaType: "image" }]);
    setEvidenceUrl(""); setEvidenceCaption("");
  };

  const addEvidenceFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("That file is larger than 5 MB. Choose a smaller image or document.");
      return;
    }
    setUploadingEvidence(true);
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setError("We could not read that file. Try choosing it again.");
      } else {
        const resultUrl = reader.result;
        const caption = evidenceCaption.trim() || file.name;
        const mediaType = file.type || "file";
        setForm((current) => ({
          ...current,
          evidence: [...current.evidence, { mediaUrl: resultUrl, caption, mediaType }],
        }));
        setEvidenceCaption("");
      }
      setUploadingEvidence(false);
    };
    reader.onerror = () => {
      setError("We could not read that file. Try choosing it again.");
      setUploadingEvidence(false);
    };
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    setSubmitting(true); setError("");
    try {
      const activeSession = getSession();
      const currentReporterId = user?.id || activeSession?.id || null;
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reporterId: currentReporterId,
          ...form,
          state: form.state || undefined,
          severity: form.severity || undefined,
          affectedPopulationEstimate: form.affectedPopulationEstimate || undefined,
        }),
      });
      const data: { success?: boolean; error?: string; report?: { id: string } } = await response.json();
      if (!response.ok || !data.success || !data.report) throw new Error(data.error ?? "Unable to submit report.");
      router.push(`/track?submitted=${data.report.id}`);
    } catch (submissionError: unknown) { setError(submissionError instanceof Error ? submissionError.message : "Unable to submit report."); setSubmitting(false); }
  };

  const next = () => {
    if (step === 1 && (!form.title.trim() || !form.description.trim())) {
      setError("Add a short title and describe what is happening.");
      return;
    }
    if (step === 2 && !form.district.trim()) {
      setError("Please select or specify a district for the report.");
      return;
    }
    setError("");
    setStep((current) => Math.min(4, current + 1));
  };

  return <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 lg:py-12">
    <header className="mb-8 max-w-2xl"><p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">New report</p><h1 className="text-3xl font-medium tracking-[-0.05em] text-foreground sm:text-4xl">Tell us what needs attention.</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Start with the issue. You can add a location and evidence next.</p></header>
    <div className="grid gap-8 lg:grid-cols-[180px_minmax(0,1fr)]">
      <nav aria-label="Report progress" className="lg:pt-2"><ol className="grid grid-cols-4 gap-2 lg:block lg:space-y-4">{steps.map((label, index) => { const number = index + 1; return <li key={label} className={`flex items-center gap-2 text-xs ${step >= number ? "text-foreground" : "text-muted-foreground"}`}><span className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] ${step > number ? "border-primary bg-primary text-primary-foreground" : step === number ? "border-primary text-primary" : "border-border"}`}>{step > number ? <Check className="h-3.5 w-3.5" /> : number}</span><span className="hidden sm:inline lg:inline">{label}</span></li>; })}</ol></nav>
      <section className="min-w-0 rounded-2xl border border-border bg-card p-5 sm:p-8">
        {error && <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
        {step === 1 && <div className="space-y-8"><div><h2 className="text-xl font-medium tracking-[-0.03em] text-foreground">What is the issue?</h2><p className="mt-1 text-sm text-muted-foreground">Choose the closest topic, then explain it in your own words.</p></div><div><p className="mb-3 text-sm font-medium text-foreground">Topic</p><div className="grid gap-2 sm:grid-cols-2">{REPORT_CATEGORIES.map((category) => <button key={category.id} type="button" onClick={() => setForm((current) => ({ ...current, category: category.id, subcategory: category.subcategories[0] ?? "" }))} aria-pressed={form.category === category.id} className={`flex min-h-14 items-center gap-3 rounded-lg border px-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${form.category === category.id ? "border-primary bg-primary/5 text-primary" : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:bg-muted"}`}><CategoryIcon category={category.id} /><span className="text-sm font-medium">{category.name}</span></button>)}</div></div><div className="grid gap-5 sm:grid-cols-2"><label className="space-y-2 text-sm font-medium text-foreground">Specific topic<select value={form.subcategory} onChange={(event) => update("subcategory", event.target.value)} className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{activeCategory.subcategories.map((item) => <option key={item}>{item}</option>)}</select></label><label className="space-y-2 text-sm font-medium text-foreground">Short title <Input value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="For example, water point is not working" /></label></div><label className="block space-y-2 text-sm font-medium text-foreground">What is happening? <textarea value={form.description} onChange={(event) => update("description", event.target.value)} rows={5} placeholder="Tell us what you noticed, when it started, and who is affected if you know." className="flex w-full resize-y rounded-md border border-input bg-background px-3 py-3 text-sm font-normal leading-6 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label><div className="grid gap-5 sm:grid-cols-2"><label className="space-y-2 text-sm font-medium text-foreground">People affected <span className="font-normal text-muted-foreground">optional</span><Input type="number" min="0" value={form.affectedPopulationEstimate} onChange={(event) => update("affectedPopulationEstimate", event.target.value)} placeholder="Approximate number" /></label><fieldset className="space-y-2"><legend className="text-sm font-medium text-foreground">Urgency <span className="font-normal text-muted-foreground">optional</span></legend><div className="flex flex-wrap gap-2">{(["low", "medium", "high", "critical"] as const).map((level) => <button key={level} type="button" onClick={() => update("severity", form.severity === level ? "" : level)} aria-pressed={form.severity === level} className={`min-h-10 rounded-full border px-4 text-xs capitalize transition-colors ${form.severity === level ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-muted"}`}>{level}</button>)}</div></fieldset></div></div>}
        {step === 2 && <div className="space-y-7"><div><h2 className="text-xl font-medium tracking-[-0.03em] text-foreground">Where is it happening?</h2><p className="mt-1 text-sm text-muted-foreground">District is required. Add more details if you know, even if it is only a nearby landmark.</p></div><div className="flex flex-col gap-4 rounded-xl border border-border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><MapPin className="h-5 w-5" /></span><div><p className="text-sm font-medium text-foreground">Use current location</p><p className="text-xs text-muted-foreground">{form.latitude && form.longitude ? `${form.latitude}, ${form.longitude}` : "Coordinates stay private to the review process."}</p></div></div><Button type="button" variant="outline" onClick={captureLocation} disabled={locating} className="gap-2">{locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}{locating ? "Detecting" : "Detect location"}</Button></div><div className="grid gap-5 sm:grid-cols-2"><label className="space-y-2 text-sm font-medium text-foreground">State or region <Input value={form.state} onChange={(event) => update("state", event.target.value)} placeholder="Optional" /></label><label className="space-y-2 text-sm font-medium text-foreground">District or local area <span className="text-primary">*</span><select value={form.district} onChange={(event) => update("district", event.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="">Select district</option>{LOCAL_DISTRICTS.map((item) => <option key={item}>{item}</option>)}</select></label><label className="space-y-2 text-sm font-medium text-foreground">Village, block, landmark <Input value={form.blockOrPanchayat} onChange={(event) => update("blockOrPanchayat", event.target.value)} placeholder="Optional" /></label><label className="space-y-2 text-sm font-medium text-foreground">PIN code <Input value={form.pinCode} onChange={(event) => update("pinCode", event.target.value)} placeholder="Optional" /></label></div><label className="space-y-2 text-sm font-medium text-foreground">Address or location note <Input value={form.formattedAddress} onChange={(event) => update("formattedAddress", event.target.value)} placeholder="Optional landmark or address" /></label></div>}
        {step === 3 && <div className="space-y-7"><div><h2 className="text-xl font-medium tracking-[-0.03em] text-foreground">Add evidence, if you have it.</h2><p className="mt-1 text-sm text-muted-foreground">Add a photo or document from this device, or paste a public link.</p></div><div className="rounded-xl border border-dashed border-border bg-muted/30 p-5 sm:p-6"><label htmlFor="evidence-file" className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-border bg-background px-4 text-center transition-colors hover:border-primary/50 hover:bg-primary/5 focus-within:ring-2 focus-within:ring-ring"><ImagePlus className="h-6 w-6 text-primary" /><span className="mt-3 text-sm font-medium text-foreground">Choose a photo or document</span><span className="mt-1 text-xs text-muted-foreground">From your phone, tablet, or computer · 5 MB max</span><input id="evidence-file" type="file" accept="image/*,.pdf,.doc,.docx" onChange={addEvidenceFile} disabled={uploadingEvidence} className="sr-only" />{uploadingEvidence && <span className="mt-2 flex items-center gap-2 text-xs text-primary"><Loader2 className="h-3.5 w-3.5 animate-spin" />Reading file…</span>}</label><div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-muted-foreground"><span className="h-px flex-1 bg-border" />or add a link<span className="h-px flex-1 bg-border" /></div><div className="grid gap-3 sm:grid-cols-[1fr_180px_auto]"><Input type="url" value={evidenceUrl} onChange={(event) => setEvidenceUrl(event.target.value)} placeholder="https://..." aria-label="Evidence link" /><Input value={evidenceCaption} onChange={(event) => setEvidenceCaption(event.target.value)} placeholder="Caption (optional)" aria-label="Evidence caption" /><Button type="button" variant="outline" onClick={addEvidence} disabled={!evidenceUrl.trim()} className="gap-2"><Paperclip className="h-4 w-4" />Add link</Button></div></div>{form.evidence.length > 0 && <div className="space-y-2"><p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Attached evidence</p>{form.evidence.map((item, index) => <div key={`${item.mediaUrl}-${index}`} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"><div className="flex min-w-0 items-center gap-3">{item.mediaType.startsWith("image/") || item.mediaType === "image" ? <ImagePlus className="h-4 w-4 shrink-0 text-primary" /> : <FileText className="h-4 w-4 shrink-0 text-primary" />}<div className="min-w-0"><p className="truncate text-sm font-medium text-foreground">{item.caption}</p><p className="truncate text-xs text-muted-foreground">{item.mediaUrl.startsWith("data:") ? "Device file attached" : item.mediaUrl}</p></div></div><Button type="button" variant="ghost" size="icon" onClick={() => update("evidence", form.evidence.filter((_, evidenceIndex) => evidenceIndex !== index))} aria-label={`Remove ${item.caption}`}><Trash2 className="h-4 w-4" /></Button></div>)}</div>}</div>}
        {step === 4 && <div className="space-y-7"><div><h2 className="text-xl font-medium tracking-[-0.03em] text-foreground">Review before submitting</h2><p className="mt-1 text-sm text-muted-foreground">Your report will enter the review process. Similar reports may be connected later.</p></div><div className="rounded-xl border border-primary/20 bg-primary/5 p-5"><div className="flex items-center gap-2 text-sm font-medium text-primary"><Lightbulb className="h-4 w-4" />AI support is planned for this report</div><div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-lg bg-background/80 p-3"><p className="text-xs font-medium text-foreground">Find related reports</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Surface possible duplicates and connected problems.</p></div><div className="rounded-lg bg-background/80 p-3"><p className="text-xs font-medium text-foreground">Suggest the right team</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Support department and jurisdiction review.</p></div><div className="rounded-lg bg-background/80 p-3"><p className="text-xs font-medium text-foreground">Find prior solutions</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Bring useful verified approaches into review.</p></div></div><p className="mt-4 text-xs text-primary/80">Automation is not active yet. No decision is made by this preview.</p></div><dl className="divide-y divide-border rounded-xl border border-border"><div className="flex gap-4 p-4"><dt className="w-32 shrink-0 text-xs text-muted-foreground">Topic</dt><dd className="text-sm text-foreground">{activeCategory.name} · {form.subcategory}</dd></div><div className="flex gap-4 p-4"><dt className="w-32 shrink-0 text-xs text-muted-foreground">Issue</dt><dd className="text-sm text-foreground">{form.title}</dd></div><div className="flex gap-4 p-4"><dt className="w-32 shrink-0 text-xs text-muted-foreground">Location</dt><dd className="text-sm text-foreground">{form.district || form.state || form.formattedAddress || "Not provided"}</dd></div><div className="flex gap-4 p-4"><dt className="w-32 shrink-0 text-xs text-muted-foreground">Evidence</dt><dd className="text-sm text-foreground">{form.evidence.length ? `${form.evidence.length} link${form.evidence.length === 1 ? "" : "s"}` : "Not provided"}</dd></div></dl></div>}
        <div className="mt-8 flex items-center justify-between border-t border-border pt-6"><Button type="button" variant="ghost" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1 || submitting} className="gap-2"><ArrowLeft className="h-4 w-4" />Back</Button>{step < 4 ? <Button type="button" onClick={next} className="gap-2">Continue<ArrowRight className="h-4 w-4" /></Button> : <Button type="button" onClick={() => void submit()} disabled={submitting} className="gap-2">{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}{submitting ? "Submitting" : "Submit report"}</Button>}</div>
      </section>
    </div>
  </div>;
}
