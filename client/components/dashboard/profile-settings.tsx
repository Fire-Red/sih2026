"use client";

import { startTransition, useEffect, useState } from "react";
import {
  Building2,
  Check,
  Loader2,
  MapPin,
  Save,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/use-user-store";
import {
  GovernmentProfileData,
  InstitutionProfileData,
  StudentProfileData,
  IndustryProfileData,
  UserProfile,
  UserRole,
  UserSession,
} from "@/types/auth";

interface ProfileSettingsProps {
  session: UserSession;
}

interface ProfileResponse {
  data?: UserProfile;
}

const roleLabels: Record<UserRole, string> = {
  citizen: "Citizen",
  student: "Student",
  government: "Government officer",
  institution: "Institution or lab",
  admin: "Platform administrator",
};

export function ProfileSettings({ session }: ProfileSettingsProps) {
  const storedProfile = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const syncWithBackend = useUserStore((state) => state.syncWithBackend);
  const [profile, setProfile] = useState<UserProfile | null>(storedProfile);
  const [name, setName] = useState(session.name);
  const [phone, setPhone] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [organization, setOrganization] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [skills, setSkills] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!storedProfile);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (storedProfile) {
      return;
    }
    let active = true;
    const loadProfile = async () => {
      try {
        const response = await fetch(`/api/users/profile?firebaseUid=${encodeURIComponent(session.id)}`);
        const result = (await response.json()) as ProfileResponse;
        if (active && result.data) {
          startTransition(() => {
            setProfile(result.data ?? null);
            setUser(result.data ?? null);
          });
        }
      } catch {
        if (active) setError("We could not load your profile.");
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadProfile();
    return () => {
      active = false;
    };
  }, [session.id, setUser, storedProfile]);

  useEffect(() => {
    if (!profile) return;
    startTransition(() => {
      setName(profile.displayName || session.name);
      setPhone(profile.phone || "");
      setStateRegion(profile.geoContext.state);
      setDistrict(profile.geoContext.district);
      setPinCode(profile.geoContext.pinCode);
    });
    const roleProfile = profile.roleProfile;
    if (profile.role === "student" && roleProfile && "institutionName" in roleProfile) {
      const studentProfile = roleProfile as StudentProfileData;
      startTransition(() => {
        setOrganization(studentProfile.institutionName);
        setDepartment(studentProfile.department);
        setSkills(studentProfile.skills?.join(", ") || "");
      });
    } else if (profile.role === "government" && roleProfile && "department" in roleProfile) {
      const governmentProfile = roleProfile as GovernmentProfileData;
      startTransition(() => {
        setOrganization(governmentProfile.department);
        setDesignation(governmentProfile.designation);
      });
    } else if (profile.role === "institution" && roleProfile && "institutionName" in roleProfile) {
      const institutionProfile = roleProfile as InstitutionProfileData;
      startTransition(() => {
        setOrganization(institutionProfile.institutionName);
        setDepartment(institutionProfile.departments?.join(", ") || "");
      });
    }
  }, [profile, session.name]);

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    setMessage("");
    setError("");
    let roleProfile: UserProfile["roleProfile"] = profile.roleProfile;
    if (profile.role === "student") roleProfile = { institutionName: organization, department, skills: skills.split(",").map((item) => item.trim()).filter(Boolean) };
    if (profile.role === "government") roleProfile = { department: organization, designation };
    if (profile.role === "institution") roleProfile = { institutionName: organization, departments: department.split(",").map((item) => item.trim()).filter(Boolean) };
    const nextProfile: UserProfile = { ...profile, displayName: name, phone, geoContext: { ...profile.geoContext, state: stateRegion, district, pinCode }, roleProfile };
    setUser(nextProfile);
    const result = await syncWithBackend();
    if (result.success) setMessage("Profile saved");
    else setError(result.error || "We could not save your profile.");
    setSaving(false);
  };

  if (loading) return <div className="rounded-2xl border border-border bg-card p-8 text-sm text-muted-foreground">Loading profile...</div>;

  return <div className="mx-auto max-w-3xl"><header className="border-b border-border pb-8"><p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">Profile</p><h1 className="text-3xl font-medium tracking-[-0.05em] text-foreground">Keep your workspace current.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">These details help the platform show relevant problems, people, and actions.</p></header><section className="mt-8 space-y-6"><div className="rounded-2xl border border-border bg-card p-6"><div className="flex items-center gap-3 border-b border-border pb-4"><UserRound className="h-4 w-4 text-primary" /><div><h2 className="text-sm font-medium text-foreground">Account</h2><p className="text-xs text-muted-foreground">{roleLabels[profile?.role || session.role]} · {session.email}</p></div></div><div className="mt-5 grid gap-5 sm:grid-cols-2"><Field label="Full name" value={name} onChange={setName} /><Field label="Phone number" value={phone} onChange={setPhone} placeholder="Optional" /></div></div><div className="rounded-2xl border border-border bg-card p-6"><div className="flex items-center gap-3 border-b border-border pb-4"><MapPin className="h-4 w-4 text-primary" /><div><h2 className="text-sm font-medium text-foreground">Location context</h2><p className="text-xs text-muted-foreground">Optional and used to make local information more relevant.</p></div></div><div className="mt-5 grid gap-5 sm:grid-cols-3"><Field label="State or region" value={stateRegion} onChange={setStateRegion} placeholder="Optional" /><Field label="District or area" value={district} onChange={setDistrict} placeholder="Optional" /><Field label="PIN code" value={pinCode} onChange={setPinCode} placeholder="Optional" /></div></div>{profile?.role !== "citizen" && <div className="rounded-2xl border border-border bg-card p-6"><div className="flex items-center gap-3 border-b border-border pb-4"><Building2 className="h-4 w-4 text-primary" /><div><h2 className="text-sm font-medium text-foreground">Role details</h2><p className="text-xs text-muted-foreground">Add enough context for the right connections.</p></div></div><div className="mt-5 space-y-5"><Field label={profile?.role === "government" ? "Department" : "Institution or lab"} value={organization} onChange={setOrganization} placeholder="Optional" /><div className="grid gap-5 sm:grid-cols-2"><Field label={profile?.role === "government" ? "Designation" : "Department or focus"} value={profile?.role === "government" ? designation : department} onChange={profile?.role === "government" ? setDesignation : setDepartment} placeholder="Optional" />{profile?.role === "student" && <Field label="Skills, separated by commas" value={skills} onChange={setSkills} placeholder="Optional" />}</div></div></div>}</section>{(message || error) && <p role="status" className={`mt-5 flex items-center gap-2 rounded-xl border px-3 py-2 text-xs ${error ? "border-destructive/25 bg-destructive/5 text-destructive" : "border-semantic-up/25 bg-semantic-up/5 text-semantic-up"}`}>{error ? null : <Check className="h-3.5 w-3.5" />}{error || message}</p>}<div className="mt-6 flex justify-end"><Button type="button" onClick={() => void saveProfile()} disabled={saving || !profile} className="h-11 gap-2 rounded-xl px-5">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{saving ? "Saving" : "Save profile"}</Button></div></div>;
}

interface FieldProps { label: string; value: string; onChange: (value: string) => void; placeholder?: string }
function Field({ label, value, onChange, placeholder }: FieldProps) { return <label className="block space-y-2"><span className="text-xs font-medium text-foreground">{label}</span><Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-11 rounded-xl bg-background" /></label>; }
