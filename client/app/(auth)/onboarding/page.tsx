"use client";

import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Compass,
  GraduationCap,
  Landmark,
  Loader2,
  MapPin,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSession, setSession } from "@/lib/auth/session";
import { useUserStore } from "@/store/use-user-store";
import {
  GovernmentProfileData,
  InstitutionProfileData,
  StudentProfileData,
  UserProfile,
  UserRole,
  UserSession,
} from "@/types/auth";

interface RoleOption {
  role: UserRole;
  title: string;
  description: string;
  icon: typeof UserRound;
}

interface GeoPoint {
  lat: number;
  lng: number;
}

interface ReverseGeocodeResponse {
  address?: {
    state?: string;
    province?: string;
    state_district?: string;
    county?: string;
    district?: string;
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    postcode?: string;
  };
}

const ROLES: RoleOption[] = [
  { role: "citizen", title: "Citizen", description: "Report a problem, add evidence, and follow what happens next.", icon: UserRound },
  { role: "student", title: "Student", description: "Find meaningful problems, form a team, and propose an approach.", icon: GraduationCap },
  { role: "government", title: "Government officer", description: "Review public reports, validate problems, and guide solutions.", icon: Landmark },
  { role: "institution", title: "Institution or lab", description: "Share verified capabilities and coordinate people for projects.", icon: Building2 },
];

