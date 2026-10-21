// SAAHARA AI Data Models - AZINHACK '26

export type BroadCategory = 
  | 'school_student' 
  | 'college_student' 
  | 'working_professional' 
  | 'self_employed' 
  | 'other';

export type AgeGroup = 
  | 'under_18' 
  | '18_24' 
  | '25_34' 
  | '35_49' 
  | '50_plus';

export type ObservationCategory = 
  | 'street_lighting' 
  | 'public_transport_stop' 
  | 'infrastructure_problem' 
  | 'accessibility' 
  | 'community_observation' 
  | 'other_concern';

export type ReportStatus = 
  | 'newly_reported' 
  | 'awaiting_confirmation' 
  | 'recently_corroborated' 
  | 'official_update_available' 
  | 'community_reports_improvement' 
  | 'condition_uncertain' 
  | 'needs_recheck' 
  | 'current_condition_unknown';

export interface PrivacyPreferences {
  shareApproximateAreaOnly: boolean;
  hideDailyTravelRoutines: boolean;
  requireMutualConsentForMessages: boolean;
  strictRideSharingPrivacy: boolean;
  allowWalkingCompanionDiscovery: boolean;
  allowAnonymousReports: boolean;
  enableNearbySafetyAlerts: boolean;
  alertRadiusKm: number;
}

export interface UserProfile {
  id: string;
  displayName: string;
  avatarUrl?: string;
  ageGroup?: AgeGroup;
  category: BroadCategory;
  broadField?: string; // e.g. "Software Engineering", "Architecture", "Medicine", "Humanities"
  approximateArea: string; // e.g. "Indiranagar, Bengaluru"
  bio?: string;
  isIdentityVerified: boolean; // Must reflect reality - false in prototype unless official KYC
  verificationBadgeDescription: string;
  emailOrPhoneVerified: boolean;
  verificationMethodNote: string;
  privacy: PrivacyPreferences;
  createdAt: string;
}

export interface ObservationHistoryEntry {
  id: string;
  observedAt: string;
  submittedAt: string;
  reportedBy: string;
  description: string;
  conditionOutcome: 'working' | 'defective' | 'improved' | 'concerning' | 'neutral';
  confirmationsCount: number;
  supportingSource?: string;
}

export interface SafetyObservation {
  id: string;
  issueId: string; // Stable issue ID for grouping
  normalizedLocation: string; // Normalized place key (e.g., "indira_gandhi_metro_station")
  category: ObservationCategory;
  approximateArea: string;
  city?: string;
  coordinates: [number, number]; // Centered on public junction/stop, never a private residence
  radiusMeters: number; // Uncertainty radius
  timeObserved: string;
  timeSubmitted: string;
  shortDescription: string;
  status: ReportStatus;
  confirmationsCount: number;
  supportingSource?: string;
  isInfrastructure: boolean; // Infrastructure ages differently from personal accounts
  isHistoricalConcern?: boolean; // Serious historical harassment reports that do not auto-disappear
  isAIProcessedSummary?: boolean;
  helpfulCount: number;
  observationsHistory: ObservationHistoryEntry[];
}

export interface InfrastructureReport extends SafetyObservation {
  assetType?: 'streetlight' | 'pavement' | 'bus_shelter' | 'cctv_zone' | 'drainage';
  municipalTicketId?: string;
  lastCivicCheckDate?: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorCategory: BroadCategory;
  authorField?: string;
  approximateArea: string;
  type: 'walking_companion' | 'public_meeting_point' | 'neighborhood_update' | 'transit_query';
  title: string;
  content: string;
  suggestedMeetingPoint?: string; // e.g., "Metro Station Gate 1, near ticket counter"
  plannedTime?: string;
  createdAt: string;
  responsesCount: number;
  status: 'open' | 'connected' | 'completed' | 'cancelled';
}

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserCategory: BroadCategory;
  fromUserArea: string;
  toUserId: string;
  toUserName: string;
  status: 'pending' | 'accepted' | 'declined' | 'ended';
  contextType: 'saheli_circle' | 'saheli_share';
  contextId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrivateChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  message: string;
  timestamp: string;
  isSystemNote?: boolean;
}

