import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wrench,
  GraduationCap,
  Zap,
  Paintbrush,
  Car,
  Scissors,
  Stethoscope,
  Home,
  ChefHat,
  Camera,
} from "lucide-react";

const baseCategories = [
  { id: "all", name: "All Services", icon: Home },
  { id: "plumber", name: "Plumbers", icon: Wrench },
  { id: "tuition", name: "Tuitions", icon: GraduationCap },
  { id: "electrician", name: "Electricians", icon: Zap },
  { id: "painter", name: "Painters", icon: Paintbrush },
  { id: "mechanic", name: "Mechanics", icon: Car },
  { id: "salon", name: "Salons", icon: Scissors },
  { id: "doctor", name: "Doctors", icon: Stethoscope },
  { id: "catering", name: "Catering", icon: ChefHat },
  { id: "photography", name: "Photography", icon: Camera },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  const [categories, setCategories] = useState(baseCategories);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const baseUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${baseUrl}/user/get-category-counts`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const data = await res.json();
        if (res.ok) {
          const counts = data.data || [];

          setCategories((prev) =>
            prev.map((cat) => {
              if (cat.id === "all") {
                const total = counts.reduce((sum, c) => sum + c.count, 0);
                return { ...cat, count: total };
              }

              const found = counts.find(
                (c) => c.category?.toLowerCase() === cat.id.toLowerCase()
              );
              return { ...cat, count: found ? found.count : 0 };
            })
          );
        }
      } catch (err) {
        console.error("Error fetching category counts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-foreground">Categories</h3>
      <div className="space-y-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;

          return (
            <Button
              key={category.id}
              variant={isSelected ? "default" : "ghost"}
              className={`w-full justify-between h-auto p-3 transition-colors duration-200 ${
                isSelected
                  ? "bg-gradient-primary text-primary-foreground shadow-glow"
                  : "hover:bg-muted/50 hover:text-foreground"
              }`}
              onClick={() => onCategoryChange(category.id)}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                <span className="font-medium">{category.name}</span>
              </div>
              <Badge
                variant={isSelected ? "secondary" : "outline"}
                className="text-xs"
              >
                {loading ? "..." : category.count ?? 0}
              </Badge>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