const roleNeedsDetails = (role: UserRole) =>
  role === "student" || role === "government" || role === "institution";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [session, setCurrentSession] = useState<UserSession | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("citizen");
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [geoPoint, setGeoPoint] = useState<GeoPoint | null>(null);
  const [stateRegion, setStateRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [cityTown, setCityTown] = useState("");
  const [pincode, setPincode] = useState("");
  const [organization, setOrganization] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [skills, setSkills] = useState("");
  const [aisheCode, setAisheCode] = useState("");

  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      router.replace("/login");
      return;
    }
    startTransition(() => {
      setCurrentSession(currentSession);
      const storedUser = useUserStore.getState().user;
      if (storedUser) {
        if (storedUser.role) setSelectedRole(storedUser.role);
        if (storedUser.geoContext?.state) setStateRegion(storedUser.geoContext.state);
        if (storedUser.geoContext?.district) setDistrict(storedUser.geoContext.district);
        if (storedUser.geoContext?.pinCode) setPincode(storedUser.geoContext.pinCode);
        const roleProfile = storedUser.roleProfile;
        if (storedUser.role === "student" && roleProfile && "department" in roleProfile) {
          const sProfile = roleProfile as StudentProfileData;
          setOrganization(sProfile.institutionName || "");
          setDepartment(sProfile.department || "");
          setAisheCode(sProfile.aisheCode || "");
          if (sProfile.skills && Array.isArray(sProfile.skills)) setSkills(sProfile.skills.join(", "));
        } else if (storedUser.role === "government" && roleProfile && "department" in roleProfile) {
          const gProfile = roleProfile as GovernmentProfileData;
          setOrganization(gProfile.department || "");
          setDesignation(gProfile.designation || "");
        } else if (storedUser.role === "institution" && roleProfile && "institutionName" in roleProfile) {
          const iProfile = roleProfile as InstitutionProfileData;
          setOrganization(iProfile.institutionName || "");
          if (iProfile.departments && Array.isArray(iProfile.departments)) setDepartment(iProfile.departments.join(", "));
          setAisheCode(iProfile.aisheCode || "");
          if (iProfile.capabilities && Array.isArray(iProfile.capabilities)) setSkills(iProfile.capabilities.join(", "));
        }
      } else {
        setSelectedRole(currentSession.role);
      }
    });
  }, [router]);

  const totalSteps = roleNeedsDetails(selectedRole) ? 3 : 2;

  const handleAutoLocate = () => {
    if (!navigator.geolocation) {
      setError("Location detection is not available in this browser.");
      return;
    }
    setError("");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const point = { lat: coords.latitude, lng: coords.longitude };
        setGeoPoint(point);
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${point.lat}&lon=${point.lng}`);
          if (response.ok) {
            const data = (await response.json()) as ReverseGeocodeResponse;
            const address = data.address ?? {};
            setStateRegion(address.state ?? address.province ?? "");
            setDistrict(address.state_district ?? address.county ?? address.district ?? "");
            setCityTown(address.city ?? address.town ?? address.village ?? address.suburb ?? "");
            setPincode(address.postcode ?? "");
          }
        } catch {
          setError("Coordinates were saved. The area name can be added manually.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setError("We could not detect your location. You can continue and add it later.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleNext = () => {
    setError("");
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2 && roleNeedsDetails(selectedRole)) {
      setStep(3);
      return;
    }
    void finalizeOnboarding();
  };

  const finalizeOnboarding = async () => {
    if (!session) {
      router.replace("/login");
      return;
    }
    setSaving(true);
    setError("");
    try {
      setSession({ ...session, role: selectedRole });
      let roleProfileData: UserProfile["roleProfile"] = null;
      if (selectedRole === "government") {
        roleProfileData = { department: organization || "General administration", designation: designation || "Officer" };
      } else if (selectedRole === "student") {
        roleProfileData = { institutionName: organization || "Institution", aisheCode: aisheCode || undefined, department: department || "General", skills: skills.split(",").map((skill) => skill.trim()).filter(Boolean) };
      } else if (selectedRole === "institution") {
        roleProfileData = { institutionName: organization || "Institution", aisheCode: aisheCode || undefined, departments: department.split(",").map((item) => item.trim()).filter(Boolean), capabilities: skills.split(",").map((item) => item.trim()).filter(Boolean) };
      }

      const { setUser, syncWithBackend } = useUserStore.getState();
      setUser({
        firebaseUid: session.id,
        email: session.email,
        displayName: session.name || null,
        role: selectedRole,
        isOnboarded: true,
        geoContext: {
          state: stateRegion,
          district,
          pinCode: pincode,
          latitude: geoPoint?.lat.toString() ?? null,
          longitude: geoPoint?.lng.toString() ?? null,
          formattedAddress: [cityTown, district, stateRegion, pincode].filter(Boolean).join(", "),
        },
        roleProfile: roleProfileData,
      });
      await syncWithBackend();
      router.push("/dashboard");
    } catch {
      setError("We could not save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!session) return null;

  return (
    <main className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8 lg:p-10">
        <div className="flex items-center justify-between gap-5 border-b border-border pb-5"><div><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">Setup {step} of {totalSteps}</p><p className="mt-1 text-xs text-muted-foreground">{step === 1 ? "Choose your role" : step === 2 ? "Add your context" : "Complete your profile"}</p></div><div className="flex shrink-0 gap-1.5" aria-label={`Step ${step} of ${totalSteps}`}>{Array.from({ length: totalSteps }, (_, index) => <span key={index} className={`h-1.5 w-8 rounded-full ${index < step ? "bg-primary" : "bg-muted"}`} />)}</div></div>

        <div className="mt-8">
          {step === 1 && <section><h2 className="max-w-lg text-3xl font-medium leading-tight tracking-[-0.045em] text-foreground">How will you use the platform?</h2><p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">Choose the workspace that fits your contribution. You can change details later.</p><div className="mt-7 grid gap-2.5 sm:grid-cols-2">{ROLES.map(({ role, title, description, icon: Icon }) => { const selected = selectedRole === role; return <button key={role} type="button" aria-pressed={selected} onClick={() => setSelectedRole(role)} className={`group flex min-h-24 items-center gap-3 rounded-xl border p-3.5 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${selected ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary/40 hover:bg-muted/40"}`}><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-primary"}`}><Icon className="h-4 w-4" /></span><span><span className="block text-sm font-medium text-foreground">{title}</span><span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{description}</span></span>{selected && <Check className="ml-auto h-4 w-4 shrink-0 text-primary" />}</button>; })}</div></section>}
          {step === 2 && <section><h2 className="max-w-lg text-3xl font-medium leading-tight tracking-[-0.045em] text-foreground">Where should your workspace begin?</h2><p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">Add a general area to make local problems and opportunities more relevant. This is optional.</p><Button type="button" variant="outline" onClick={handleAutoLocate} disabled={locating} className="mt-8 h-11 w-full justify-center gap-2 rounded-xl border-primary/30 bg-primary/5 text-primary hover:bg-primary/10">{locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Compass className="h-4 w-4" />}{locating ? "Finding your area" : "Use my current area"}</Button>{geoPoint && <p className="mt-3 flex items-center gap-2 rounded-xl bg-muted px-3 py-2 font-mono text-[11px] text-muted-foreground"><MapPin className="h-3.5 w-3.5 text-primary" /> Coordinates captured</p>}<div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="State or region" value={stateRegion} onChange={setStateRegion} placeholder="Optional" /><Field label="District or area" value={district} onChange={setDistrict} placeholder="Optional" /><Field label="City, town, or block" value={cityTown} onChange={setCityTown} placeholder="Optional" /><Field label="PIN code" value={pincode} onChange={setPincode} placeholder="Optional" /></div></section>}
          {step === 3 && <ProfileDetails role={selectedRole} organization={organization} setOrganization={setOrganization} department={department} setDepartment={setDepartment} designation={designation} setDesignation={setDesignation} skills={skills} setSkills={setSkills} aisheCode={aisheCode} setAisheCode={setAisheCode} />}
        </div>

        {error && <p role="alert" className="mt-6 rounded-xl border border-destructive/25 bg-destructive/5 px-3 py-2 text-xs leading-5 text-destructive">{error}</p>}
        <div className="mt-9 flex items-center justify-between border-t border-border pt-5"><Button type="button" variant="ghost" onClick={() => step === 1 ? router.push("/register") : setStep((step - 1) as 1 | 2 | 3)} className="gap-2 text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Back</Button><Button type="button" onClick={handleNext} disabled={saving} className="h-11 gap-2 rounded-xl px-5">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{saving ? "Saving" : step === totalSteps ? "Finish setup" : "Continue"}{!saving && <ArrowRight className="h-4 w-4" />}</Button></div>
    </main>
  );
}

interface FieldProps { label: string; value: string; onChange: (value: string) => void; placeholder: string }
function Field({ label, value, onChange, placeholder }: FieldProps) { return <label className="block space-y-2"><span className="text-xs font-medium text-foreground">{label}</span><Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-11 rounded-xl bg-background" /></label>; }

interface ProfileDetailsProps { role: UserRole; organization: string; setOrganization: (value: string) => void; department: string; setDepartment: (value: string) => void; designation: string; setDesignation: (value: string) => void; skills: string; setSkills: (value: string) => void; aisheCode: string; setAisheCode: (value: string) => void }
function ProfileDetails({ role, organization, setOrganization, department, setDepartment, designation, setDesignation, skills, setSkills, aisheCode, setAisheCode }: ProfileDetailsProps) {
  const title = role === "student" ? "Tell us what you want to build with" : role === "government" ? "Add your official context" : "Introduce your institution";
  return <section><h2 className="max-w-lg text-3xl font-medium leading-tight tracking-[-0.045em] text-foreground">{title}</h2><p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">These details help us show the right problems, people, and actions. You can refine them later.</p><div className="mt-8 space-y-5"><Field label={role === "student" ? "Institution name" : role === "government" ? "Department" : "Institution or lab name"} value={organization} onChange={setOrganization} placeholder="Optional" /><div className="grid gap-5 sm:grid-cols-2"><Field label={role === "government" ? "Designation" : "Department or focus"} value={role === "government" ? designation : department} onChange={role === "government" ? setDesignation : setDepartment} placeholder="Optional" />{role !== "government" && <Field label="Directory code" value={aisheCode} onChange={setAisheCode} placeholder="Optional" />}</div>{role === "student" && <Field label="Skills, separated by commas" value={skills} onChange={setSkills} placeholder="Optional" />}{role === "institution" && <Field label="Research capabilities" value={skills} onChange={setSkills} placeholder="Optional" />}</div></section>;
}
