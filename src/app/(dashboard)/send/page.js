"use client"
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Send,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import ApiService from "@/lib/ApiServiceFunctions";
import { transformPartnersResponse } from "@/lib/partnerDataTransform";
import ApiEndPoints from "@/lib/ApiServiceEndpoint";

const steps = [
  { number: 1, title: "Partner", description: "Select trading partner" },
  { number: 2, title: "Upload", description: "Upload file" },
  { number: 3, title: "Configure", description: "Set message details" },
  { number: 4, title: "Review", description: "Review and confirm" },
  { number: 5, title: "Complete", description: "Transmission complete" },
];

export default function SendFilePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileMetadata, setFileMetadata] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [partnersData , setPartnerData] = useState([])

  const fetchPartners = async () => {
    try {
      // Fetch all partners (with a large page size to get all)
      const response = await ApiService.getPartners();

      if (response.error) {
        console.error("Failed to fetch partner stats:", response.error);
      } else {
        const transformedPartners = transformPartnersResponse(
          response.data.items || response.data.data || []
        );
        setPartnerData(transformedPartners);
      }
    } catch (err) {
      console.error("Error fetching partner stats:", err);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // React Hook Form
  const form = useForm({
    defaultValues: {
      subject: "",
      priority: "normal",
      notes: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const handlePartnerSelect = (partnerId) => {
    const partner = partnersData.find((p) => p.id === partnerId);
    setSelectedPartner(partner);
    setError("");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const processFile = (file) => {
    if (!file.name.endsWith(".xml")) {
      setError("Please upload an XML file");
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("File size exceeds 100MB limit");
      return;
    }

    setUploadedFile(file);
    setError("");

    // Simulate extracting metadata from XML
    setFileMetadata({
      senderId:
        "SENDER_" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      messageNumber: "MSG_" + Math.floor(Math.random() * 100000),
      caseIds: ["CASE001", "CASE002"],
      transmissionDate: new Date().toISOString(),
    });
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFileMetadata(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!selectedPartner) {
          setError("Please select a partner");
          return false;
        }
        break;
      case 2:
        if (!uploadedFile) {
          setError("Please upload a file");
          return false;
        }
        break;
      case 3:
        if (!watch("subject")?.trim()) {
          setError("Subject is required");
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      setError("");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError("");
  };

 const onSubmit = handleSubmit(async (data) => {
    
    const formData = new FormData();
    
    formData.append('partner_id', selectedPartner.id);
    formData.append('subject', data.subject);
    
    if (uploadedFile) {
      formData.append('file', uploadedFile);
    }
    
    // Simulate sending with fetch
    setIsLoading(true);

    const res = await ApiService.post(`${ApiEndPoints.AS2_TRANSMISSION.CREATE}` , formData);
    
    // Simulate API response
    setTimeout(() => {
      const result = {
        messageId: 'MSG_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        partner: selectedPartner.name,
        sentAt: new Date().toISOString(),
        status: 'sent'
      };
      
      setSendResult(result);
      setIsLoading(false);
      setCurrentStep(5);
      
      console.log('=== SEND RESULT ===');
      console.log(result);
      console.log('===================');
    }, 2000);
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Send File</h1>
        <p className="text-muted-foreground">
          Send ICSR or other pharmacovigilance files to your trading partners
        </p>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>
              Step {currentStep} of 5: {steps[currentStep - 1].title}
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {steps[currentStep - 1].description}
            </div>
          </div>
          <Progress value={(currentStep / 5) * 100} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            {steps.map((step) => (
              <span
                key={step.number}
                className={
                  currentStep >= step.number ? "text-primary font-medium" : ""
                }
              >
                {step.title}
              </span>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Step 1: Select Partner */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Select Partner</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose the trading partner to send the file to
                </p>
              </div>

              <div className="grid gap-4">
                {partnersData.map((partner) => (
                  <div
                    key={partner.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPartner?.id === partner.id
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => handlePartnerSelect(partner.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{partner.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          AS2 ID: {partner.as2Id}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline">
                            {partner.organizationType === "regulatory"
                              ? "Regulatory Agency"
                              : "MAH"}
                          </Badge>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            {partner.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        {partner.certificateStatus === "expiring" && (
                          <div className="flex items-center text-yellow-600 mb-2">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            <span className="text-xs">Cert Expiring</span>
                          </div>
                        )}
                        {selectedPartner?.id === partner.id && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Upload File */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Upload File</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Select the XML file to send to {selectedPartner?.name}
                </p>
              </div>

              {!uploadedFile ? (
                <div
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
                  onDrop={handleFileDrop}
                  onDragOver={handleDragOver}
                >
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Drop your file here
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    or click to browse files
                  </p>
                  <input
                    type="file"
                    accept=".xml"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      Browse Files
                    </label>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Accepts XML files up to 100MB
                  </p>
                </div>
              ) : (
                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <FileText className="h-8 w-8 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-medium">{uploadedFile.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(uploadedFile.size)} • XML File
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Modified:{" "}
                          {new Date(uploadedFile.lastModified).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {fileMetadata && (
                    <div className="mt-4 p-3 bg-muted/50 rounded">
                      <h4 className="font-medium text-sm mb-2">
                        File Metadata
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">
                            Sender ID:
                          </span>
                          <span className="ml-1 font-mono">
                            {fileMetadata.senderId}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Message Number:
                          </span>
                          <span className="ml-1 font-mono">
                            {fileMetadata.messageNumber}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Case IDs:
                          </span>
                          <span className="ml-1">
                            {fileMetadata.caseIds.join(", ")}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Transmission Date:
                          </span>
                          <span className="ml-1">
                            {new Date(
                              fileMetadata.transmissionDate
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Configure Message */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">
                  Configure Message
                </Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Set message details and delivery options
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Message Subject *</Label>
                  <Input
                    id="subject"
                    {...register("subject", {
                      required: "Subject is required",
                      minLength: {
                        value: 3,
                        message: "Subject must be at least 3 characters",
                      },
                    })}
                    placeholder="ICSR Submission - filename - date"
                  />
                  {errors.subject && (
                    <p className="text-sm text-red-600">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <RadioGroup
                    value={watch("priority")}
                    onValueChange={(value) => setValue("priority", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="normal" id="normal" />
                      <Label
                        htmlFor="normal"
                        className="font-normal cursor-pointer"
                      >
                        Normal
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="urgent" id="urgent" />
                      <Label
                        htmlFor="urgent"
                        className="font-normal cursor-pointer"
                      >
                        Urgent
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Optional Message Notes</Label>
                  <Textarea
                    id="notes"
                    {...register("notes")}
                    placeholder="Additional notes for this transmission..."
                    rows={3}
                  />
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Delivery Options</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Request Signed MDN:</span>
                      <Badge variant="outline">Yes</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>MDN Delivery Method:</span>
                      <Badge variant="outline">Synchronous</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Encryption:</span>
                      <Badge variant="outline">AES-256</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Signing:</span>
                      <Badge variant="outline">SHA-256</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Send */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Review & Send</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Review all details before sending
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Transmission Summary</h4>
                  <div className="grid gap-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Partner:</span>
                      <span className="font-medium">
                        {selectedPartner?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">File:</span>
                      <span className="font-medium">{uploadedFile?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span>
                        {uploadedFile
                          ? formatFileSize(uploadedFile.size)
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subject:</span>
                      <span className="font-medium">{watch("subject")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Priority:</span>
                      <Badge
                        variant={
                          watch("priority") === "urgent"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {watch("priority")}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Encryption:</span>
                      <span>AES-256</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Signing:</span>
                      <span>SHA-256</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Estimated Send Time:
                      </span>
                      <span>~5 seconds</span>
                    </div>
                  </div>
                </div>

                {watch("notes") && (
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Message Notes</h4>
                    <p className="text-sm text-muted-foreground">
                      {watch("notes")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {currentStep === 5 && sendResult && (
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
                  Message Sent Successfully!
                </h3>
                <p className="text-muted-foreground">
                  Your file has been sent to {sendResult.partner}
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Message ID:</span>
                    <span className="font-mono">{sendResult.messageId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sent to:</span>
                    <span className="font-medium">{sendResult.partner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      Awaiting MDN
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Timestamp:</span>
                    <span>{new Date(sendResult.sentAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4 pt-4">
                <Button onClick={() => alert("Navigate to /outbox")}>
                  View in Outbox
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Send Another File
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        {/* Navigation */}
        {currentStep < 5 && (
          <div className="flex justify-between p-6 pt-0">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !selectedPartner) ||
                  (currentStep === 2 && !uploadedFile) ||
                  (currentStep === 3 && !watch("subject"))
                }
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={onSubmit}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Send className="mr-2 h-4 w-4" />
                Send File
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
