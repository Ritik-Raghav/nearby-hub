import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { providerAPI } from "@/services/api";
import { Loader2 } from "lucide-react";

interface ProviderProfileFormProps {
  initialValues?: {
    name?: string;
    mobile?: string;
    category?: string;
    description?: string;
    price?: number | string;
    profileImage?: string;
  };
  onSaved?: () => void;
}

export const ProviderProfileForm: React.FC<ProviderProfileFormProps> = ({
  initialValues,
  onSaved,
}) => {
  const [name, setName] = useState(initialValues?.name || "");
  const [mobile, setMobile] = useState(initialValues?.mobile || "");
  const [category, setCategory] = useState(initialValues?.category || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [price, setPrice] = useState(String(initialValues?.price ?? ""));
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState(initialValues?.profileImage || "");
  const [saving, setSaving] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setProfileImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("mobile", mobile);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("price", price);

      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      const token = localStorage.getItem("providerToken");
      if (!token) throw new Error("No provider token found");

      await fetch(`${import.meta.env.VITE_API_URL}/provider/update-provider-profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      alert("Profile saved successfully!");
      if (onSaved) onSaved();
    } catch (err) {
      console.error("Failed to save provider profile", err);
      alert("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-8 rounded-3xl shadow-lg border border-border/30 bg-gradient-to-b from-background to-muted/30 transition-all hover:shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight">
            Provider Profile
          </h2>
          <p className="text-sm text-muted-foreground">
            Update your details to help customers find you easily.
          </p>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Service Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="h-11 rounded-xl border-border/40 bg-background focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="e.g. +91 9876543210"
              className="h-11 rounded-xl border-border/40 bg-background focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Service Category</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Plumber, Electrician"
              className="h-11 rounded-xl border-border/40 bg-background focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Your service price"
              className="h-11 rounded-xl border-border/40 bg-background focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="description">Service Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your services and experience..."
              className="min-h-[100px] rounded-xl border-border/40 bg-background focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="md:col-span-2 space-y-3">
            <Label htmlFor="profileImage">Profile Picture</Label>
            <div className="flex items-center gap-4">
              <Input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer h-11 rounded-xl border-border/40 bg-background"
              />
              {profileImagePreview && (
                <img
                  src={profileImagePreview}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/40"
                />
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="px-8 py-5 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium shadow-md hover:shadow-lg transition-all"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProviderProfileForm;
