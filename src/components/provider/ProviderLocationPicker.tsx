import React, { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
  OverlayView,
} from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const baseImgUrl = import.meta.env.VITE_IMG_API_URL;
const libraries: "places"[] = ["places"];

interface ProviderLocationPickerProps {
  initialLocation?: { lat: number; lng: number };
  providerInfo?: { name: string; profileImage?: string; rating?: number };
  onSave?: (data: { lat: number; lng: number; address: string }) => void;
}

interface SavedMarker {
  lat: number;
  lng: number;
  address?: string;
  name: string;
  profileImage?: string;
  rating: number;
  category: string;
}

export const ProviderLocationPicker = ({
  initialLocation = { lat: 28.6139, lng: 77.2090 }, // ✅ Default: Delhi
  providerInfo,
  onSave,
}: ProviderLocationPickerProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState(initialLocation);
  const [address, setAddress] = useState("Delhi, India");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [savedMarkers, setSavedMarkers] = useState<SavedMarker[]>([]);
  const [profile, setProfile] = useState(providerInfo);
  const [providerToken, setProviderToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("providerToken") : null
  );

  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
    borderRadius: "8px",
  };

  // Fetch provider profile and update marker
  const loadProviderProfile = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/provider/get-provider-profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("providerToken")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      const dataToShow = data.provider;

      setProfile(dataToShow);
      setSavedMarkers([]);

      if (dataToShow?.location?.coordinates) {
        const lat = dataToShow.location.coordinates[1]; // GeoJSON [lng, lat]
        const lng = dataToShow.location.coordinates[0];
        setMarkerPosition({ lat, lng });
        setAddress(dataToShow.address || "");
        setSavedMarkers([
          {
            lat,
            lng,
            address: dataToShow.address,
            name: dataToShow.name,
            profileImage: dataToShow.profileImage,
            rating: dataToShow.rating || 0,
            category: dataToShow.category,
          },
        ]);
      } else {
        // ✅ Fallback to Delhi when no saved location
        setMarkerPosition({ lat: 28.6139, lng: 77.2090 });
        setAddress("Delhi, India");
      }
    } catch (err) {
      console.error("Failed to fetch provider info:", err);
      setSavedMarkers([]);
      // ✅ Fallback to Delhi on error
      setMarkerPosition({ lat: 28.6139, lng: 77.2090 });
      setAddress("Delhi, India");
    }
  };

  // Initial fetch and whenever token changes
  useEffect(() => {
    loadProviderProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerToken]);

  // Listen for token changes across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "providerToken") {
        const next = localStorage.getItem("providerToken");
        setProviderToken(next);
        setSavedMarkers([]);
        setMarkerPosition({ lat: 28.6139, lng: 77.2090 }); // ✅ Reset to Delhi
        setAddress("Delhi, India");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Sync internal profile
  useEffect(() => {
    if (providerInfo) setProfile(providerInfo);
  }, [providerInfo?.name, providerInfo?.profileImage, providerInfo?.rating]);

  // React to external initialLocation updates (e.g., Use My Location)
  useEffect(() => {
    if (!initialLocation) return;
    setMarkerPosition(initialLocation);
    map?.panTo(initialLocation);
    map?.setZoom(15);
    getAddressFromCoords(initialLocation.lat, initialLocation.lng);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLocation?.lat, initialLocation?.lng]);

  const getAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
          import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        }`
      );
      const data = await res.json();
      setAddress(data.results?.[0]?.formatted_address || "");
    } catch (err) {
      console.error("Error getting address:", err);
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    getAddressFromCoords(lat, lng);
  };

  const onPlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      const location = place.geometry?.location;
      if (location) {
        const lat = location.lat();
        const lng = location.lng();
        setMarkerPosition({ lat, lng });
        setAddress(place.formatted_address || "");
        map?.panTo({ lat, lng });
      }
    }
  };

  const handleSave = async () => {
    if (!markerPosition) return alert("Please select a location");
    setLoading(true);
    setMessage("");

    const dataToSave = {
      lat: markerPosition.lat,
      lng: markerPosition.lng,
      address,
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/provider/set-provider-location`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("providerToken")}`,
          },
          body: JSON.stringify(dataToSave),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to save location");

      // Refresh profile
      const res1 = await fetch(
        `${import.meta.env.VITE_API_URL}/provider/get-provider-profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("providerToken")}`,
          },
        }
      );
      if (!res1.ok) throw new Error("Failed to fetch profile");

      const data = await res1.json();
      const dataToShow = data.provider;

      if (dataToShow?.location?.coordinates) {
        const lat = dataToShow.location.coordinates[1];
        const lng = dataToShow.location.coordinates[0];

        const updatedMarker: SavedMarker = {
          lat,
          lng,
          address: dataToShow.address,
          name: dataToShow.name,
          profileImage: dataToShow.profileImage,
          rating: dataToShow.rating || 0,
          category: dataToShow.category,
        };

        setMarkerPosition({ lat, lng });
        setSavedMarkers([updatedMarker]);
        setAddress(dataToShow.address || "");
      }

      setMessage("✅ Location saved successfully!");
      onSave?.(dataToSave);
    } catch (err: any) {
      console.error("Error saving location:", err);
      setMessage("❌ Failed to save location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <div className="space-y-4" key={providerToken || "no-token"}>
        <StandaloneSearchBox
          onLoad={(ref) => (searchBoxRef.current = ref)}
          onPlacesChanged={onPlacesChanged}
        >
          <Input
            type="text"
            placeholder="Search your location..."
            ref={inputRef}
            className="w-full"
          />
        </StandaloneSearchBox>

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={markerPosition}
          zoom={12} // ✅ Zoomed-out Delhi view
          onClick={handleMapClick}
          onLoad={(mapInstance) => setMap(mapInstance)}
        >
          <Marker
            position={markerPosition}
            draggable
            onDragEnd={(e) => {
              const lat = e.latLng?.lat() || markerPosition.lat;
              const lng = e.latLng?.lng() || markerPosition.lng;
              setMarkerPosition({ lat, lng });
              getAddressFromCoords(lat, lng);
            }}
          />

          {savedMarkers.map((m, idx) => (
            <OverlayView
              key={idx}
              position={{ lat: m.lat, lng: m.lng }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div className="flex flex-col items-center">
                <img
                  src={
                    m.profileImage
                      ? `${baseImgUrl}${m.profileImage}`
                      : "/default-profile.png"
                  }
                  alt={m.name}
                  className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                />
                <div className="bg-black text-xs px-2 py-1 rounded-md shadow-md mt-1 text-center text-white leading-tight">
                  <strong className="block">{m.name}</strong>
                  <div>⭐{Number(m.rating || 0).toFixed(1)}</div>
                  <div className="italic text-gray-300">
                    {m.category || "N/A"}
                  </div>
                </div>
              </div>
            </OverlayView>
          ))}
        </GoogleMap>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">
            Selected Address
          </label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>

        <Button className="w-full" onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Location"}
        </Button>

        {message && (
          <p
            className={`text-sm ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </LoadScript>
  );
};