export interface RideRequest {
  id: string;
  userId: string;
  userName: string;
  userCategory: BroadCategory;
  userField?: string;
  userApproxArea: string;
  approxPickupArea: string;
  approxDestinationArea: string;
  travelDate: string;
  departureTimeWindow: string; // e.g., "8:30 PM - 9:00 PM"
  cabProvider?: string; // e.g. "Uber", "Ola", "Existing Booking"
  estimatedFare?: number;
  seatsAvailable: number;
  isOpenToSharing: boolean;
  notes?: string;
  status: 'open' | 'matched' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface RideMatch {
  matchId: string;
  targetRequest: RideRequest;
  compatibilityScore: number; // percentage
  overlapReason: string; // e.g., "Same departure window (8:30 PM) & heading towards Indiranagar Metro"
  approximateDistanceBetweenPickups: string; // "approx 400m"
}

export interface SharedTripDetails {
  requestId: string;
  connectionId: string;
  sharedByUserId: string;
  // Selectively disclosed fields
  cabProviderDisclosed: boolean;
  cabProvider?: string;
  driverNameDisclosed: boolean;
  driverName?: string; // User entered, marked as unverified
  vehicleRegDisclosed: boolean;
  vehicleRegNumber?: string; // User entered, unverified
  bookingRefDisclosed: boolean;
  bookingRef?: string;
  pickupSpotDisclosed: boolean;
  approxPickupSpot?: string;
  destinationDisclosed: boolean;
  approxDestination?: string;
  departureTimeDisclosed: boolean;
  departureTime?: string;
  estimatedFareDisclosed: boolean;
  estimatedFare?: number;
  agreedSplitAmount?: number;
  confirmedAt?: string;
  isSharingActive: boolean;
}

export interface FareSplitEstimate {
  totalEstimatedFare: number;
  passengerCount: number;
  equalSplitPerPassenger: number;
  customAgreedSplit?: Record<string, number>;
  disclaimer: string;
}

export interface SupportResource {
  id: string;
  name: string;
  issuingOrganization: string;
  category: 
    | 'emergency' 
    | 'police_authority' 
    | 'legal_aid' 
    | 'counseling_mental_health' 
    | 'evidence_preservation' 
    | 'cyber_safety';
  simpleExplanation: string; // Simple language explanation of what it helps with
  description: string;
  eligibility: string;
  contactNumber?: string;
  alternateContact?: string;
  officialSourceUrl: string;
  dateChecked: string;
  is24x7: boolean;
  coverage: string; // e.g., "Pan-India", "Karnataka State"
  verifiedBy: string;
  isSaved?: boolean;
}

export interface SourceVerification {
  url: string;
  domain: string;
  isOfficialGovDomain: boolean;
  lastCheckedDate: string;
  httpStatus: number;
}

export interface TinyFishResearchResult {
  query: string;
  category: string;
  status: 'live_result' | 'demo_curated_result';
  checkedDate: string;
  resources: Array<{
    name: string;
    organization: string;
    category: string;
    eligibilityInstructions: string;
    contactInfo: string;
    officialSourceUrl: string;
    dateChecked: string;
    verifiedFacts: string[];
    aiSummaryNotice: string;
  }>;
  executionNote: string;
}

export interface SearchableLocation {
  id: string;
  name: string;
  city: string;
  state: string;
  type: 'metro_station' | 'bus_stop' | 'bus_terminal' | 'junction' | 'underpass' | 'neighborhood' | 'public_landmark';
  coordinates: [number, number];
  aliases?: string[];
}

export interface NearbySafetyAlert {
  id: string;
  issueId: string;
  category: ObservationCategory;
  approximateLocation: string;
  reportAge: string;
  currentStatus: ReportStatus;
  message: string;
  timestamp: string;
  coordinates: [number, number];
}

// -------------------------------------------------------------
// ROUND 2: LIVE SAFETY INTELLIGENCE AGENT TYPES
// -------------------------------------------------------------

export type EvidenceState =
  | 'official_information_found'
  | 'community_report'
  | 'corroborated_by_independent_sources'
  | 'conflicting_information'
  | 'not_independently_verified'
  | 'source_unavailable_or_outdated';

export type EvidenceSourceType =
  | 'official_portal'
  | 'civic_body'
  | 'police_advisory'
  | 'transit_authority'
  | 'community_observation'
  | 'news_archival';

export interface IntelligenceEvidenceItem {
  id: string;
  title: string;
  sourceType: EvidenceSourceType;
  state: EvidenceState;
  summary: string;
  extractedText?: string;
  sourceUrl?: string;
  domain?: string;
  publishDate?: string;
  organization?: string;
  verifiedFacts: string[];
  notes?: string;
}

export interface ResearchPlanStep {
  stepNumber: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  targetQuery?: string;
  targetDomain?: string;
  findingsCount?: number;
}

export interface ConflictingClaim {
  id: string;
  issue: string;
  sourceA: { name: string; claim: string; url?: string };
  sourceB: { name: string; claim: string; url?: string };
  explanation: string;
}

export interface SafetyIntelligenceBriefing {
  query: string;
  approximateArea: string;
  observationId?: string;
  generatedAt: string;
  status: 'live_result' | 'demo_curated_result';
  summary: string;
  overallAssessment: string;
  researchPlan: ResearchPlanStep[];
  evidence: IntelligenceEvidenceItem[];
  conflicts: ConflictingClaim[];
  unverifiedGaps: string[];
  helplines: Array<{ name: string; contact: string; organization: string }>;
  cached?: boolean;
  executionNote: string;
  absenceOfDataNotice: string;
}

export type InvestigationProgressStage =
  | 'idle'
  | 'analyzing_query'
  | 'formulating_plan'
  | 'executing_search'
  | 'fetching_sources'
  | 'cross_referencing'
  | 'generating_briefing'
  | 'completed'
  | 'error';
