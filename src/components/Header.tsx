import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Menu, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const { isAuthenticated, logout } = useAuth();
  const [userName, setUserName] = useState<string>("");

  const token = localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserProfile = async () => {
        try {
          const res = await fetch(`${baseUrl}/user/get-user-profile`, {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          });
          const data = await res.json();
          if (res.ok) {
            setUserName(`${data.name}`);
          } else {
            console.error("Failed to fetch user profile:", data.message);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      };
      fetchUserProfile();
    }
  }, [isAuthenticated, token]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">LocalFinder</h1>
              <Badge variant="secondary" className="text-xs">
                Find Services
              </Badge>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground hidden sm:flex">
                <User className="h-4 w-4" />
                <span>{userName || "Loading..."}</span>
              </div>

              <Button
                variant="outline"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="hidden sm:flex">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
