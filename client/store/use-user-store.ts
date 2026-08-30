import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  UserProfile,
  UserRole,
  GeoLocationContext,
  GovernmentProfileData,
  StudentProfileData,
  InstitutionProfileData,
  IndustryProfileData,
} from "@/types/auth";

interface UserState {
  user: UserProfile | null;
  isLoading: boolean;
  isHydrated: boolean;
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  updateRole: (role: UserRole) => void;
  updateGeoContext: (geo: Partial<GeoLocationContext>) => void;
  updateRoleProfile: (
    profileData:
      | GovernmentProfileData
      | StudentProfileData
      | InstitutionProfileData
      | IndustryProfileData
  ) => void;
  setOnboarded: (status: boolean) => void;
  clearSession: () => void;
  setHydrated: (state: boolean) => void;
  
  // Async operations
  syncWithBackend: () => Promise<{ success: boolean; error?: string }>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isHydrated: false,

      setUser: (user) => set({ user }),

      updateRole: (role) => {
        const currentUser = get().user;
        if (!currentUser) return;
        set({ user: { ...currentUser, role } });
      },

      updateGeoContext: (geo) => {
        const currentUser = get().user;
        if (!currentUser) return;
        set({
          user: {
            ...currentUser,
            geoContext: {
              ...currentUser.geoContext,
              ...geo,
            },
          },
        });
      },

      updateRoleProfile: (profileData) => {
        const currentUser = get().user;
        if (!currentUser) return;
        set({
          user: {
            ...currentUser,
            roleProfile: profileData,
          },
        });
      },

      setOnboarded: (status) => {
        const currentUser = get().user;
        if (!currentUser) return;
        set({
          user: {
            ...currentUser,
            isOnboarded: status,
          },
        });
      },

      clearSession: () => {
        set({ user: null, isLoading: false });
        if (typeof window !== "undefined") {
          localStorage.removeItem("civicpulse_session");
          document.cookie = "civicpulse_auth=; path=/; max-age=0; SameSite=Lax";
        }
      },

      setHydrated: (state) => set({ isHydrated: state }),

      syncWithBackend: async () => {
        const currentUser = get().user;
        if (!currentUser || !currentUser.firebaseUid) {
          return { success: false, error: "No user session present to sync" };
        }

        set({ isLoading: true });
        try {
          const res = await fetch("/api/users/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(currentUser),
          });

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            set({ isLoading: false });
            return {
              success: false,
              error: errorData.error || "Failed to persist profile to database",
            };
          }

          const responseData = await res.json();
          if (responseData.data) {
            set({ user: responseData.data, isLoading: false });
          } else {
            set({ isLoading: false });
          }

          return { success: true };
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Sync error";
          set({ isLoading: false });
          return { success: false, error: msg };
        }
      },
    }),
    {
      name: "civicpulse_user_store",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
