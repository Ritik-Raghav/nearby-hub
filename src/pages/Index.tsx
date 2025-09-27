import React, { useState } from "react";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/ServiceCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { MapView } from "@/components/MapView";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Filter, SlidersHorizontal } from "lucide-react";
import heroImage from "@/assets/hero-services.jpg";

// Mock data for demonstration
const mockServices = [
  {
    name: "Expert Plumbing Solutions",
    category: "Plumbing",
    rating: 4.8,
    reviews: 127,
    distance: "0.8 km",
    address: "123 Main Street, Downtown",
    phone: "+1 (555) 123-4567",
    isOpen: true,
    image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=400&fit=crop&crop=center"
  },
  {
    name: "MathGenius Tuition Center",
    category: "Education",
    rating: 4.9,
    reviews: 89,
    distance: "1.2 km",
    address: "456 Education Ave, Uptown",
    phone: "+1 (555) 987-6543",
    isOpen: true,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=400&fit=crop&crop=center"
  },
  {
    name: "PowerFlow Electricians",
    category: "Electrical",
    rating: 4.7,
    reviews: 156,
    distance: "2.1 km",
    address: "789 Electric Blvd, Midtown",
    phone: "+1 (555) 456-7890",
    isOpen: false,
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=400&fit=crop&crop=center"
  },
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent" />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl space-y-6">
            <div className="space-y-4">
              <Badge variant="outline" className="w-fit bg-background/50 backdrop-blur-sm">
                🔍 Discover Local Services
              </Badge>
              <h1 className="text-5xl font-bold text-foreground leading-tight">
                Find Nearby
                <span className="bg-gradient-primary bg-clip-text text-transparent"> Services</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Connect with trusted local professionals for tuitions, plumbing, electrical work, and more in your area.
              </p>
            </div>
            
            <div className="flex gap-3 max-w-xl">
              <SearchInput
                placeholder="Search for services, locations..."
                className="flex-1 bg-background/80 backdrop-blur-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300 px-8">
                <MapPin className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <div className="bg-gradient-card rounded-2xl p-6 shadow-card border border-border/50">
                <CategoryFilter 
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>
              
              <div className="bg-gradient-card rounded-2xl p-6 shadow-card border border-border/50">
                <h3 className="font-semibold text-lg text-foreground mb-4">Filters</h3>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Distance
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Filter className="h-4 w-4 mr-2" />
                    Rating
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Filter className="h-4 w-4 mr-2" />
                    Price Range
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Services List */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">
                    Nearby Services
                  </h2>
                  <Badge variant="outline" className="bg-background">
                    {mockServices.length} results
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {mockServices.map((service, index) => (
                    <ServiceCard key={index} {...service} />
                  ))}
                </div>
              </div>

              {/* Map */}
              <div className="h-[600px]">
                <MapView />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
