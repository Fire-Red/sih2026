"use client";

import { FormEvent, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, Navigation, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LocationPickerMapProps {
  latitude?: string;
  longitude?: string;
  onLocationSelect: (lat: string, lng: string, reverseGeocodedAddress?: string, address?: LocationAddress) => void;
  className?: string;
}

export interface LocationAddress {
  state?: string;
  state_district?: string;
  county?: string;
  city?: string;
  town?: string;
  village?: string;
  suburb?: string;
  postcode?: string;
}

const DynamicLeafletContainer = dynamic(
  () => import("./leaflet-picker-inner").then((mod) => mod.LeafletPickerInner),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-lg border border-border bg-muted/30 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-xs">Loading map view...</span>
      </div>
    ),
  }
);

export function LocationPickerMap({
  latitude,
  longitude,
  onLocationSelect,
  className = "",
}: LocationPickerMapProps) {
  const [detecting, setDetecting] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locError, setLocError] = useState<string | null>(null);

  const initialLat = latitude ? parseFloat(latitude) : 23.6102;
  const initialLng = longitude ? parseFloat(longitude) : 85.2799;

  const selectCoordinates = async (lat: number, lng: number, fallbackAddress?: string) => {
    const latStr = lat.toFixed(6);
    const lngStr = lng.toFixed(6);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latStr}&lon=${lngStr}`);
      const data: { display_name?: string; address?: LocationAddress } = await res.json();
      onLocationSelect(latStr, lngStr, data.display_name ?? fallbackAddress, data.address);
    } catch {
      onLocationSelect(latStr, lngStr, fallbackAddress);
    }
  };

  const handleUseCurrentPosition = () => {
    if (!navigator.geolocation) {
      setLocError("Location services not available on this browser.");
      return;
    }
    setDetecting(true);
    setLocError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await selectCoordinates(pos.coords.latitude, pos.coords.longitude);
        setDetecting(false);
      },
      (err) => {
        setLocError(err.message || "Failed to retrieve location.");
        setDetecting(false);
      },
      { timeout: 8000 }
    );
  };

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setLocError(null);
    try {
      const params = new URLSearchParams({ format: "json", limit: "1", q: searchQuery.trim() });
      const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`);
      const results: Array<{ lat: string; lon: string; display_name?: string }> = await response.json();
      const result = results[0];
      if (!result) {
        setLocError("We could not find that place. Try a nearby town, landmark, or PIN code.");
        return;
      }
      await selectCoordinates(Number(result.lat), Number(result.lon), result.display_name);
    } catch {
      setLocError("Location search is unavailable right now. You can still place the pin on the map.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <span>Click anywhere on the map or drag the pin to set precise location</span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUseCurrentPosition}
          disabled={detecting}
          className="h-7 text-xs"
        >
          {detecting ? (
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          ) : (
            <Navigation className="mr-1 h-3 w-3" />
          )}
          Use my location
        </Button>
      </div>

      <form onSubmit={(event) => void handleSearch(event)} className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search a town, landmark, or PIN code" className="pl-9" aria-label="Search for a location" />
        </div>
        <Button type="submit" variant="outline" disabled={searching || !searchQuery.trim()} className="shrink-0 gap-2">
          {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          <span className="hidden sm:inline">Find place</span>
        </Button>
      </form>

      {locError && (
        <p className="text-xs text-destructive">{locError}</p>
      )}

      <div className="relative h-64 w-full overflow-hidden rounded-lg border border-border">
        <DynamicLeafletContainer
          lat={initialLat}
          lng={initialLng}
          onSelect={(lat, lng) => {
            const latStr = lat.toFixed(6);
            const lngStr = lng.toFixed(6);
            selectCoordinates(Number(latStr), Number(lngStr));
          }}
        />
      </div>
    </div>
  );
}
