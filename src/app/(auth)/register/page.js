"use client";

import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ErrorHandler from "@/lib/errorHandler";
import {
  Building2,
  User,
  Mail,
  FileCheck,
  CheckCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
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

// Step schemas
const step1Schema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  domain: z.string().min(3, "Domain must be at least 3 characters").regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid domain"),
  as2Identifier: z.string().min(3, "AS2 identifier must be at least 3 characters"),
  contactEmail: z.string().email("Please enter a valid contact email"),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
});

const step2Schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  adminEmail: z.string().email('Please enter a valid admin email address'),
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



export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationSent, setVerificationSent] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const router = useRouter();

  // Use the authentication hook
  const { register, isLoading, error: authError, clearError, isAuthenticated } = useAuth();
  const [localError, setLocalError] = useState("");

  // Combined error from auth hook and local state
  const error = authError || localError;

  // Forms for each step
  const step1Form = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      companyName: "",
      domain: "",
      as2Identifier: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
    },
  });

  const step2Form = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      adminEmail: "",
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
    // { number: 3, title: "Email Verification", icon: Mail, form: step3Form },
    // { number: 4, title: "Terms & Signature", icon: FileCheck, form: step4Form },
  ];

  const currentForm = steps[currentStep - 1].form;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
    setLocalError("");
  }, [clearError]);

  const onStepSubmit = async (data) => {
    setLocalError("");
    clearError();

    try {
      if (currentStep === 2) {
        // Collect all form data for registration
        const step1Data = step1Form.getValues();
        const registrationData = {
          // Required fields according to API
          company_name: step1Data.companyName,
          domain: step1Data.domain,
          as2_identifier: step1Data.as2Identifier,
          contact_email: step1Data.contactEmail,
          first_name: data.firstName,
          last_name: data.lastName,
          admin_email: data.adminEmail,
          password: data.password,
          // Optional fields
          contact_phone: step1Data.contactPhone || null,
          address: step1Data.address || null
        };

        console.log("Registration data being sent:", registrationData);
        const result = await register(registrationData);

        if (result.error) {
          console.error("Registration error:", result.error);
          setLocalError(ErrorHandler.getUserMessage(result));
          return;
        }

        // Registration successful, show verification step
        setVerificationSent(true);
        console.log("Registration successful, verification email sent");
        router.push("/login")
      }

      if (currentStep === 4) {
        // Complete registration process
        setRegistrationComplete(true);
        console.log("Registration completed successfully");
        return;
      }

      // Move to next step
      setCurrentStep((prev) => prev + 1);
    } catch (err) {
      setLocalError(err.message || "An error occurred. Please try again.");
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const resendVerification = async () => {
    setLocalError("");
    try {
      // In a real app, this would call an API to resend verification
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Verification code resent");
      setVerificationSent(true);
    } catch (err) {
      setLocalError("Failed to resend verification code");
    }
  };

  if (registrationComplete) {
    return (
      <Card className="w-full shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl text-green-600 dark:text-green-400">
            Registration Successful!
          </CardTitle>
          <CardDescription>
            Your AS2 Pharmacovigilance Portal account has been created
            successfully.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              What's Next?
            </h3>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <li>• Your tenant ID has been generated</li>
              <li>• Default roles and permissions have been set up</li>
              <li>• You can now start adding trading partners</li>
              <li>• Configure your AS2 certificates</li>
            </ul>
          </div>

          <div className="pt-4">
            <Button asChild className="w-full">
              <Link href="/login">Continue to Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              {React.createElement(steps[currentStep - 1].icon, {
                className: "h-4 w-4 text-blue-600 dark:text-blue-400",
              })}
            </div>
            <div>
              <CardTitle className="text-xl">
                Step {currentStep} of 4: {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription>
                Create your AS2 Pharmacovigilance Portal account
              </CardDescription>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <Progress value={(currentStep / 4) * 100} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground">
            {steps.map((step) => (
              <span
                key={step.number}
                className={currentStep >= step.number ? "text-primary" : ""}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>

      <form onSubmit={currentForm.handleSubmit(onStepSubmit)}>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Step 1: Company Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    placeholder="Acme Pharmaceuticals Inc."
                    {...step1Form.register("companyName")}
                    disabled={isLoading}
                  />
                  {step1Form.formState.errors.companyName && (
                    <p className="text-sm text-red-600">
                      {step1Form.formState.errors.companyName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domain">Company Domain *</Label>
                  <Input
                    id="domain"
                    placeholder="acmepharma.com"
                    {...step1Form.register("domain")}
                    disabled={isLoading}
                  />
                  {step1Form.formState.errors.domain && (
                    <p className="text-sm text-red-600">
                      {step1Form.formState.errors.domain.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="as2Identifier">AS2 Identifier *</Label>
                  <Input
                    id="as2Identifier"
                    placeholder="ACME_PHARMA_AS2"
                    {...step1Form.register("as2Identifier")}
                    disabled={isLoading}
                  />
                  {step1Form.formState.errors.as2Identifier && (
                    <p className="text-sm text-red-600">
                      {step1Form.formState.errors.as2Identifier.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Unique identifier for AS2 communications
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="contact@acmepharma.com"
                    {...step1Form.register("contactEmail")}
                    disabled={isLoading}
                  />
                  {step1Form.formState.errors.contactEmail && (
                    <p className="text-sm text-red-600">
                      {step1Form.formState.errors.contactEmail.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone (Optional)</Label>
                  <Input
                    id="contactPhone"
                    placeholder="+1 (555) 123-4567"
                    {...step1Form.register("contactPhone")}
                    disabled={isLoading}
                  />
                  {step1Form.formState.errors.contactPhone && (
                    <p className="text-sm text-red-600">
                      {step1Form.formState.errors.contactPhone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address (Optional)</Label>
                  <Textarea
                    id="address"
                    placeholder="123 Main Street, Suite 100, New York, NY 10001"
                    {...step1Form.register("address")}
                    disabled={isLoading}
                  />
                  {step1Form.formState.errors.address && (
                    <p className="text-sm text-red-600">
                      {step1Form.formState.errors.address.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Admin User */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    {...step2Form.register("firstName")}
                    disabled={isLoading}
                  />
                  {step2Form.formState.errors.firstName && (
                    <p className="text-sm text-red-600">
                      {step2Form.formState.errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    {...step2Form.register("lastName")}
                    disabled={isLoading}
                  />
                  {step2Form.formState.errors.lastName && (
                    <p className="text-sm text-red-600">
                      {step2Form.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email Address *</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="john.doe@company.com"
                  {...step2Form.register("adminEmail")}
                  disabled={isLoading}
                />
                {step2Form.formState.errors.adminEmail && (
                  <p className="text-sm text-red-600">
                    {step2Form.formState.errors.adminEmail.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  This will be your login email address
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  {...step2Form.register("password")}
                  disabled={isLoading}
                />
                {step2Form.formState.errors.password && (
                  <p className="text-sm text-red-600">
                    {step2Form.formState.errors.password.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Must contain uppercase, lowercase, number and special
                  character
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  {...step2Form.register("confirmPassword")}
                  disabled={isLoading}
                />
                {step2Form.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {step2Form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Email Verification */}
          {currentStep === 3 && (
            <div className="space-y-4 text-center">
              {verificationSent && (
                <Alert>
                  <Mail className="h-4 w-4" />
                  <AlertDescription>
                    Verification code sent to your email address
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="verificationCode">Verification Code *</Label>
                <Input
                  id="verificationCode"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  {...step3Form.register("verificationCode")}
                  disabled={isLoading}
                />
                {step3Form.formState.errors.verificationCode && (
                  <p className="text-sm text-red-600">
                    {step3Form.formState.errors.verificationCode.message}
                  </p>
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                onClick={resendVerification}
                disabled={isLoading}
              >
                Resend verification code
              </Button>
            </div>
          )}

          {/* Step 4: Terms & Signature */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Controller
                    name="acceptTerms"
                    control={step4Form.control}
                    render={({ field }) => (
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="acceptTerms"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor="acceptTerms" className="text-sm">
                            I accept the{" "}
                            <Link
                              href="/terms"
                              className="text-blue-600 hover:underline"
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
                  <p className="text-sm text-red-600">
                    {step4Form.formState.errors.acceptTerms.message}
                  </p>
                )}

                <div className="flex items-start space-x-2">
                  <Controller
                    name="acceptPrivacy"
                    control={step4Form.control}
                    render={({ field }) => (
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="acceptPrivacy"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor="acceptPrivacy" className="text-sm">
                            I accept the{" "}
                            <Link
                              href="/privacy"
                              className="text-blue-600 hover:underline"
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
                  <p className="text-sm text-red-600">
                    {step4Form.formState.errors.acceptPrivacy.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signature">Digital Signature *</Label>
                <Input
                  id="signature"
                  placeholder="Type your full name as digital signature"
                  {...step4Form.register("signature")}
                  disabled={isLoading}
                />
                {step4Form.formState.errors.signature && (
                  <p className="text-sm text-red-600">
                    {step4Form.formState.errors.signature.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  By typing your name, you agree to the electronic signature of
                  this agreement
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <div className="flex justify-between p-6 pt-0">
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            disabled={currentStep === 1 || isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {currentStep === 4 ? "Complete Registration" : "Continue"}
            {currentStep < 4 && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </form>

      <div className="px-6 pb-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Sign in here
        </Link>
      </div>
    </Card>
  );
}
