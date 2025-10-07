import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  initialRating?: number;
  onRate: (rating: number) => void;
}

export const StarRating = ({ initialRating = 0, onRate }: StarRatingProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [rating, setRating] = useState(initialRating);

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <Star
          key={star}
          className={`h-6 w-6 cursor-pointer transition-colors ${
            (hovered ?? rating) >= star ? "text-yellow-400" : "text-gray-300 dark:text-gray-500"
          }`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => {
            setRating(star);
            onRate(star);
          }}
        />
      ))}
    </div>
  );
};
