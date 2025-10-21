"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Building2,
  Settings,
  Shield,
  MessageSquare,
  Activity,
  Download,
  Upload,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ApiService from "@/lib/ApiServiceFunctions";
import {
  transformPartnerResponse,
  getCertificateStatus,
} from "@/lib/partnerDataTransform";
import ApiEndPoints from "@/lib/ApiServiceEndpoint";

// Organization type labels
const organizationTypeLabels = {
  regulatory: "Regulatory Agency",
  mah: "MAH",
  cro: "CRO",
  other: "Other",
};

function getStatusBadge(status) {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Active
        </Badge>
      );
    case "testing":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          Testing
        </Badge>
      );
    case "inactive":
      return (
        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
          Inactive
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export default function PartnerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCertReplaceDialog, setShowCertReplaceDialog] = useState(false);
  const [replaceCertType, setReplaceCertType] = useState(null);
  const [newCertFile, setNewCertFile] = useState(null);
  const [uploadingCert, setUploadingCert] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  // Fetch partner data on component mount
  useEffect(() => {
    const fetchPartner = async () => {
      if (!params.id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await ApiService.getPartner(params.id);

        if (response.error) {
          if (response.error.status === 404) {
            setError("Partner not found");
          } else {
            setError(response.error.message || "Failed to load partner");
          }
        } else {
          const transformedPartner = transformPartnerResponse(response.data);
          setPartner(transformedPartner);
          setEditData(transformedPartner);
        }
      } catch (err) {
        setError("Failed to load partner. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPartner();
  }, [params.id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      // Transform edit data to API format
      const { transformPartnerToEditForm, transformUpdatePartnerData } =
        await import("@/lib/partnerDataTransform");
      const apiFormData = transformUpdatePartnerData(
        transformPartnerToEditForm(editData)
      );

      const response = await ApiService.updatePartner(partner.id, apiFormData);

      if (response.error) {
        setError(response.error.message || "Failed to update partner");
        return;
      }

      // Update local state with new data
      const { transformPartnerResponse } = await import(
        "@/lib/partnerDataTransform"
      );
      const updatedPartner = transformPartnerResponse(response.data);
      setPartner(updatedPartner);
      setEditData(updatedPartner);
      setIsEditing(false);

      // Show success message (you could add a toast here)
      console.log("Partner updated successfully");
    } catch (err) {
      setError(err.message || "Failed to update partner. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(partner);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    setError(null);

    try {
      console.log({ id: partner.id });
      const response = await ApiService.deletePartner(partner.id);

      if (response.error) {
        setError(response.error.message || "Failed to delete partner");
        setShowDeleteDialog(false);
        return;
      }

      // Redirect to partners list on successful deletion
      router.push("/partners");
    } catch (err) {
      setError(err.message || "Failed to delete partner. Please try again.");
      setShowDeleteDialog(false);
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
  };

  const handleCertificateDownload = (certType) => {
    console.log("Downloading certificate:", certType);
    // TODO: Implement certificate download
  };

  const handleCertificateReplace = (certType) => {
    setReplaceCertType(certType);
    setNewCertFile(null);
    setShowCertReplaceDialog(true);
  };

  const handleCertificateFileChange = (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = [".pem", ".crt", ".cer"];
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
      setError(
        `Invalid file type. Please upload a ${allowedTypes.join(", ")} file.`
      );
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("File size too large. Please upload a file smaller than 5MB.");
      return;
    }

    setError(null);
    setNewCertFile(file);
  };

  const confirmCertificateReplace = async () => {
    if (!newCertFile || !replaceCertType) return;

    setUploadingCert(true);
    setError(null);

    try {
      const formData = new FormData();
      if (replaceCertType === "encryption") {
        formData.append("certificate_type", "encryption");
        formData.append("certificate_file", newCertFile);
      } else if (replaceCertType === "signing") {
        formData.append("certificate_type", "signing");
        formData.append("certificate_file", newCertFile);
      }

      const response = await ApiService.put(
        `${ApiEndPoints.PARTNERS.UPDATE_CERTIFICATE(params.id)}`,
        formData
      );

      if (response.error) {
        setError(response.error.message || "Failed to replace certificate");
        return;
      }

      const { transformPartnerResponse } = await import(
        "@/lib/partnerDataTransform"
      );
      const updatedPartner = transformPartnerResponse(response.data);
      setPartner(updatedPartner);
      setEditData(updatedPartner);

      setShowCertReplaceDialog(false);
      setNewCertFile(null);
      setReplaceCertType(null);

      console.log("Certificate replaced successfully");
    } catch (err) {
      setError(
        err.message || "Failed to replace certificate. Please try again."
      );
    } finally {
      setUploadingCert(false);
    }
  };

  const cancelCertificateReplace = () => {
    setShowCertReplaceDialog(false);
    setNewCertFile(null);
    setReplaceCertType(null);
    setError(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading partner details...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/partners">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Partner Details</h1>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // No partner found
  if (!partner) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/partners">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Partner Details</h1>
        </div>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Partner not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/partners">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {partner.name}
              </h1>
              {getStatusBadge(partner.status)}
            </div>
            <p className="text-muted-foreground">
              AS2 ID: {partner.as2Id} •{" "}
              {organizationTypeLabels[partner.organizationType] ||
                partner.organizationType}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Configuration
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Partner
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="mr-2 h-5 w-5" />
                  Partner Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="name">Partner Name</Label>
                      <Input
                        id="name"
                        value={editData.name || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        disabled={saving}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Name</Label>
                      <Input
                        id="contactName"
                        value={editData.contactName || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            contactName: e.target.value,
                          })
                        }
                        disabled={saving}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        value={editData.contactEmail || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            contactEmail: e.target.value,
                          })
                        }
                        disabled={saving}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        value={editData.contactPhone || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            contactPhone: e.target.value,
                          })
                        }
                        disabled={saving}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={editData.notes || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, notes: e.target.value })
                        }
                        disabled={saving}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Contact Name
                      </Label>
                      <p className="font-medium">{partner.contactName}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Contact Email
                      </Label>
                      <p className="font-medium">{partner.contactEmail}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Contact Phone
                      </Label>
                      <p className="font-medium">{partner.contactPhone}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Notes
                      </Label>
                      <p className="text-sm">{partner.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      1,247
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Messages Sent
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      98.5%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Success Rate
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      189
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Messages Received
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">2h</div>
                    <div className="text-sm text-muted-foreground">
                      Last Message
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4 text-muted-foreground">
                Recent activity will be displayed here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                AS2 Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      AS2 Station ID
                    </Label>
                    <p className="font-medium font-mono">
                      {partner.as2StationId}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Partner URL
                    </Label>
                    <p className="font-medium font-mono text-sm">
                      {partner.partnerUrl}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Subject Template
                    </Label>
                    <p className="font-medium text-sm">
                      {partner.subjectTemplate}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Encryption Algorithm
                    </Label>
                    <p className="font-medium">{partner.encryptionAlgorithm}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Signing Algorithm
                    </Label>
                    <p className="font-medium">{partner.signingAlgorithm}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Compression
                    </Label>
                    <p className="font-medium">
                      {partner.compression ? "Enabled (ZLIB)" : "Disabled"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">MDN Settings</h4>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Request Signed MDN
                      </Label>
                      <p className="font-medium">
                        {partner.requestSignedMdn ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Delivery Method
                      </Label>
                      <p className="font-medium">{partner.mdnDeliveryMethod}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Timeout
                      </Label>
                      <p className="font-medium">
                        {partner.mdnTimeout} minutes
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Signing Algorithm
                      </Label>
                      <p className="font-medium">
                        {partner.mdnSigningAlgorithm}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Auto Retry
                      </Label>
                      <p className="font-medium">
                        {partner.enableRetry ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                    {partner.enableRetry && (
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Retry Settings
                        </Label>
                        <p className="font-medium">
                          {partner.maxRetries} attempts, {partner.retryInterval}
                          min interval
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificates" className="space-y-6">
          <div className="grid gap-6">
            {/* Encryption Certificate */}
            {partner.encryptionCertExpiry && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Shield className="mr-2 h-5 w-5" />
                      Encryption Certificate
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-sm font-medium ${
                          getCertificateStatus(partner.encryptionCertExpiry)
                            .color
                        }`}
                      >
                        {
                          getCertificateStatus(partner.encryptionCertExpiry)
                            .text
                        }
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCertificateDownload("encryption")}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCertificateReplace("encryption")}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Replace
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Subject DN
                        </Label>
                        <p className="font-mono text-sm">
                          {partner.encryptionCertSubjectDn || "Not available"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Issuer DN
                        </Label>
                        <p className="font-mono text-sm">
                          {partner.encryptionCertIssuerDn || "Not available"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Valid To
                        </Label>
                        <p className="text-sm">
                          {new Date(
                            partner.encryptionCertExpiry
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Fingerprint
                        </Label>
                        <p className="font-mono text-xs break-all">
                          {partner.encryptionCertFingerprint || "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Signing Certificate */}
            {partner.signingCertExpiry && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Shield className="mr-2 h-5 w-5" />
                      Signing Certificate
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-sm font-medium ${
                          getCertificateStatus(partner.signingCertExpiry).color
                        }`}
                      >
                        {getCertificateStatus(partner.signingCertExpiry).text}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCertificateDownload("signing")}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCertificateReplace("signing")}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Replace
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Subject DN
                        </Label>
                        <p className="font-mono text-sm">
                          {partner.signingCertSubjectDn || "Not available"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Issuer DN
                        </Label>
                        <p className="font-mono text-sm">
                          {partner.signingCertIssuerDn || "Not available"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Valid To
                        </Label>
                        <p className="text-sm">
                          {new Date(
                            partner.signingCertExpiry
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Fingerprint
                        </Label>
                        <p className="font-mono text-xs break-all">
                          {partner.signingCertFingerprint || "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No certificates message */}
            {!partner.encryptionCertExpiry && !partner.signingCertExpiry && (
              <Card>
                <CardContent className="text-center py-8">
                  <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No Certificates Found
                  </h3>
                  <p className="text-muted-foreground">
                    No certificate information is available for this partner.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Message History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Message history will be implemented in a future update.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Activity log will be implemented in a future update.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Delete Partner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Are you sure you want to delete <strong>{partner.name}</strong>?
                This action cannot be undone and will remove all partner data
                including:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Partner configuration</li>
                <li>• Certificate information</li>
                <li>• Message history</li>
                <li>• Activity logs</li>
              </ul>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={cancelDelete}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Partner
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Certificate Replace Dialog */}
      {showCertReplaceDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Replace{" "}
                {replaceCertType === "encryption"
                  ? "Encryption"
                  : "Signing"}{" "}
                Certificate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label>Select New Certificate File</Label>
                <div
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add("border-primary");
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove("border-primary");
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove("border-primary");
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                      handleCertificateFileChange(files[0]);
                    }
                  }}
                >
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {newCertFile ? (
                      <span className="text-green-600 font-medium">
                        {newCertFile.name}
                      </span>
                    ) : (
                      "Drag and drop certificate file here, or click to browse"
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Accepts .pem, .crt, .cer files (max 5MB)
                  </p>
                  <input
                    type="file"
                    accept=".pem,.crt,.cer"
                    onChange={(e) =>
                      handleCertificateFileChange(e.target.files[0])
                    }
                    className="hidden"
                    id="cert-replace-upload"
                    disabled={uploadingCert}
                  />
                  <Button
                    variant="outline"
                    className="mt-2"
                    disabled={uploadingCert}
                    onClick={() =>
                      document.getElementById("cert-replace-upload").click()
                    }
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {newCertFile ? "Change File" : "Browse Files"}
                  </Button>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={cancelCertificateReplace}
                  disabled={uploadingCert}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmCertificateReplace}
                  disabled={!newCertFile || uploadingCert}
                >
                  {uploadingCert ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Replace Certificate
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
