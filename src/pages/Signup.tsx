import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MapPin, Eye, EyeOff, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      if (success) {
        navigate("/login", { replace: true });
      } else {
        setError("Failed to create account. Please try again.");
      }
    } catch (err: any) {
      console.error('Signup error details:', err);
      if (err.response?.data?.message) setError(err.response.data.message);
      else if (err.response?.status === 409) setError("An account with this email already exists.");
      else if (err.response?.status === 400) setError("Please check your information and try again.");
      else if (err.code === 'ECONNABORTED') setError("Request timed out. Please check your connection and try again.");
      else if (err.message === 'Network Error') setError("Network error. Please check your connection and try again.");
      else setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

    if (name === 'password') {
      setPasswordRequirements({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value),
      });
    }
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword &&
    formData.acceptTerms &&
    isPasswordValid;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
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
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="bg-gradient-card shadow-card border border-border/50">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                <MapPin className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-foreground">Join LocalFinder</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Create your account to discover local services
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name</label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="bg-background/50 backdrop-blur-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name</label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="bg-background/50 backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-background/50 backdrop-blur-sm"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="bg-background/50 backdrop-blur-sm pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                  </div>

                  {formData.password && (
                    <div className="space-y-2 p-3 bg-muted/50 rounded-md">
                      <p className="text-xs font-medium text-muted-foreground">Password requirements:</p>
                      <div className="space-y-1">
                        <div className={cn("flex items-center gap-2 text-xs", passwordRequirements.length ? "text-green-600" : "text-muted-foreground")}>
                          <Check className={cn("h-3 w-3", passwordRequirements.length ? "opacity-100" : "opacity-30")} />
                          At least 8 characters
                        </div>
                        <div className={cn("flex items-center gap-2 text-xs", passwordRequirements.uppercase ? "text-green-600" : "text-muted-foreground")}>
                          <Check className={cn("h-3 w-3", passwordRequirements.uppercase ? "opacity-100" : "opacity-30")} />
                          One uppercase letter
                        </div>
                        <div className={cn("flex items-center gap-2 text-xs", passwordRequirements.lowercase ? "text-green-600" : "text-muted-foreground")}>
                          <Check className={cn("h-3 w-3", passwordRequirements.lowercase ? "opacity-100" : "opacity-30")} />
                          One lowercase letter
                        </div>
                        <div className={cn("flex items-center gap-2 text-xs", passwordRequirements.number ? "text-green-600" : "text-muted-foreground")}>
                          <Check className={cn("h-3 w-3", passwordRequirements.number ? "opacity-100" : "opacity-30")} />
                          One number
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm Password</label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="bg-background/50 backdrop-blur-sm pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-destructive">Passwords do not match</p>
                  )}
                </div>

                {/* Terms */}
                <div className="flex items-start space-x-2">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    required
                    className="mt-1 rounded border-border"
                  />
                  <label htmlFor="acceptTerms" className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <Button variant="link" className="p-0 h-auto text-sm">Terms of Service</Button>{" "}
                    and{" "}
                    <Button variant="link" className="p-0 h-auto text-sm">Privacy Policy</Button>
                  </label>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300 disabled:opacity-50"
                  size="lg"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>

                {/* Provider Signup Link */}
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Are you a provider?{" "}
                    <Link to="/provider/signup" className="text-primary hover:underline font-medium">
                      Click here to sign up as a provider
                    </Link>
                  </p>
                </div>
              </form>

              {/* Divider */}
              {/* <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div> */}

              {/* Social Buttons
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">Google</Button>
                <Button variant="outline" className="w-full">Twitter</Button>
              </div> */}

              {/* Sign in link */}
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Signup;
