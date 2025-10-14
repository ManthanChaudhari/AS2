"use client";


import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import {
  Building2,
  User,
  Mail,
  FileCheck,
  CheckCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Waves,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FadeIn, AnimatedButton } from "@/components/ui/animations";
import { MinimalCard } from "@/components/ui/minimal-animations";

// Step schemas
const step1Schema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  country: z.string().min(1, "Please select a country"),
  industryType: z.string().min(1, "Please select an industry type"),
});

const step2Schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'Password must contain uppercase, lowercase, number and special character'
    ),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const step3Schema = z.object({
  verificationCode: z.string().length(6, "Verification code must be 6 digits"),
});

const step4Schema = z.object({
  acceptTerms: z.coerce.boolean().refine(val => val === true, {
    message: 'You must accept the terms of service',
  }),
  acceptPrivacy: z.coerce.boolean().refine(val => val === true, {
    message: 'You must accept the privacy policy',
  }),
  signature: z.string().min(2, 'Please provide your digital signature'),
});

// Dummy data
const countries = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "au", label: "Australia" },
];

const industryTypes = [
  { value: "pharmaceutical", label: "Pharmaceutical Company" },
  { value: "biotech", label: "Biotechnology" },
  { value: "cro", label: "Contract Research Organization" },
  { value: "regulatory", label: "Regulatory Consulting" },
  { value: "other", label: "Other" },
];

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // Forms for each step
  const step1Form = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      companyName: "",
      address: "",
      city: "",
      country: "",
      industryType: "",
    },
  });

  const step2Form = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const step3Form = useForm({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      verificationCode: "",
    },
  });

  const step4Form = useForm({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      acceptTerms: false,
      acceptPrivacy: false,
      signature: "",
    },
  });

  const steps = [
    { number: 1, title: "Company Details", icon: Building2, form: step1Form },
    { number: 2, title: "Admin User", icon: User, form: step2Form },
    { number: 3, title: "Email Verification", icon: Mail, form: step3Form },
    { number: 4, title: "Terms & Signature", icon: FileCheck, form: step4Form },
  ];

  const currentForm = steps[currentStep - 1].form;

  const onStepSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (currentStep === 2) {
        // Send verification email
        setVerificationSent(true);
        console.log("Verification email sent to:", data.email);
      }

      if (currentStep === 4) {
        // Complete registration
        setRegistrationComplete(true);
        console.log("Registration completed successfully");
        return;
      }

      // Move to next step
      setCurrentStep((prev) => prev + 1);
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const resendVerification = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Verification code resent");
      setVerificationSent(true);
    } catch (err) {
      setError("Failed to resend verification code");
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationComplete) {
    return (
      <MinimalCard className="w-full shadow-xl backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-ocean-200 dark:border-ocean-800">
        <CardHeader className="text-center space-y-4">
          <FadeIn delay={100}>
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 ring-4 ring-green-200 dark:ring-green-800">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
              Registration Successful!
            </CardTitle>
            <CardDescription className="text-ocean-600 dark:text-ocean-300">
              Your AS2 Pharmacovigilance Portal account has been created successfully.
            </CardDescription>
          </FadeIn>
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          <FadeIn delay={300}>
            <div className="rounded-lg bg-ocean-50 dark:bg-ocean-900/20 p-6 border border-ocean-200 dark:border-ocean-800">
              <h3 className="font-semibold text-ocean-800 dark:text-ocean-200 mb-3">
                What's Next?
              </h3>
              <ul className="text-sm text-ocean-700 dark:text-ocean-300 space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-ocean-600 rounded-full" />
                  Your tenant ID has been generated
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-ocean-600 rounded-full" />
                  Default roles and permissions have been set up
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-ocean-600 rounded-full" />
                  You can now start adding trading partners
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-ocean-600 rounded-full" />
                  Configure your AS2 certificates
                </li>
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={400}>
            <AnimatedButton asChild className="w-full bg-ocean-600 hover:bg-ocean-700 text-white font-medium py-3 transition-colors-minimal">
              <Link href="/login">Continue to Login</Link>
            </AnimatedButton>
          </FadeIn>
        </CardContent>
      </MinimalCard>
    );
  }

  return (
    <MinimalCard className="w-full max-w-2xl mx-auto shadow-xl backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-ocean-200 dark:border-ocean-800">
      <CardHeader className="space-y-6">
        <FadeIn delay={100}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ocean-100 dark:bg-ocean-900 ring-2 ring-ocean-200 dark:ring-ocean-800">
                {React.createElement(steps[currentStep - 1].icon, {
                  className: "h-6 w-6 text-ocean-600 dark:text-ocean-400",
                })}
              </div>
              <div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-ocean-700 to-ocean-500 bg-clip-text text-transparent">
                  Step {currentStep} of 4: {steps[currentStep - 1].title}
                </CardTitle>
                <CardDescription className="text-ocean-600 dark:text-ocean-300">
                  Create your AS2 Pharmacovigilance Portal account
                </CardDescription>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ocean-600 text-white text-sm font-bold">
              {currentStep}
            </div>
          </div>
        </FadeIn>

        {/* Enhanced Progress bar */}
        <FadeIn delay={200}>
          <div className="space-y-3">
            <div className="relative">
              <Progress 
                value={(currentStep / 4) * 100} 
                className="w-full h-2 bg-ocean-100 dark:bg-ocean-900"
              />
              <div 
                className="absolute top-0 left-0 h-2 bg-gradient-to-r from-ocean-500 to-ocean-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`flex flex-col items-center space-y-1 ${
                    currentStep >= step.number 
                      ? "text-ocean-600 dark:text-ocean-400" 
                      : "text-muted-foreground"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    currentStep >= step.number 
                      ? "bg-ocean-600" 
                      : "bg-muted-foreground/30"
                  }`} />
                  <span className="font-medium">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </CardHeader>

      <form onSubmit={currentForm.handleSubmit(onStepSubmit)}>
        <CardContent className="space-y-6">
          <FadeIn delay={300}>
            {error && (
              <Alert variant="destructive" className="animate-slide-in">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </FadeIn>

          {/* Step 1: Company Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <FadeIn delay={400}>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-ocean-700 dark:text-ocean-300 font-medium">
                      Company Name *
                    </Label>
                    <Input
                      id="companyName"
                      placeholder="Acme Pharmaceuticals Inc."
                      {...step1Form.register("companyName")}
                      disabled={isLoading}
                      className="transition-colors-minimal focus:border-ocean-500 focus:ring-ocean-500 border-ocean-200 dark:border-ocean-700"
                    />
                    {step1Form.formState.errors.companyName && (
                      <p className="text-sm text-red-600 dark:text-red-400 animate-slide-in">
                        {step1Form.formState.errors.companyName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-ocean-700 dark:text-ocean-300 font-medium">
                      Address *
                    </Label>
                    <Textarea
                      id="address"
                      placeholder="123 Main Street, Suite 100"
                      {...step1Form.register("address")}
                      disabled={isLoading}
                      className="transition-colors-minimal focus:border-ocean-500 focus:ring-ocean-500 border-ocean-200 dark:border-ocean-700 min-h-[80px]"
                    />
                    {step1Form.formState.errors.address && (
                      <p className="text-sm text-red-600 dark:text-red-400 animate-slide-in">
                        {step1Form.formState.errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-ocean-700 dark:text-ocean-300 font-medium">
                        City *
                      </Label>
                      <Input
                        id="city"
                        placeholder="New York"
                        {...step1Form.register("city")}
                        disabled={isLoading}
                        className="transition-colors-minimal focus:border-ocean-500 focus:ring-ocean-500 border-ocean-200 dark:border-ocean-700"
                      />
                      {step1Form.formState.errors.city && (
                        <p className="text-sm text-red-600 dark:text-red-400 animate-slide-in">
                          {step1Form.formState.errors.city.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-ocean-700 dark:text-ocean-300 font-medium">
                        Country *
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          step1Form.setValue("country", value)
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger className="transition-colors-minimal focus:border-ocean-500 focus:ring-ocean-500 border-ocean-200 dark:border-ocean-700">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.value} value={country.value}>
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {step1Form.formState.errors.country && (
                        <p className="text-sm text-red-600 dark:text-red-400 animate-slide-in">
                          {step1Form.formState.errors.country.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industryType" className="text-ocean-700 dark:text-ocean-300 font-medium">
                      Industry Type *
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        step1Form.setValue("industryType", value)
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger className="transition-colors-minimal focus:border-ocean-500 focus:ring-ocean-500 border-ocean-200 dark:border-ocean-700">
                        <SelectValue placeholder="Select industry type" />
                      </SelectTrigger>
                      <SelectContent>
                        {industryTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {step1Form.formState.errors.industryType && (
                      <p className="text-sm text-red-600 dark:text-red-400 animate-slide-in">
                        {step1Form.formState.errors.industryType.message}
                      </p>
                    )}
                  </div>
                </div>
              </FadeIn>
            </div>
          )}

          {/* Step 2: Admin User */}
          {currentStep === 2 && (
            <FadeIn delay={400}>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-ocean-700 dark:text-ocean-300 font-medium">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      {...step2Form.register("firstName")}
                      disabled={isLoading}
                      className="transition-colors-minimal focus:border-ocean-500 focus:ring-ocean-500 border-ocean-200 dark:border-ocean-700"
                    />
                    {step2Form.formState.errors.firstName && (
                      <p className="text-sm text-red-600 dark:text-red-400 animate-slide-in">
                        {step2Form.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-ocean-700 dark:text-ocean-300 font-medium">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      {...step2Form.register("lastName")}
                      disabled={isLoading}
                      className="transition-colors-minimal focus:border-ocean-500 focus:ring-ocean-500 border-ocean-200 dark:border-ocean-700"
                    />
                    {step2Form.formState.errors.lastName && (
                      <p className="text-sm text-red-600 dark:text-red-400 animate-slide-in">
                        {step2Form.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-ocean-700 dark:text-ocean-300 font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@company.com"
                    {...step2Form.register("email")}
                    disabled={isLoading}
                    className="transition-colors-minimal focus:border-ocean-500 focus:ring-ocean-500 border-ocean-200 dark:border-ocean-700"
                  />
                  {step2Form.formState.errors.email && (
                    <p className="text-sm text-red-600 dark:text-red-400 animate-slide-in">
                      {step2Form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-ocean-700 dark:text-ocean-300 font-medium">
                    Password *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    {...step2Form.register("password")}
                    disabled={isLoading}
                    className="transition-colors-minimal focus:border-ocean-500 focus:ring-ocean-500 border-ocean-200 dark:border-ocean-700"
                  />
                  {step2Form.formState.errors.password && (
                    <p className="text-sm text-red-600 dark:text-red-400 animate-slide-in">
                      {step2Form.formState.errors.password.message}
                    </p>
                  )}
                  <p className="text-xs text-ocean-600 dark:text-ocean-400">
                    Must contain uppercase, lowercase, number and special character
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-ocean-700 dark:text-ocean-300 font-medium">
                    Confirm Password *
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    {...step2Form.register("confirmPassword")}
                    disabled={isLoading}
                    className="transition-colors-minimal focus:border-ocean-500 focus:ring-ocean-500 border-ocean-200 dark:border-ocean-700"
                  />
                  {step2Form.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-600 dark:text-red-400 animate-slide-in">
                      {step2Form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </FadeIn>
          )}

          {/* Step 3: Email Verification */}
          {currentStep === 3 && (
            <FadeIn delay={400}>
              <div className="space-y-6 text-center">
                {verificationSent && (
                  <Alert className="border-ocean-200 bg-ocean-50 text-ocean-800 dark:border-ocean-800 dark:bg-ocean-950 dark:text-ocean-200 animate-slide-in">
                    <Mail className="h-4 w-4 text-ocean-600 dark:text-ocean-400" />
                    <AlertDescription>
                      Verification code sent to your email address
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3">
                  <Label htmlFor="verificationCode" className="text-ocean-700 dark:text-ocean-300 font-medium">
                    Verification Code *
                  </Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    className="text-center text-lg tracking-widest transition-colors-minimal focus:border-ocean-500 focus:ring-ocean-500 border-ocean-200 dark:border-ocean-700"
                    {...step3Form.register("verificationCode")}
                    disabled={isLoading}
                  />
                  {step3Form.formState.errors.verificationCode && (
                    <p className="text-sm text-red-600 dark:text-red-400 animate-slide-in">
                      {step3Form.formState.errors.verificationCode.message}
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={resendVerification}
                  disabled={isLoading}
                  className="text-ocean-600 hover:text-ocean-700 hover:bg-ocean-50 dark:text-ocean-400 dark:hover:text-ocean-300 dark:hover:bg-ocean-900 transition-colors-minimal"
                >
                  Resend verification code
                </Button>
              </div>
            </FadeIn>
          )}

          {/* Step 4: Terms & Signature */}
          {currentStep === 4 && (
            <FadeIn delay={400}>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Controller
                      name="acceptTerms"
                      control={step4Form.control}
                      render={({ field }) => (
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="acceptTerms"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                            className="border-ocean-300 data-[state=checked]:bg-ocean-600 data-[state=checked]:border-ocean-600 mt-0.5"
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="acceptTerms" className="text-sm text-ocean-700 dark:text-ocean-300">
                              I accept the{" "}
                              <Link
                                href="/terms"
                                className="text-ocean-600 hover:text-ocean-500 dark:text-ocean-400 dark:hover:text-ocean-300 underline transition-colors-minimal"
                              >
                                Terms of Service
                              </Link>
                            </Label>
                          </div>
                        </div>
                      )}
                    />
                  </div>
                  {step4Form.formState.errors.acceptTerms && (
                    <p className="text-sm text-red-600 dark:text-red-400 animate-slide-in">
                      {step4Form.formState.errors.acceptTerms.message}
                    </p>
                  )}

                  <div className="flex items-start space-x-3">
                    <Controller
                      name="acceptPrivacy"
                      control={step4Form.control}
                      render={({ field }) => (
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="acceptPrivacy"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                            className="border-ocean-300 data-[state=checked]:bg-ocean-600 data-[state=checked]:border-ocean-600 mt-0.5"
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="acceptPrivacy" className="text-sm text-ocean-700 dark:text-ocean-300">
                              I accept the{" "}
                              <Link
                                href="/privacy"
                                className="text-ocean-600 hover:text-ocean-500 dark:text-ocean-400 dark:hover:text-ocean-300 underline transition-colors-minimal"
                              >
                                Privacy Policy
                              </Link>
                            </Label>
                          </div>
                        </div>
                      )}
                    />
                  </div>
                  {step4Form.formState.errors.acceptPrivacy && (
                    <p className="text-sm text-red-600 dark:text-red-400 animate-slide-in">
                      {step4Form.formState.errors.acceptPrivacy.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signature" className="text-ocean-700 dark:text-ocean-300 font-medium">
                    Digital Signature *
                  </Label>
                  <Input
                    id="signature"
                    placeholder="Type your full name as digital signature"
                    {...step4Form.register("signature")}
                    disabled={isLoading}
                    className="transition-colors-minimal focus:border-ocean-500 focus:ring-ocean-500 border-ocean-200 dark:border-ocean-700"
                  />
                  {step4Form.formState.errors.signature && (
                    <p className="text-sm text-red-600 dark:text-red-400 animate-slide-in">
                      {step4Form.formState.errors.signature.message}
                    </p>
                  )}
                  <p className="text-xs text-ocean-600 dark:text-ocean-400">
                    By typing your name, you agree to the electronic signature of this agreement
                  </p>
                </div>
              </div>
            </FadeIn>
          )}
        </CardContent>

        <div className="flex justify-between p-6 pt-0">
          <FadeIn delay={500}>
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={currentStep === 1 || isLoading}
              className="border-ocean-200 text-ocean-700 hover:bg-ocean-50 dark:border-ocean-700 dark:text-ocean-300 dark:hover:bg-ocean-900 transition-colors-minimal"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </FadeIn>

          <FadeIn delay={600}>
            <AnimatedButton 
              type="submit" 
              disabled={isLoading}
              className="bg-ocean-600 hover:bg-ocean-700 text-white font-medium transition-colors-minimal"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {currentStep === 4 ? "Complete Registration" : "Continue"}
              {currentStep < 4 && <ArrowRight className="ml-2 h-4 w-4" />}
            </AnimatedButton>
          </FadeIn>
        </div>
      </form>

      <FadeIn delay={700}>
        <div className="px-6 pb-6 text-center text-sm text-ocean-600 dark:text-ocean-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-ocean-700 hover:text-ocean-600 dark:text-ocean-300 dark:hover:text-ocean-200 font-medium transition-colors-minimal"
          >
            Sign in here
          </Link>
        </div>
      </FadeIn>
    </MinimalCard>
  );
}
