import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const ProviderCard = ({ provider }) => {
  return (
    <Card className="p-5 rounded-3xl shadow-lg border border-gray-200 hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50">
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 flex-shrink-0">
          <img
            src={provider.profileImage || "/default-profile.png"}
            alt={provider.name}
            className="w-full h-full rounded-full object-cover border-2 border-white shadow-md"
          />
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm" title="Available" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{provider.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{provider.category}</p>
          <p className="text-sm text-gray-400 mt-1 truncate max-w-md">{provider.address}</p>
        </div>

            <Badge className="text-sm px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md">
              \u2b50 {provider.rating != null ? Number(provider.rating).toFixed(1) : "0.0"}
        </Badge>
      </div>

      <p className="mt-4 text-sm text-gray-600 leading-relaxed line-clamp-3">
        {provider.description || "No description available."}
      </p>

      <div className="mt-4 flex gap-2">
        <Badge className="px-3 py-1 text-sm bg-blue-50 text-blue-600">Available</Badge>
        <Badge className="px-3 py-1 text-sm bg-green-50 text-green-600">Trusted</Badge>
      </div>
    </Card>
  );
};
