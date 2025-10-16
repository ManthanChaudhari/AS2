/**
 * Data transformation utilities for Partner API integration
 * Handles field mapping between UI components and OpenAPI schema
 */

/**
 * Transform UI form data to API create partner schema
 * Maps UI field names to Body_create_partner_api_partners__post schema
 */
export const transformCreatePartnerData = (formData) => {
  const apiData = new FormData();
  
  // Basic Information (Step 1)
  if (formData.partnerName) apiData.append('name', formData.partnerName);
  if (formData.organizationType) apiData.append('organization_type', formData.organizationType);
  if (formData.as2Identifier) apiData.append('as2_id', formData.as2Identifier);
  if (formData.contactName) apiData.append('contact_name', formData.contactName);
  if (formData.contactEmail) apiData.append('contact_email', formData.contactEmail);
  if (formData.contactPhone) apiData.append('contact_phone', formData.contactPhone);
  if (formData.notes) apiData.append('notes', formData.notes);
  
  // AS2 Configuration (Step 2)
  if (formData.partnerUrl) apiData.append('partner_as2_url', formData.partnerUrl);
  if (formData.subjectTemplate) apiData.append('message_subject_template', formData.subjectTemplate);
  if (formData.encryptionAlgorithm) apiData.append('encryption_algorithm', formData.encryptionAlgorithm);
  if (formData.signingAlgorithm) apiData.append('signing_algorithm', formData.signingAlgorithm);
  if (formData.compression !== undefined) apiData.append('compression', formData.compression);
  
  // MDN Settings (Step 4)
  if (formData.mdnDeliveryMethod) apiData.append('mdn_mode', formData.mdnDeliveryMethod);
  if (formData.requestSignedMdn !== undefined) apiData.append('mdn_signed', formData.requestSignedMdn);
  if (formData.mdnTimeout) apiData.append('mdn_receipt_timeout', formData.mdnTimeout);
  if (formData.mdnSigningAlgorithm) apiData.append('mdn_signed_algorithm', formData.mdnSigningAlgorithm);
  if (formData.enableRetry !== undefined) apiData.append('auto_retry', formData.enableRetry);
  if (formData.maxRetries) apiData.append('max_retry_attempts', formData.maxRetries);
  if (formData.retryInterval) apiData.append('retry_interval', formData.retryInterval);
  
  // Certificates (Step 3)
  if (formData.encryptionCert) apiData.append('encryption_certificate', formData.encryptionCert);
  if (formData.signingCert) apiData.append('signing_certificate', formData.signingCert);
  
  return apiData;
};

/**
 * Transform UI form data to API update partner schema
 * Maps UI field names to Body_update_partner_api_partners__partner_id__put schema
 */
export const transformUpdatePartnerData = (formData) => {
  const apiData = new FormData();
  
  // Only append fields that are provided (all fields are optional in update)
  if (formData.name !== undefined) apiData.append('name', formData.name);
  if (formData.organizationType !== undefined) apiData.append('organization_type', formData.organizationType);
  if (formData.as2Id !== undefined) apiData.append('as2_id', formData.as2Id);
  if (formData.contactName !== undefined) apiData.append('contact_name', formData.contactName);
  if (formData.contactEmail !== undefined) apiData.append('contact_email', formData.contactEmail);
  if (formData.contactPhone !== undefined) apiData.append('contact_phone', formData.contactPhone);
  if (formData.notes !== undefined) apiData.append('notes', formData.notes);
  if (formData.partnerUrl !== undefined) apiData.append('partner_as2_url', formData.partnerUrl);
  if (formData.subjectTemplate !== undefined) apiData.append('message_subject_template', formData.subjectTemplate);
  if (formData.encryptionAlgorithm !== undefined) apiData.append('encryption_algorithm', formData.encryptionAlgorithm);
  if (formData.signingAlgorithm !== undefined) apiData.append('signing_algorithm', formData.signingAlgorithm);
  if (formData.compression !== undefined) apiData.append('compression', formData.compression);
  if (formData.mdnMode !== undefined) apiData.append('mdn_mode', formData.mdnMode);
  if (formData.mdnSigned !== undefined) apiData.append('mdn_signed', formData.mdnSigned);
  if (formData.mdnTimeout !== undefined) apiData.append('mdn_receipt_timeout', formData.mdnTimeout);
  if (formData.mdnSigningAlgorithm !== undefined) apiData.append('mdn_signed_algorithm', formData.mdnSigningAlgorithm);
  if (formData.autoRetry !== undefined) apiData.append('auto_retry', formData.autoRetry);
  if (formData.maxRetries !== undefined) apiData.append('max_retry_attempts', formData.maxRetries);
  if (formData.retryInterval !== undefined) apiData.append('retry_interval', formData.retryInterval);
  
  // Certificates (if provided)
  if (formData.encryptionCert) apiData.append('encryption_certificate', formData.encryptionCert);
  if (formData.signingCert) apiData.append('signing_certificate', formData.signingCert);
  
  return apiData;
};

/**
 * Transform API partner response to UI display format
 * Maps PartnerResponse schema to UI component props
 */
