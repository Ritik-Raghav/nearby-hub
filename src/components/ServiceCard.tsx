import { Star, MapPin, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const baseImgUrl = import.meta.env.VITE_IMG_API_URL;

interface ServiceCardProps {
  id?: string;
  _id?: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  distance: string;
  address: string;
  mobile?: string;
  isOpen?: boolean;
  profileImage: string;
  onViewDetails?: (id: string) => void;
}

export const ServiceCard = ({
  id,
  _id,
  name,
  category,
  rating,
  reviews,
  distance,
  address,
  mobile,
  isOpen = true,
  profileImage,
  onViewDetails,
}: ServiceCardProps) => {
  const providerId = id || _id || "";
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/80 p-6 shadow-card transition-all duration-300 hover:shadow-elegant hover:-translate-y-1 border border-border/50">
      <div className="flex items-start gap-4">
        <div className="relative">
          <img
            src={profileImage ? `${baseImgUrl}${profileImage}` : "/default-image.png"}
            alt={name}
            className="h-16 w-16 rounded-xl object-cover shadow-sm"
          />
          <div className="absolute -top-1 -right-1">
            <Badge
              variant={isOpen ? "default" : "secondary"}
              className="text-xs px-0"
            >
              {isOpen ? "Open" : "Closed"}
            </Badge>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground">{category}</p>
            </div>
            <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-lg">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-medium text-sm">{rating}</span>
              {/* <span className="text-xs text-muted-foreground">({reviews})</span> */}
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{address}</span>
              <span className="text-primary font-medium ml-auto">
                {distance}
              </span>
            </div>

            {mobile && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>{mobile}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300"
              onClick={() => providerId && onViewDetails?.(providerId)}
            >
              View Details
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              Call Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
