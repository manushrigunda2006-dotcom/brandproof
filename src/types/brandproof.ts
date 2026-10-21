export type Role = 'creator' | 'reviewer';

export type Channel = 'social' | 'blog' | 'press_release' | 'landing_page' | 'email_newsletter';

export type FindingCategory = 
  | 'restricted_claim' 
  | 'terminology' 
  | 'fact_verification' 
  | 'voice_tone' 
  | 'accessibility';

export type FindingSeverity = 'critical' | 'warning' | 'guidance';

export type FindingStatus = 'open' | 'applied' | 'dismissed';

export interface GuidelineReference {
  id: string;
  category: FindingCategory;
  title: string;
  source: string;
  version: string;
  reviewDate?: string;
  ruleSummary: string;
  legalRiskLevel?: 'high' | 'medium' | 'low';
}

export interface Finding {
  id: string;
  category: FindingCategory;
  severity: FindingSeverity;
  flaggedText: string;
  startIndex?: number;
  endIndex?: number;
  explanation: string;
  guidelineRef: GuidelineReference;
  suggestedCorrection?: string;
  status: FindingStatus;
  dismissReason?: string;
  comments: FindingComment[];
}

export interface FindingComment {
  id: string;
  author: string;
  role: Role;
  timestamp: string;
  text: string;
}

export type ReviewStatus = 'draft' | 'in_review' | 'changes_requested' | 'approved';

export interface ReviewComment {
  id: string;
  author: string;
  role: Role;
  timestamp: string;
  text: string;
}

export interface ReviewActivity {
  id: string;
  timestamp: string;
  author: string;
  role: Role;
  action: string;
  details?: string;
}

export interface LocalImageAttachment {
  name: string;
  size: number;
  type: string;
  dataUrl: string;
  altText: string;
  accessibilityNote?: string;
  uploadedAt: string;
}

export interface Review {
  id: string;
  title: string;
  channel: Channel;
  originalDraft: string;
  currentDraft: string;
  image?: LocalImageAttachment | null;
  status: ReviewStatus;
  findings: Finding[];
  comments: ReviewComment[];
  activities: ReviewActivity[];
  createdAt: string;
  updatedAt: string;
  submittedBy: string;
  reviewedBy?: string;
  approvalNote?: string;
  rejectionNote?: string;
}

// Brand Kit Data Structures
export interface ToneRule {
  id: string;
  title: string;
  rule: string;
  explanation: string;
  source: string;
  version: string;
  active: boolean;
}

export interface TerminologyItem {
  id: string;
  preferred: string;
  deprecated: string[];
  context: string;
  source: string;
  version: string;
  active: boolean;
}

export interface ApprovedFact {
  id: string;
  claimOrMetric: string;
  exactApprovedWording: string;
  source: string;
  version: string;
  reviewDate: string;
  active: boolean;
}

export interface RestrictedClaim {
  id: string;
  patternDescription: string;
  prohibitedPhrases: string[];
  requiredCaveat?: string;
  legalRiskLevel: 'high' | 'medium';
  source: string;
  version: string;
  active: boolean;
}

export interface AccessibilityGuideline {
  id: string;
  title: string;
  requirement: string;
  source: string;
  version: string;
  active: boolean;
}

export interface VisualAssetGuideline {
  id: string;
  assetName: string;
  specs: string;
  fileGuideline: string;
  source: string;
  version: string;
  previewBadge?: string;
  active: boolean;
}

export interface BrandKit {
  organizationName: string;
  lastUpdated: string;
  voiceRules: ToneRule[];
  terminology: TerminologyItem[];
  approvedFacts: ApprovedFact[];
  restrictedClaims: RestrictedClaim[];
  accessibilityGuidelines: AccessibilityGuideline[];
  visualAssets: VisualAssetGuideline[];
}

export type ActiveScreen = 'dashboard' | 'reviews' | 'brandkit' | 'insights' | 'new-review' | 'review-detail';
