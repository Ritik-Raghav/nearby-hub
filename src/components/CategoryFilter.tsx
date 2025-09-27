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
  Camera
} from "lucide-react";

const categories = [
  { id: "all", name: "All Services", icon: Home, count: 1247 },
  { id: "plumbers", name: "Plumbers", icon: Wrench, count: 156 },
  { id: "tuitions", name: "Tuitions", icon: GraduationCap, count: 298 },
  { id: "electricians", name: "Electricians", icon: Zap, count: 89 },
  { id: "painters", name: "Painters", icon: Paintbrush, count: 67 },
  { id: "mechanics", name: "Mechanics", icon: Car, count: 134 },
  { id: "salon", name: "Salons", icon: Scissors, count: 78 },
  { id: "doctors", name: "Doctors", icon: Stethoscope, count: 203 },
  { id: "catering", name: "Catering", icon: ChefHat, count: 45 },
  { id: "photography", name: "Photography", icon: Camera, count: 34 },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
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
              className={`w-full justify-between h-auto p-3 ${
                isSelected 
                  ? "bg-gradient-primary text-primary-foreground shadow-glow" 
                  : "hover:bg-muted/50"
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
                {category.count}
              </Badge>
            </Button>
          );
        })}
      </div>
    </div>
  );
};