export const transformPartnerResponse = (apiPartner) => {
  if (!apiPartner) return null;
  
  return {
    id: apiPartner.id,
    name: apiPartner.name,
    as2Id: apiPartner.as2_id,
    organizationType: apiPartner.organization_type,
    contactName: apiPartner.contact_name,
    contactEmail: apiPartner.contact_email,
    contactPhone: apiPartner.contact_phone,
    address: apiPartner.address,
    notes: apiPartner.notes,
    partnerUrl: apiPartner.partner_as2_url,
    as2StationId: apiPartner.as2_station_id,
    subjectTemplate: apiPartner.message_subject_template,
    encryptionAlgorithm: apiPartner.encryption_algorithm,
    signingAlgorithm: apiPartner.signing_algorithm,
    compression: apiPartner.compression,
    mdnDeliveryMethod: apiPartner.mdn_mode,
    requestSignedMdn: apiPartner.mdn_signed,
    mdnTimeout: apiPartner.mdn_receipt_timeout,
    mdnSigningAlgorithm: apiPartner.mdn_signed_algorithm,
    enableRetry: apiPartner.auto_retry,
    maxRetries: apiPartner.max_retry_attempts,
    retryInterval: apiPartner.retry_interval,
    status: apiPartner.status,
    isActive: apiPartner.is_active,
    createdAt: apiPartner.created_at,
    updatedAt: apiPartner.updated_at,
    lastTestDate: apiPartner.last_test_date,
    lastTestResult: apiPartner.last_test_result,
    
    // Certificate information
    encryptionCertExpiry: apiPartner.encryption_cert_expiry,
    signingCertExpiry: apiPartner.signing_cert_expiry,
    encryptionCertFingerprint: apiPartner.encryption_cert_fingerprint,
    signingCertFingerprint: apiPartner.signing_cert_fingerprint,
    encryptionCertSubjectDn: apiPartner.encryption_cert_subject_dn,
    signingCertSubjectDn: apiPartner.signing_cert_subject_dn,
    encryptionCertIssuerDn: apiPartner.encryption_cert_issuer_dn,
    signingCertIssuerDn: apiPartner.signing_cert_issuer_dn,
    
    // AWS-specific fields (for internal use)
    awsEncryptionCertificateId: apiPartner.aws_encryption_certificate_id,
    awsSigningCertificateId: apiPartner.aws_signing_certificate_id,
    awsPartnerProfileId: apiPartner.aws_partner_profile_id,
    awsAgreementId: apiPartner.aws_agreement_id,
    awsConnectorId: apiPartner.aws_connector_id,
    awsBaseDirectory: apiPartner.aws_base_directory,
    
    // Certificate content (for display/download)
    partnerEncryptionCertificate: apiPartner.partner_encryption_certificate,
    partnerSigningCertificate: apiPartner.partner_signing_certificate,
    endpointUrl: apiPartner.endpoint_url,
    tenantId: apiPartner.tenant_id
  };
};

/**
 * Transform array of API partner responses to UI display format
 */
export const transformPartnersResponse = (apiPartners) => {
  if (!Array.isArray(apiPartners)) return [];
  return apiPartners.map(transformPartnerResponse);
};

/**
 * Transform UI partner data back to API format for editing
 * Maps UI display format back to API update schema format
 */
export const transformPartnerToEditForm = (uiPartner) => {
  if (!uiPartner) return {};
  
  return {
    name: uiPartner.name,
    organizationType: uiPartner.organizationType,
    as2Id: uiPartner.as2Id,
    contactName: uiPartner.contactName,
    contactEmail: uiPartner.contactEmail,
    contactPhone: uiPartner.contactPhone,
    notes: uiPartner.notes,
    partnerUrl: uiPartner.partnerUrl,
    subjectTemplate: uiPartner.subjectTemplate,
    encryptionAlgorithm: uiPartner.encryptionAlgorithm,
    signingAlgorithm: uiPartner.signingAlgorithm,
    compression: uiPartner.compression,
    mdnMode: uiPartner.mdnDeliveryMethod,
    mdnSigned: uiPartner.requestSignedMdn,
    mdnTimeout: uiPartner.mdnTimeout,
    mdnSigningAlgorithm: uiPartner.mdnSigningAlgorithm,
    autoRetry: uiPartner.enableRetry,
    maxRetries: uiPartner.maxRetries,
    retryInterval: uiPartner.retryInterval
  };
};

/**
 * Calculate certificate expiration status
 */
export const getCertificateStatus = (expiryDate) => {
  if (!expiryDate) {
    return { status: 'unknown', color: 'text-gray-600 dark:text-gray-400', text: 'Unknown' };
  }
  
  const expiry = new Date(expiryDate);
  const now = new Date();
  const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) {
    return { status: 'expired', color: 'text-red-600 dark:text-red-400', text: 'Expired' };
  } else if (daysUntilExpiry <= 30) {
    return { status: 'expiring', color: 'text-yellow-600 dark:text-yellow-400', text: `${daysUntilExpiry} days` };
  } else {
    return { status: 'valid', color: 'text-green-600 dark:text-green-400', text: `${daysUntilExpiry} days` };
  }
};

/**
 * Calculate partner statistics from partner list
 */
export const calculatePartnerStats = (partners) => {
  if (!Array.isArray(partners)) {
    return {
      total: 0,
      active: 0,
      testing: 0,
      inactive: 0,
      certificateAlerts: 0
    };
  }
  
  const stats = {
    total: partners.length,
    active: 0,
    testing: 0,
    inactive: 0,
    certificateAlerts: 0
  };
  
  partners.forEach(partner => {
    // Count by status
    switch (partner.status?.toLowerCase()) {
      case 'active':
        stats.active++;
        break;
      case 'testing':
        stats.testing++;
        break;
      case 'inactive':
        stats.inactive++;
        break;
    }
    
    // Count certificate alerts (expiring within 30 days)
    const encryptionStatus = getCertificateStatus(partner.encryptionCertExpiry);
    const signingStatus = getCertificateStatus(partner.signingCertExpiry);
    
    if (encryptionStatus.status === 'expired' || encryptionStatus.status === 'expiring' ||
        signingStatus.status === 'expired' || signingStatus.status === 'expiring') {
      stats.certificateAlerts++;
    }
  });
  
  return stats;
};