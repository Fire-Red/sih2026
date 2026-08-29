"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/use-user-store";
import {
  REPORT_CATEGORIES,
  LOCAL_DISTRICTS,
  CategoryOption,
} from "@/lib/constants/report-categories";
import {
  Droplets,
  Sprout,
  Truck,
  HeartPulse,
  GraduationCap,
  Trees,
  Zap,
  Briefcase,
  MapPin,
  Camera,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  Sparkles,
  Loader2,
  X,
} from "lucide-react";

export function CitizenReportWizard() {
  const router = useRouter();
  const { user } = useUserStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    category: "water_sanitation",
    subcategory: "Broken Handpump / Tubewell",
    title: "",
    description: "",
    severity: "medium" as "low" | "medium" | "high" | "critical",
    affectedPopulationEstimate: "150",
    state: "",
    district: user?.geoContext?.district || "",
    blockOrPanchayat: user?.geoContext?.formattedAddress || "",
    pinCode: user?.geoContext?.pinCode || "",
    latitude: user?.geoContext?.latitude || "",
    longitude: user?.geoContext?.longitude || "",
    formattedAddress: user?.geoContext?.formattedAddress || "",
    evidence: [] as { mediaUrl: string; caption: string; mediaType: string }[],
  });

  // Evidence state
  const [newEvidenceUrl, setNewEvidenceUrl] = useState("");
  const [newEvidenceCaption, setNewEvidenceCaption] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  // Auto category icon lookup
  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case "water_sanitation":
        return <Droplets className="w-5 h-5 text-primary" />;
      case "agriculture_irrigation":
        return <Sprout className="w-5 h-5 text-emerald-600" />;
      case "rural_infrastructure":
        return <Truck className="w-5 h-5 text-amber-600" />;
      case "healthcare_nutrition":
        return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case "education_skills":
        return <GraduationCap className="w-5 h-5 text-purple-600" />;
      case "environment_waste":
        return <Trees className="w-5 h-5 text-emerald-700" />;
      case "energy_power":
        return <Zap className="w-5 h-5 text-amber-500" />;
      case "rural_livelihoods":
        return <Briefcase className="w-5 h-5 text-indigo-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-primary" />;
    }
  };

  const activeCategory =
    REPORT_CATEGORIES.find((c) => c.id === formData.category) ||
    REPORT_CATEGORIES[0];

  // Geolocation Handler
  const handleCaptureGPS = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setErrorMsg("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);

        try {
          // OpenStreetMap Reverse Geocode
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const data = await res.json();

          const districtName =
            data.address?.state_district ||
            data.address?.county ||
            data.address?.city ||
            "";

          const matchedDistrict =
            LOCAL_DISTRICTS.find(
              (d) => districtName.toLowerCase().includes(d.toLowerCase())
            ) || districtName;

          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lon,
            district: matchedDistrict,
            state: data.address?.state || prev.state,
            pinCode: data.address?.postcode || prev.pinCode,
            blockOrPanchayat:
              data.address?.suburb ||
              data.address?.village ||
              data.address?.neighbourhood ||
              prev.blockOrPanchayat,
            formattedAddress:
              data.display_name || `Lat: ${lat}, Lon: ${lon}`,
          }));
        } catch {
          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lon,
          }));
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        setErrorMsg("Unable to retrieve location: " + err.message);
      },
      { timeout: 10000 }
    );
  };

  // Add Evidence Media
  const handleAddEvidence = () => {
    if (!newEvidenceUrl) return;
    setFormData((prev) => ({
      ...prev,
      evidence: [
        ...prev.evidence,
        {
          mediaUrl: newEvidenceUrl,
          caption: newEvidenceCaption || "Field Evidence",
          mediaType: "image",
        },
      ],
    }));
    setNewEvidenceUrl("");
    setNewEvidenceCaption("");
  };

  const handleRemoveEvidence = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      evidence: prev.evidence.filter((_, i) => i !== index),
    }));
  };

  // Submit Handler
  const handleSubmitReport = async () => {
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const payload = {
        reporterId: user?.id || null,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory,
        severity: formData.severity,
        affectedPopulationEstimate: formData.affectedPopulationEstimate,
        state: formData.state,
        district: formData.district,
        blockOrPanchayat: formData.blockOrPanchayat,
        pinCode: formData.pinCode,
        latitude: formData.latitude,
        longitude: formData.longitude,
        formattedAddress: formData.formattedAddress,
        evidence: formData.evidence,
      };

      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Submission failed");
      }

      // Redirect to citizen tracking feed
      router.push("/track?submitted=" + data.report.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error submitting report";
      setErrorMsg(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Step Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono text-muted uppercase tracking-wider">
            Report an issue • Step {currentStep} of 4
          </span>
          <span className="text-xs font-medium text-primary">
            Community report
          </span>
        </div>

        {/* Step Titles */}
        <div className="flex justify-between mt-3 text-xs text-muted font-medium">
          <span className={currentStep >= 1 ? "text-ink font-semibold" : ""}>
            1. Issue
          </span>
          <span className={currentStep >= 2 ? "text-ink font-semibold" : ""}>
            2. Location
          </span>
          <span className={currentStep >= 3 ? "text-ink font-semibold" : ""}>
            3. Evidence
          </span>
          <span className={currentStep >= 4 ? "text-ink font-semibold" : ""}>
            4. Review
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Problem Details */}
      {currentStep === 1 && (
        <div className="bg-canvas border border-hairline rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h2 className="text-xl font-normal text-ink mb-1">
              Select Problem Domain & Describe Issue
            </h2>
            <p className="text-sm text-body">
              Describe what is happening. Your report will be reviewed and grouped
              with related reports when appropriate.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {REPORT_CATEGORIES.map((cat) => {
              const isSelected = formData.category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      category: cat.id,
                      subcategory: cat.subcategories[0] || "",
                    }));
                  }}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-hairline hover:border-hairline-strong bg-white"
                  }`}
                >
                  <div className="mb-2">{getCategoryIcon(cat.id)}</div>
                  <span className="text-xs font-semibold text-ink leading-snug">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Subcategory */}
          <div>
            <label className="block text-xs font-medium text-ink mb-1.5 uppercase tracking-wide">
              Sub-Classification
            </label>
            <select
              value={formData.subcategory}
              onChange={(e) =>
                setFormData({ ...formData, subcategory: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-hairline bg-surface-soft text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {activeCategory.subcategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-ink mb-1.5 uppercase tracking-wide">
              Short title *
            </label>
            <input
              type="text"
              placeholder="e.g. High fluoride levels in a community handpump"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-hairline bg-surface-soft text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-ink mb-1.5 uppercase tracking-wide">
              What is happening? *
            </label>
            <textarea
              rows={4}
              placeholder="Describe the problem, since when it started, and how it impacts local residents or livelihood..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-hairline bg-surface-soft text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Severity & Population */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5 uppercase tracking-wide">
                Estimated Affected Population
              </label>
              <input
                type="number"
                value={formData.affectedPopulationEstimate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    affectedPopulationEstimate: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-hairline bg-surface-soft text-sm font-mono text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5 uppercase tracking-wide">
                Urgency / Severity Level
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(["low", "medium", "high", "critical"] as const).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, severity: sev }))
                    }
                    className={`py-2 rounded-xl text-xs font-medium uppercase tracking-wider transition-all ${
                      formData.severity === sev
                        ? sev === "critical"
                          ? "bg-red-600 text-white"
                          : sev === "high"
                          ? "bg-amber-600 text-white"
                          : "bg-primary text-white"
                        : "bg-surface-soft text-body hover:bg-surface-strong"
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Next Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="button"
              disabled={!formData.title.trim() || !formData.description.trim()}
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary-active disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Continue to Location <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Location & Administrative Context */}
      {currentStep === 2 && (
        <div className="bg-canvas border border-hairline rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h2 className="text-xl font-normal text-ink mb-1">
              Geographic & Administrative Area
            </h2>
            <p className="text-sm text-body">
              Add a location if you can. It helps reviewers understand the context.
            </p>
          </div>

          {/* GPS Detector Button */}
          <div className="p-4 bg-surface-soft border border-hairline rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-ink">
                  Automatic GPS Coordinates
                </div>
                <div className="text-xs text-body font-mono">
                  {formData.latitude && formData.longitude
                    ? `${formData.latitude}, ${formData.longitude}`
                    : "No GPS coordinates acquired yet"}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCaptureGPS}
              disabled={isLocating}
              className="w-full sm:w-auto px-4 py-2 bg-white border border-hairline rounded-full text-xs font-semibold text-ink hover:bg-surface-strong flex items-center justify-center gap-2 shadow-xs"
            >
              {isLocating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Detecting...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> Auto-Detect
                  Current Location
                </>
              )}
            </button>
          </div>

          {/* District & Panchayat Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5 uppercase tracking-wide">
                District or local area
              </label>
              <select
                value={formData.district}
                onChange={(e) =>
                  setFormData({ ...formData, district: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-hairline bg-surface-soft text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Select if known</option>
                {LOCAL_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink mb-1.5 uppercase tracking-wide">
                Postal PIN Code
              </label>
              <input
                type="text"
                placeholder="e.g. 834001"
                value={formData.pinCode}
                onChange={(e) =>
                  setFormData({ ...formData, pinCode: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-hairline bg-surface-soft text-sm font-mono text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink mb-1.5 uppercase tracking-wide">
              Block / Panchayat / Village / Landmark
            </label>
            <input
              type="text"
              placeholder="e.g. Satbarwa Block, Near Primary Health Sub-Centre"
              value={formData.blockOrPanchayat}
              onChange={(e) =>
                setFormData({ ...formData, blockOrPanchayat: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-hairline bg-surface-soft text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink mb-1.5 uppercase tracking-wide">
              Full Address / Description
            </label>
            <input
              type="text"
              placeholder="e.g. Main road near the health centre"
              value={formData.formattedAddress}
              onChange={(e) =>
                setFormData({ ...formData, formattedAddress: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-hairline bg-surface-soft text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Nav Buttons */}
          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 text-body hover:text-ink text-sm font-medium flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary-active flex items-center gap-2"
            >
              Continue to Evidence <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Evidence & Attachments */}
      {currentStep === 3 && (
        <div className="bg-canvas border border-hairline rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h2 className="text-xl font-normal text-ink mb-1">
              Field Evidence & Documentation
            </h2>
            <p className="text-sm text-body">
              Attach photographs, test reports, or documents. Multimedia
              evidence dramatically speeds up government verification.
            </p>
          </div>

          {/* Custom media link adder */}
          <div className="border border-hairline rounded-2xl p-4 space-y-3">
            <div className="text-xs font-medium text-ink uppercase tracking-wide">
              Add a photo or document link
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="url"
                placeholder="Paste a link to a photo or document"
                value={newEvidenceUrl}
                onChange={(e) => setNewEvidenceUrl(e.target.value)}
                className="sm:col-span-2 px-3.5 py-2 rounded-xl border border-hairline bg-surface-soft text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <input
                type="text"
                placeholder="Caption (e.g. Field photo)"
                value={newEvidenceCaption}
                onChange={(e) => setNewEvidenceCaption(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-hairline bg-surface-soft text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddEvidence}
                disabled={!newEvidenceUrl}
                className="px-4 py-1.5 bg-ink text-white rounded-full text-xs font-semibold hover:bg-black disabled:opacity-40"
              >
                Add evidence
              </button>
            </div>
          </div>

          {/* Evidence List */}
          {formData.evidence.length > 0 ? (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted uppercase">
                Attached Evidence ({formData.evidence.length})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formData.evidence.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-surface-soft border border-hairline rounded-2xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-xl bg-white border border-hairline flex items-center justify-center shrink-0 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.mediaUrl}
                          alt="preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-semibold text-ink truncate">
                          {item.caption}
                        </div>
                        <div className="text-[10px] font-mono text-muted truncate">
                          {item.mediaUrl}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveEvidence(idx)}
                      className="text-muted hover:text-red-600 p-1.5 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 border border-dashed border-hairline rounded-2xl text-xs text-muted">
              Evidence is optional. You can add it later if you have a link.
            </div>
          )}

          {/* Nav Buttons */}
          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 text-body hover:text-ink text-sm font-medium flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary-active flex items-center gap-2"
            >
              Review & Submit <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Review */}
      {currentStep === 4 && (
        <div className="bg-canvas border border-hairline rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h2 className="text-xl font-normal text-ink mb-1">
              Review your report
            </h2>
            <p className="text-sm text-body">
              Check the details before submitting. Related reports may be grouped
              after review; your report remains part of the original record.
            </p>
          </div>

          {/* Review summary */}
          <div className="p-5 bg-primary/5 border border-primary/20 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" /> Review summary
              </div>
              <span className="text-[11px] font-mono bg-white px-2.5 py-1 rounded-full border border-primary/20 text-primary">
                Ready to submit
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-hairline">
                <div className="text-muted text-[11px] uppercase mb-1">
                  Primary Thematic Area
                </div>
                <div className="text-ink font-semibold flex items-center gap-2">
                  {getCategoryIcon(formData.category)}
                  {activeCategory.name}
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-hairline">
                <div className="text-muted text-[11px] uppercase mb-1">
                  Review path
                </div>
                <div className="text-ink font-semibold">
                  Community and public-service review
                </div>
              </div>
            </div>
          </div>

          {/* Summary Details */}
          <div className="border border-hairline rounded-2xl p-5 space-y-3 text-sm">
            <div className="flex justify-between border-b border-hairline pb-2">
              <span className="text-muted text-xs uppercase">Title:</span>
              <span className="font-semibold text-ink text-right">{formData.title}</span>
            </div>
            <div className="flex justify-between border-b border-hairline pb-2">
              <span className="text-muted text-xs uppercase">District & Location:</span>
              <span className="font-mono text-ink text-right">
                {formData.district || "Location pending"} {formData.pinCode && `(${formData.pinCode})`}
              </span>
            </div>
            <div className="flex justify-between border-b border-hairline pb-2">
              <span className="text-muted text-xs uppercase">Severity & Urgency:</span>
              <span className="uppercase font-mono font-semibold text-ink text-right">
                {formData.severity} ({formData.affectedPopulationEstimate} people impacted)
              </span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-muted text-xs uppercase">Evidence Files:</span>
              <span className="font-mono text-ink text-right">
                {formData.evidence.length} file(s) attached
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-body hover:text-ink text-sm font-medium flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <button
              type="button"
              onClick={handleSubmitReport}
              disabled={isSubmitting}
              className="px-8 py-3 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary-active disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting Report...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Submit report
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
