"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthHeader } from "@/components/auth/auth-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSession, setSession } from "@/lib/auth/session";
import { UserRole, UserSession } from "@/types/auth";
import { useUserStore } from "@/store/use-user-store";
import {
  User,
  GraduationCap,
  Landmark,
  Building2,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  MapPin,
  Compass,
} from "lucide-react";

interface RoleOption {
  role: UserRole;
  title: string;
  description: string;
  badge: string;
  icon: React.ReactNode;
}

const ROLES: RoleOption[] = [
  {
    role: "citizen",
    title: "Community Citizen",
    description:
      "Submit local issue signals with geo-tags and photos, track resolution in your area.",
    badge: "Low Barrier",
    icon: <User className="h-4 w-4" />,
  },
  {
    role: "student",
    title: "Student / Innovator",
    description:
      "Form cross-campus technical teams, access problems, and submit challenge proposals.",
    badge: "National Network",
    icon: <GraduationCap className="h-4 w-4" />,
  },
  {
    role: "government",
    title: "Government Officer",
    description:
      "Validate candidate systemic problems, review Problem DNA, and publish state challenges.",
    badge: "Decision Console",
    icon: <Landmark className="h-4 w-4" />,
  },
  {
    role: "institution",
    title: "University / Research Lab",
    description:
      "Register lab capabilities and faculty expertise for multi-institution assembly.",
    badge: "AISHE Verified",
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    role: "industry",
    title: "Industry / Startup Partner",
    description:
      "Provide CSR funding, sponsor pilot deployments, and contribute commercial technologies.",
    badge: "CSR & Tech",
    icon: <Briefcase className="h-4 w-4" />,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [session, setCurrentSession] = useState<UserSession | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("citizen");
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [geoCoords, setGeoCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Step 2: Location Data
  const [stateRegion, setStateRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [cityTown, setCityTown] = useState("");
  const [pincode, setPincode] = useState("");

  // Step 3: Role-Specific Details
  const [organization, setOrganization] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [skills, setSkills] = useState("");
  const [aisheCode, setAisheCode] = useState("");

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.push("/login");
      return;
    }
    setCurrentSession(s);
    if (s.role) setSelectedRole(s.role);
  }, [router]);

  const handleAutoLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setGeoCoords({ lat, lng });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            setStateRegion(addr.state || addr.province || "");
            setDistrict(addr.state_district || addr.county || addr.district || "");
            setCityTown(addr.city || addr.town || addr.village || addr.suburb || "");
            setPincode(addr.postcode || "");
          }
        } catch {
          // Keep coordinates
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        alert("Unable to fetch precise location. Please enter manually.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!stateRegion || !district) {
        alert("Please specify your State and District / City.");
        return;
      }
      if (selectedRole === "citizen") {
        finalizeOnboarding();
      } else {
        setStep(3);
      }
    }
  };

  const handleBack = () => {
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  const finalizeOnboarding = async () => {
    if (!session) {
      router.push("/login");
      return;
    }
    setSaving(true);
    try {
      const updated: UserSession = {
        id: session.id,
        name: session.name || "User",
        email: session.email,
        role: selectedRole,
        token: session.token,
      };

      setSession(updated);

      // Build structured role profile
      let roleProfileData = null;
      if (selectedRole === "government") {
        roleProfileData = {
          department: department || "General Administration",
          designation: designation || "Officer",
        };
      } else if (selectedRole === "student") {
        roleProfileData = {
          institutionName: organization || "University",
          aisheCode: aisheCode || undefined,
          department: department || "Engineering / Science",
          skills: skills
            ? skills.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
        };
      } else if (selectedRole === "institution") {
        roleProfileData = {
          institutionName: organization || "Institution",
          aisheCode: aisheCode || undefined,
          departments: department
            ? department.split(",").map((d) => d.trim()).filter(Boolean)
            : [],
        };
      } else if (selectedRole === "industry") {
        roleProfileData = {
          organizationName: organization || "Enterprise",
          csrFocus: department || "General CSR",
        };
      }

      // Update Zustand User Store
      const { setUser, syncWithBackend } = useUserStore.getState();
      setUser({
        firebaseUid: session.id,
        email: session.email,
        displayName: session.name || null,
        role: selectedRole,
        isOnboarded: true,
        geoContext: {
          state: stateRegion,
          district: district || cityTown,
          pinCode: pincode,
          latitude: geoCoords ? geoCoords.lat.toString() : null,
          longitude: geoCoords ? geoCoords.lng.toString() : null,
          formattedAddress: [cityTown, district, stateRegion, pincode]
            .filter(Boolean)
            .join(", "),
        },
        roleProfile: roleProfileData,
      });

      // Synchronize to Neon PostgreSQL database
      await syncWithBackend();

      router.push("/dashboard");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-8">
      {/* Header & Step Indicator */}
      <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
              Setup {step} of {selectedRole === "citizen" ? 2 : 3}
            </span>
            <span className="text-xs text-muted-foreground">
              {step === 1 && "Your role"}
              {step === 2 && "Your location"}
              {step === 3 && "Your details"}
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-foreground sm:text-3xl">
            {step === 1 && "Choose your role in the ecosystem"}
            {step === 2 && "Set your primary operational location"}
            {step === 3 && "Institutional credentials & verification"}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-1.5" aria-label={`Step ${step} of ${selectedRole === "citizen" ? 2 : 3}`}>
          <div className={`h-1.5 w-12 rounded-full transition-all ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
          <div className={`h-1.5 w-12 rounded-full transition-all ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
          {selectedRole !== "citizen" && (
            <div className={`h-1.5 w-12 rounded-full transition-all ${step >= 3 ? "bg-primary" : "bg-muted"}`} />
          )}
        </div>
      </div>

      {/* STEP 1: ROLE SELECTION (Compact 2/3 column layout fitting without scroll) */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-2">
            {ROLES.map((item) => {
              const isSelected = selectedRole === item.role;
              return (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => setSelectedRole(item.role)}
                    className={`relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 text-left transition-all duration-150 ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border bg-background hover:border-primary/40 hover:bg-muted/40"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border z-10 ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-primary"
                        }`}
                      >
                        {item.icon}
                      </div>

                      {isSelected ? (
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 z-10" />
                      ) : (
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xs sm:text-sm font-medium text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="button"
              onClick={handleNext}
              className="h-11 cursor-pointer gap-2 rounded-lg px-5 text-xs font-medium transition-colors hover:bg-primary/90 sm:text-sm"
            >
              <span>Continue to Location</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: PRECISE GEOGRAPHIC CONTEXT */}
      {step === 2 && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleAutoLocate}
            disabled={locating}
            className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs font-medium text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
          >
            {locating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Compass className="h-3.5 w-3.5" />
            )}
            <span>{locating ? "Detecting GPS coordinates..." : "Detect precise location automatically via GPS"}</span>
          </button>

          {geoCoords && (
            <div className="p-2.5 rounded-xl bg-surface-soft border border-border-soft flex items-center gap-2 text-xs text-foreground font-mono">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>GPS: {geoCoords.lat.toFixed(5)}, {geoCoords.lng.toFixed(5)}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                State / Union Territory *
              </label>
              <Input
                type="text"
                value={stateRegion}
                onChange={(e) => setStateRegion(e.target.value)}
                placeholder="e.g. Punjab / Himachal Pradesh"
                className="h-10 rounded-xl text-xs bg-background"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                District / Zone *
              </label>
              <Input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Rupnagar / Shimla"
                className="h-10 rounded-xl text-xs bg-background"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                City / Town / Block
              </label>
              <Input
                type="text"
                value={cityTown}
                onChange={(e) => setCityTown(e.target.value)}
                placeholder="e.g. Anandpur Sahib / Theog"
                className="h-10 rounded-xl text-xs bg-background"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                PIN Code
              </label>
              <Input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="e.g. 140115 / 171001"
                className="h-10 rounded-xl text-xs bg-background"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleBack}
              className="h-10 rounded-full px-5 border border-border-soft text-xs cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>

            <Button
              type="button"
              onClick={handleNext}
              disabled={saving}
              className="h-10 cursor-pointer gap-2 rounded-lg px-5 text-xs font-medium transition-colors hover:bg-primary/90"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving...</span>
                </span>
              ) : selectedRole === "citizen" ? (
                <span>Complete & Enter Workspace</span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Continue to Credentials</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: ROLE SPECIFIC CREDENTIALS */}
      {step === 3 && (
        <div className="space-y-4">
          {selectedRole === "student" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  College / Institute Name *
                </label>
                <Input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. IIT Ropar / NIT / Central University"
                  className="h-10 rounded-xl text-xs bg-background"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">
                    Department / Major
                  </label>
                  <Input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Science / Civil Eng"
                    className="h-10 rounded-xl text-xs bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">
                    Year of Study
                  </label>
                  <Input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. 3rd Year B.Tech / M.Tech"
                    className="h-10 rounded-xl text-xs bg-background"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  Core Skills & Capabilities (Comma separated)
                </label>
                <Input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. Machine Learning, IoT Sensors, GIS Spatial Analysis, Water Quality Testing"
                  className="h-10 rounded-xl text-xs bg-background"
                />
              </div>
            </div>
          )}

          {selectedRole === "government" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  Ministry / Government Department *
                </label>
                <Input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Dept. of Water Resources / Urban Development"
                  className="h-10 rounded-xl text-xs bg-background"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  Official Designation *
                </label>
                <Input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Nodal Officer / Joint Director / Executive Engineer"
                  className="h-10 rounded-xl text-xs bg-background"
                />
              </div>
            </div>
          )}

          {selectedRole === "institution" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  University / Lab Name *
                </label>
                <Input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Centre for Water Research & GIS Laboratory"
                  className="h-10 rounded-xl text-xs bg-background"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">
                    AISHE / UGC Directory Code
                  </label>
                  <Input
                    type="text"
                    value={aisheCode}
                    onChange={(e) => setAisheCode(e.target.value)}
                    placeholder="e.g. U-0123 / C-4567"
                    className="h-10 rounded-xl text-xs bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">
                    Faculty / Dean Designation
                  </label>
                  <Input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Dean R&D / Principal Investigator"
                    className="h-10 rounded-xl text-xs bg-background"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  Lab Research Capabilities
                </label>
                <Input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. Spectrometry, Soil Mechanics, High Precision IoT, Hydro-modeling"
                  className="h-10 rounded-xl text-xs bg-background"
                />
              </div>
            </div>
          )}

          {selectedRole === "industry" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  Company / Organization Name *
                </label>
                <Input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. InfraTech Solutions / EcoInnovations Foundation"
                  className="h-10 rounded-xl text-xs bg-background"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  Designation / Role
                </label>
                <Input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Head of CSR / Technology Transfer Lead"
                  className="h-10 rounded-xl text-xs bg-background"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleBack}
              className="h-10 rounded-full px-5 border border-border-soft text-xs cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>

            <Button
              type="button"
              onClick={finalizeOnboarding}
              disabled={saving}
              className="h-10 cursor-pointer gap-2 rounded-lg px-5 text-xs font-medium transition-colors hover:bg-primary/90"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Finalizing...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Complete Setup & Enter Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
