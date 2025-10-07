import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Menu, LogOut, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

export const ProviderHeader = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [providerProfile, setProviderProfile] = useState<any>(null);

  const token = localStorage.getItem("providerToken");
  const baseUrl = import.meta.env.VITE_API_URL;

  const handleLogout = () => {
    localStorage.removeItem("providerToken");
    navigate("/provider/login");
  };

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const res = await fetch(`${baseUrl}/provider/get-provider-profile`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
      setProviderProfile(data.provider || data);
    } catch (err) {
      console.error("Error fetching provider profile:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileClick = () => {
    setProfileOpen(true);
    fetchProfile();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 dark:bg-gray-900/80 dark:border-gray-700">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5 text-foreground dark:text-gray-200" />
            </Button>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary-foreground dark:text-primary-400" />
              <h1 className="text-xl font-bold text-foreground dark:text-gray-100">LocalFinder</h1>
              <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-200">
                Provider Portal
              </Badge>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Profile Icon */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleProfileClick}
              className="relative text-foreground dark:text-gray-200"
            >
              <User className="h-6 w-6" />
            </Button>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Profile Dialog */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-w-lg rounded-3xl p-6 shadow-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
          <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-600">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              My Profile
            </DialogTitle>
          </DialogHeader>

          {profileLoading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Loading...</p>
          ) : providerProfile ? (
            <div className="space-y-6 mt-4">
              {/* Profile Info */}
              <div className="flex items-center gap-4">
                <img
                  src={
                    providerProfile.profileImage
                      ? `${import.meta.env.VITE_IMG_API_URL}${providerProfile.profileImage}`
                      : "/default-profile.png"
                  }
                  alt={providerProfile.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md dark:border-gray-600"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{providerProfile.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{providerProfile.category}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{providerProfile.description}</p>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex flex-col">
                  <span className="text-gray-400 dark:text-gray-500">Mobile</span>
                  <span className="font-medium">{providerProfile.mobile || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 dark:text-gray-500">Rating</span>
                  <span className="font-medium">{Number(providerProfile.rating || 0).toFixed(1)}</span>
                </div>
                <div className="col-span-2 flex flex-col">
                  <span className="text-gray-400 dark:text-gray-500">Address</span>
                  <span className="font-medium">{providerProfile.address || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 dark:text-gray-500">Price</span>
                  <span className="font-medium">{providerProfile.price != null ? `₹${providerProfile.price}` : "N/A"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 dark:text-gray-500">Availability</span>
                  <span className="font-medium">
                    {providerProfile.availability ? (
                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs dark:bg-green-800 dark:text-green-200">Available</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs dark:bg-red-800 dark:text-red-200">Unavailable</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">No profile data available.</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
