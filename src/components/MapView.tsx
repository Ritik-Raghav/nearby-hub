import React, { useEffect, useRef, useState } from "react";
import api from "@/services/api";
import { Card } from "@/components/ui/card";
import { GoogleMap, LoadScript, Marker, OverlayView } from "@react-google-maps/api";

export const MapView = ({ providers = [], userLocation = null }) => {
  const mapRef = useRef(null);
  const [currentUserLocation, setCurrentUserLocation] = useState(null);

  const defaultCenter = { lat: 28.6139, lng: 77.209 }; // Delhi
  const mapContainerStyle = { width: "100%", height: "100%" };

  // ✅ Center the map to a location
  const centerMap = (loc) => {
    if (mapRef.current && loc?.lat && loc?.lng) {
      mapRef.current.panTo(loc);
      mapRef.current.setZoom(14);
    }
  };

  // ✅ Fetch saved user location on mount
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const { data } = await api.get(
          `${import.meta.env.VITE_API_URL}/user/get-user-location`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const loc = data?.location || data;
        if (loc?.lat && loc?.lng) {
          setCurrentUserLocation(loc);
          centerMap(loc);
        }
      } catch (error) {
        console.error("Failed to fetch user location:", error);
      }
    };
    fetchUserLocation();
  }, []);

  // ✅ Update map when `userLocation` prop changes
  useEffect(() => {
    if (userLocation) {
      setCurrentUserLocation(userLocation);
      centerMap(userLocation);
    }
  }, [userLocation]);

  // ✅ Recenter map when providers change (to first provider)
  useEffect(() => {
    if (providers.length > 0) {
      const firstProvider = providers[0];
      const providerLoc = firstProvider.location?.coordinates
        ? { lat: firstProvider.location.coordinates[1], lng: firstProvider.location.coordinates[0] }
        : { lat: firstProvider.lat, lng: firstProvider.lng };

      centerMap(providerLoc);
    }
  }, [providers]);

  return (
    <Card className="relative h-full overflow-hidden rounded-2xl shadow-card border-border/50">
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={currentUserLocation || (providers[0]?.location?.coordinates
            ? { lat: providers[0].location.coordinates[1], lng: providers[0].location.coordinates[0] }
            : defaultCenter)}
          zoom={currentUserLocation ? 14 : 12}
          onLoad={(map) => (mapRef.current = map)}
        >
          {/* Provider markers */}
          {providers.map((p, i) => (
            <OverlayView
              key={i}
              position={{
                lat: p.location?.coordinates?.[1] || p.lat,
                lng: p.location?.coordinates?.[0] || p.lng,
              }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div className="flex flex-col items-center">
                <img
                  src={
                    p.profileImage
                      ? `${import.meta.env.VITE_IMG_API_URL}${p.profileImage}`
                      : "/default-profile.png"
                  }
                  alt={p.name}
                  className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                />
                <div className="bg-black text-xs px-2 py-1 rounded-md shadow-md mt-1 text-center text-white leading-tight">
                  <strong className="block">{p.name}</strong>
                  <div>⭐{Number(p.rating || 0).toFixed(1)}</div>
                  <div className="italic text-gray-300">{p.category || "N/A"}</div>
                </div>
              </div>
            </OverlayView>
          ))}

          {/* User location */}
          {currentUserLocation && (
            <>
              <Marker
                position={currentUserLocation}
                icon={{ url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
              />
              <OverlayView
                position={currentUserLocation}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                getPixelPositionOffset={() => ({ x: 0, y: -52 })}
              >
                <div className="absolute left-1/2 -translate-x-1/2 text-blue-600 text-sm font-semibold bg-white px-3 py-0.5 rounded-md shadow-md pointer-events-none whitespace-nowrap text-center">
                  You
                </div>
              </OverlayView>
            </>
          )}
        </GoogleMap>
      </LoadScript>
    </Card>
  );
};
