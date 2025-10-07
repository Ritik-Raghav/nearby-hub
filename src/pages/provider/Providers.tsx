import React, { useEffect, useState } from "react";
import { ProviderHeader } from "@/components/provider/ProviderHeader";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, SlidersHorizontal, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-services.jpg";
import { ProviderLocationPicker } from "@/components/provider/ProviderLocationPicker"; // keep the map/location picker
import ProviderProfileForm from "@/components/provider/ProviderProfileForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/providers`);
        const data = await res.json();
        setProviders(data.providers);
      } catch (err) {
        console.error("Failed to fetch providers", err);
      }
    };

    fetchProviders();
  }, []);

  const handleUseMyLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location");
      }
    );
  };

  // const handleSaveLocation = async (data: { lat: number; lng: number; address: string }) => {
  //   try {
  //     console.log('data :::::::', data);
  //     const token = localStorage.getItem("providerToken");
  //     const res = await fetch(`${import.meta.env.VITE_API_URL}/provider/update-location`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(data),
  //     });
  //     if (!res.ok) throw new Error("Failed to update location");
  //     alert("Location updated successfully!");
  //     setLocationDialogOpen(false);
  //   } catch (err) {
  //     console.error(err);
  //     alert("Could not save location");
  //   }
  // };

  const filteredProviders = providers.filter((p) => {
    const matchesSearch = !searchQuery || p.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <ProviderHeader onMenuClick={() => setSidebarOpen(true)} />

      <section className="relative h-80 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent" />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl space-y-6">
            <div className="space-y-4">
              <Badge
                variant="outline"
                className="w-fit bg-background/50 backdrop-blur-sm"
              >
                🧰 Discover Local Providers
              </Badge>
              <h1 className="text-5xl font-bold text-foreground leading-tight">
                Find Nearby
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  {" "}
                  Providers
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Browse verified providers and contact trusted professionals near you.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 max-w-xl">
              {/* <SearchInput
                placeholder="Search providers, locations..."
                className="flex-1 bg-background/80 backdrop-blur-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                size="lg"
                className="bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300 px-8"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Search
              </Button> */}
              <Button
                size="lg"
                variant="outline"
                onClick={handleUseMyLocation}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                Use My Location
              </Button>
              {/* <Button
                size="lg"
                variant="secondary"
                onClick={() => setLocationDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                Set My Location
              </Button> */}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="block lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              <div className="bg-gradient-card rounded-2xl p-6 shadow-card border border-border/50">
                <h3 className="font-semibold text-lg text-foreground mb-4">Your Provider Profile</h3>
                <ProviderProfileForm />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-foreground">Map</h2>
              </div>
              <Badge variant="outline" className="bg-background">
                {filteredProviders.length} providers
              </Badge>
            </div>

            <div className="h-[500px] md:h-[600px]">
              <ProviderLocationPicker
                initialLocation={userLocation || undefined}
                // onSave={handleSaveLocation}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 🗺️ Location Picker Dialog */}
      {/* <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Set Your Service Location</DialogTitle>
          </DialogHeader>
          <ProviderLocationPicker onSave={handleSaveLocation} />
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default Providers;
