"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Eye, EyeOff, Shield, Loader2, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { FadeIn, AnimatedButton } from "@/components/ui/animations";
import { MinimalCard } from "@/components/ui/minimal-animations";

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().default(false),
});

const mfaSchema = z.object({
  mfaCode: z
    .string()
    .length(6, "MFA code must be 6 digits")
    .regex(/^\d+$/, "MFA code must contain only numbers"),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const router = useRouter();

  // Login form
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // MFA form
  const mfaForm = useForm({
    resolver: zodResolver(mfaSchema),
    defaultValues: {
      mfaCode: "",
    },
  });

  const onLoginSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate MFA requirement for demo
      setShowMFA(true);
      setIsLoading(false);

      // Simulate login failure for demo
      if (data.password === "wrong") {
        setLoginAttempts((prev) => prev + 1);
        throw new Error("Invalid email or password");
      }

      // Success - redirect to dashboard
      console.log('Login successful:', data)
      router.push('/dashboard')

    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')

      // Account lockout simulation
      if (loginAttempts >= 4) {
        setError(
          "Account locked due to too many failed attempts. Please contact support."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onMFASubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      // Simulate MFA verification
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Success - redirect to dashboard
      console.log("MFA verification successful");
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "MFA verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSO = () => {
    console.log("SSO login initiated");
    // In real app: redirect to SSO provider
  };

  if (showMFA) {
    return (
      <MinimalCard className="w-full shadow-xl backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-ocean-200 dark:border-ocean-800">
        <CardHeader className="text-center space-y-4">
          <FadeIn delay={100}>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ocean-100 dark:bg-ocean-900 ring-4 ring-ocean-200 dark:ring-ocean-800">
              <Shield className="h-8 w-8 text-ocean-600 dark:text-ocean-400" />
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-ocean-700 to-ocean-500 bg-clip-text text-transparent">
              Multi-Factor Authentication
            </CardTitle>
            <CardDescription className="text-ocean-600 dark:text-ocean-300">
              Enter the 6-digit code from your authenticator app
            </CardDescription>
          </FadeIn>
        </CardHeader>

        <form onSubmit={mfaForm.handleSubmit(onMFASubmit)}>
          <CardContent className="space-y-6">
            <FadeIn delay={300}>
              {error && (
                <Alert variant="destructive" className="animate-slide-in">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </FadeIn>

            <FadeIn delay={400}>
              <div className="space-y-2">
                <Label htmlFor="mfaCode" className="text-ocean-700 dark:text-ocean-300 font-medium">
                  Authentication Code
                </Label>
                <Input
                  id="mfaCode"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-lg tracking-widest transition-colors-minimal focus:border-ocean-500 focus:ring-ocean-500 border-ocean-200 dark:border-ocean-700"
                  {...mfaForm.register("mfaCode")}
                  disabled={isLoading}
                />
                {mfaForm.formState.errors.mfaCode && (
                  <p className="text-sm text-red-600 dark:text-red-400 animate-slide-in">
                    {mfaForm.formState.errors.mfaCode.message}
                  </p>
                )}
              </div>
            </FadeIn>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <FadeIn delay={500}>
              <AnimatedButton 
                type="submit" 
                className="w-full bg-ocean-600 hover:bg-ocean-700 text-white font-medium py-3 transition-colors-minimal" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify Code
              </AnimatedButton>
            </FadeIn>

            <FadeIn delay={600}>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-ocean-600 hover:text-ocean-700 hover:bg-ocean-50 dark:text-ocean-400 dark:hover:text-ocean-300 dark:hover:bg-ocean-900 transition-colors-minimal"
                onClick={() => setShowMFA(false)}
                disabled={isLoading}
              >
                Back to Login
              </Button>
            </FadeIn>
          </CardFooter>
        </form>
      </MinimalCard>
    );
  }

  return (
    <MinimalCard className="w-full shadow-xl backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-ocean-200 dark:border-ocean-800">
      <CardHeader className="text-center space-y-4">
        <FadeIn delay={100}>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ocean-100 dark:bg-ocean-900 ring-4 ring-ocean-200 dark:ring-ocean-800">
            <Waves className="h-8 w-8 text-ocean-600 dark:text-ocean-400" />
          </div>
        </FadeIn>
        <FadeIn delay={200}>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-ocean-700 to-ocean-500 bg-clip-text text-transparent">
            AS2 Pharmacovigilance Portal
          </CardTitle>
          <CardDescription className="text-ocean-600 dark:text-ocean-300 mt-2">
            Sign in to your account to manage secure file transmissions
          </CardDescription>
        </FadeIn>
      </CardHeader>

      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
        <CardContent className="space-y-6">
          <FadeIn delay={300}>
            {error && (
              <Alert variant="destructive" className="animate-slide-in">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loginAttempts > 0 && loginAttempts < 5 && (
              <Alert className="border-ocean-200 bg-ocean-50 text-ocean-800 dark:border-ocean-800 dark:bg-ocean-950 dark:text-ocean-200 animate-slide-in">
                <AlertDescription>
                  Warning: {loginAttempts} failed login attempt
                  {loginAttempts > 1 ? "s" : ""}. Account will be locked after 5
                  attempts.
                </AlertDescription>
              </Alert>
            )}
          </FadeIn>

          <FadeIn delay={400}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-ocean-700 dark:text-ocean-300 font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="user@company.com"
                {...loginForm.register("email")}
                disabled={isLoading}
                className="transition-colors-minimal focus:border-ocean-500 focus:ring-ocean-500 border-ocean-200 dark:border-ocean-700"
              />
              {loginForm.formState.errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400 animate-slide-in">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={500}>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-ocean-700 dark:text-ocean-300 font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...loginForm.register("password")}
                  disabled={isLoading}
                  className="transition-colors-minimal focus:border-ocean-500 focus:ring-ocean-500 border-ocean-200 dark:border-ocean-700 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-ocean-50 dark:hover:bg-ocean-900 text-ocean-600 dark:text-ocean-400 transition-colors-minimal"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-sm text-red-600 dark:text-red-400 animate-slide-in">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={600}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  {...loginForm.register("rememberMe")}
                  disabled={isLoading}
                  className="border-ocean-300 data-[state=checked]:bg-ocean-600 data-[state=checked]:border-ocean-600"
                />
                <Label htmlFor="rememberMe" className="text-sm text-ocean-700 dark:text-ocean-300">
                  Remember me
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-ocean-600 hover:text-ocean-500 dark:text-ocean-400 dark:hover:text-ocean-300 transition-colors-minimal font-medium"
              >
                Forgot password?
              </Link>
            </div>
          </FadeIn>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <FadeIn delay={700}>
            <AnimatedButton
              type="submit"
              className="w-full bg-ocean-600 hover:bg-ocean-700 text-white font-medium py-3 transition-colors-minimal"
              disabled={isLoading || loginAttempts >= 5}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </AnimatedButton>
          </FadeIn>

          <FadeIn delay={800}>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full border-ocean-200 dark:border-ocean-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-900 px-3 text-ocean-600 dark:text-ocean-400 font-medium">
                  Or continue with
                </span>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={900}>
            <Button
              type="button"
              variant="outline"
              className="w-full border-ocean-200 text-ocean-700 hover:bg-ocean-50 dark:border-ocean-700 dark:text-ocean-300 dark:hover:bg-ocean-900 transition-colors-minimal"
              onClick={handleSSO}
              disabled={isLoading}
            >
              Enterprise SSO
            </Button>
          </FadeIn>

          <FadeIn delay={1000}>
            <div className="text-center text-sm text-ocean-600 dark:text-ocean-400">
              New organization?{" "}
              <Link
                href="/register"
                className="text-ocean-700 hover:text-ocean-600 dark:text-ocean-300 dark:hover:text-ocean-200 font-medium transition-colors-minimal"
              >
                Register here
              </Link>
            </div>
          </FadeIn>
        </CardFooter>
      </form>
    </MinimalCard>
  );
}
