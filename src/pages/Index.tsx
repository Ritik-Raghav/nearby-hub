import React, { useState, useEffect } from "react";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/ServiceCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { MapView } from "@/components/MapView";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Phone } from "lucide-react";
import heroImage from "@/assets/hero-services.jpg";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StarRating } from "@/components/StarRating";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  const baseUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  // ✅ Fetch providers (search, category, or nearby)
  const fetchProviders = async (query = "", category = "all") => {
    try {
      setLoading(true);
      let endpoint = `${baseUrl}/user/get-nearby-providers`;

      if (query.trim()) {
        endpoint = `${baseUrl}/user/search-providers?query=${encodeURIComponent(query.trim())}`;
      } else if (category !== "all") {
        endpoint = `${baseUrl}/user/get-providers-by-category?category=${encodeURIComponent(category)}`;
      }

      const res = await fetch(endpoint, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok) setProviders(data.providers || []);
      else console.error("Failed to fetch providers:", data.message);
    } catch (err) {
      console.error("Error fetching providers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (providerId: string) => {
    try {
      setDetailsLoading(true);
      setDetailsOpen(true);
      const res = await fetch(`${baseUrl}/user/get-provider-by-id/${encodeURIComponent(providerId)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load provider");
      setSelectedProvider(data.provider || data.data || data);
    } catch (err) {
      console.error("Failed to fetch provider details:", err);
      setSelectedProvider(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  // ✅ Initial load: nearby providers
  useEffect(() => {
    fetchProviders();
  }, []);

  // ✅ Debounced search
  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      fetchProviders(searchQuery.trim(), selectedCategory);
    }, 200);
    setDebounceTimer(timer);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ✅ Category change triggers API fetch
  useEffect(() => {
    fetchProviders(searchQuery.trim(), selectedCategory);
  }, [selectedCategory]);

  // ✅ Update user location
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
  
        try {
          await fetch(`${baseUrl}/user/update-user-location`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ lat: latitude, lng: longitude }),
          });
  
          // ✅ Pass the current category and search query
          fetchProviders(searchQuery.trim(), selectedCategory);
        } catch (err) {
          console.error("Failed to update location:", err);
        }
      },
      (error) => {
        console.error("Location error:", error);
        alert("Unable to get your location");
      }
    );
  };
  

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-80 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent" />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-5xl font-bold text-foreground leading-tight">
              Find Nearby{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Services
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg">
              Connect with trusted local professionals for tuitions, plumbing, electrical work,
              and more in your area.
            </p>
            <div className="flex gap-3 max-w-xl">
              <SearchInput
                placeholder="Search for services, locations..."
                className="flex-1 bg-background/80 backdrop-blur-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button size="lg" variant="outline" className="flex items-center gap-2" onClick={handleUseMyLocation}>
                <MapPin className="h-4 w-4" />
                Use My Location
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-gradient-card rounded-2xl p-6 shadow-card border border-border/50">
                <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Service List */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">Nearby Services</h2>
                  <Badge variant="outline" className="bg-background">
                    {loading ? "Loading..." : `${providers.length} results`}
                  </Badge>
                </div>
                <div className="space-y-4">
                  {providers.length > 0 ? (
                    providers.map((service: any) => (
                      <ServiceCard key={service._id || service.id || service.name} {...service} onViewDetails={handleViewDetails} />
                    ))
                  ) : (
                    <p className="text-muted-foreground">No providers found.</p>
                  )}
                </div>
              </div>

              {/* Map */}
              <div className="h-[600px]">
                <MapView providers={providers} userLocation={userLocation} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
      <DialogContent className="max-w-xl p-0 overflow-hidden">
  {detailsLoading ? (
    <div className="p-6">
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  ) : selectedProvider ? (
    <div className="w-full">
      <div className="relative h-40 w-full">
        <img
          src={selectedProvider.profileImage ? `${import.meta.env.VITE_IMG_API_URL}${selectedProvider.profileImage}` : "/default-image.png"}
          alt={selectedProvider.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">{selectedProvider.name}</h3>
            <span className="text-xs px-2 py-0.5 rounded-md bg-white/15 text-white border border-white/20">
              {selectedProvider.category || "Category"}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {selectedProvider.description && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {selectedProvider.description}
          </p>
        )}

        {/* Rating Section */}
        <div className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">Rate this Provider</span>
          <StarRating
            initialRating={selectedProvider.rating || 0}
            onRate={async (rating) => {
              try {
                const res = await fetch(`${baseUrl}/user/rate-provider/${selectedProvider._id}`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                  },
                  body: JSON.stringify({ rating }),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to submit rating");

                // Update local state to reflect new rating in dialog
                setSelectedProvider((prev: any) => ({
                  ...prev,
                  rating: data.rating,
                }));

                // Also update the providers list so the main list shows the new rating immediately
                setProviders((prevProviders: any[]) =>
                  prevProviders.map((p) =>
                    (p._id || p.id) === (selectedProvider._id || selectedProvider.id)
                      ? { ...p, rating: data.rating }
                      : p
                  )
                );
               
              } catch (err) {
                console.error("Failed to submit rating:", err);
                alert("Failed to submit rating. Please try again.");
              }
            }}
          />
        </div>

        {/* Other Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-4">
          <div className="flex items-start gap-2 p-3 rounded-lg border border-border/50 bg-muted/30">
            <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <div className="text-muted-foreground">Mobile</div>
              <div className="font-medium">{selectedProvider.mobile || "N/A"}</div>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-lg border border-border/50 bg-muted/30">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <div className="text-muted-foreground">Address</div>
              <div className="font-medium break-words">{selectedProvider.address || "N/A"}</div>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-lg border border-border/50 bg-muted/30">
            <div className="h-4 w-4 rounded-sm bg-gradient-primary mt-0.5" />
            <div>
              <div className="text-muted-foreground">Price</div>
              <div className="font-medium">{selectedProvider.price != null ? `₹${selectedProvider.price}` : "N/A"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="p-6">
      <p className="text-sm text-muted-foreground">No details available.</p>
    </div>
  )}
</DialogContent>

      </Dialog>
    </div>
  );
};

export default Index;
