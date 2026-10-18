// SAAHARA AI Local Reactive State & Persistence Service - AZINHACK '26
import {
  UserProfile,
  SafetyObservation,
  CommunityPost,
  ConnectionRequest,
  PrivateChatMessage,
  RideRequest,
  SharedTripDetails,
  SupportResource,
  ObservationHistoryEntry,
  ReportStatus,
  SearchableLocation,
  NearbySafetyAlert
} from '../types';
import {
  CURRENT_USER,
  SAMPLE_PEERS,
  INITIAL_OBSERVATIONS,
  INITIAL_COMMUNITY_POSTS,
  INITIAL_RIDE_REQUESTS,
  OFFICIAL_SUPPORT_RESOURCES,
  SEARCHABLE_LOCATIONS
} from '../data/sampleData';

const STORAGE_KEYS = {
  USER: 'saahara_user_profile',
  PEERS: 'saahara_sample_peers',
  OBSERVATIONS: 'saahara_observations',
  COMMUNITY_POSTS: 'saahara_community_posts',
  CONNECTIONS: 'saahara_connections',
  MESSAGES: 'saahara_messages',
  RIDE_REQUESTS: 'saahara_ride_requests',
  SHARED_TRIPS: 'saahara_shared_trips',
  RESOURCES: 'saahara_resources',
  SELECTED_LOCATION: 'saahara_selected_location',
  ROUTE_CHANGED: 'saahara_route_changed_demo',
  ONBOARDING_DONE: 'saahara_onboarding_completed',
  AUTH_SESSION: 'saahara_auth_session',
};

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach(fn => fn());
}

// Utility: Normalize location string for stable matching
export function normalizeLocationKey(loc: string): string {
  return loc
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim()
    .replace(/\s+/g, '_');
}

export const storageService = {
  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },

  // Onboarding & Auth State
  hasCompletedOnboarding(): boolean {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDING_DONE) === 'true';
  },

  setOnboardingCompleted(val: boolean): void {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_DONE, val ? 'true' : 'false');
    notify();
  },

  getAuthSession(): { isSignedIn: boolean; provider: string; email?: string } {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
    if (!raw) return { isSignedIn: true, provider: 'demo_guest' };
    try {
      return JSON.parse(raw);
    } catch {
      return { isSignedIn: true, provider: 'demo_guest' };
    }
  },

  setAuthSession(session: { isSignedIn: boolean; provider: string; email?: string }): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
    notify();
  },

  // User Profile
  getUserProfile(): UserProfile {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(CURRENT_USER));
      return CURRENT_USER;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return CURRENT_USER;
    }
  },

  updateUserProfile(profile: Partial<UserProfile>): UserProfile {
    const current = this.getUserProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
    notify();
    return updated;
  },

  getPeers(): UserProfile[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PEERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PEERS, JSON.stringify(SAMPLE_PEERS));
      return SAMPLE_PEERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SAMPLE_PEERS;
    }
  },

  getPeerById(id: string): UserProfile | undefined {
    return this.getPeers().find(p => p.id === id);
  },

  // Selected Location Search State
  getSelectedLocation(): SearchableLocation | null {
    const raw = localStorage.getItem(STORAGE_KEYS.SELECTED_LOCATION);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setSelectedLocation(location: SearchableLocation | null): void {
    if (location) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_LOCATION, JSON.stringify(location));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SELECTED_LOCATION);
    }
    notify();
  },

  getSearchableLocations(): SearchableLocation[] {
    return SEARCHABLE_LOCATIONS;
  },

  // Observations (Shared Report Model for Living Map & Saheli Signal)
  getObservations(): SafetyObservation[] {
    const raw = localStorage.getItem(STORAGE_KEYS.OBSERVATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(INITIAL_OBSERVATIONS));
      return INITIAL_OBSERVATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_OBSERVATIONS;
    }
  },

  getObservationByIssueId(issueId: string): SafetyObservation | undefined {
    return this.getObservations().find(obs => obs.issueId === issueId);
  },

  // Find existing issue matching location and category
  findMatchingIssue(approximateArea: string, category: string): SafetyObservation | undefined {
    const list = this.getObservations();
    const normKey = normalizeLocationKey(approximateArea);
    
    return list.find(item => {
      if (item.category !== category) return false;
      const itemKey = item.normalizedLocation || normalizeLocationKey(item.approximateArea);
      return (
        itemKey === normKey ||
        itemKey.includes(normKey) ||
        normKey.includes(itemKey) ||
        item.approximateArea.toLowerCase().includes(approximateArea.toLowerCase()) ||
        approximateArea.toLowerCase().includes(item.approximateArea.toLowerCase())
      );
    });
  },

  // Add observation with automatic or confirmed location-and-category-based grouping
  addObservation(params: {
    category: SafetyObservation['category'];
    approximateArea: string;
    coordinates: [number, number];
    radiusMeters?: number;
    timeObserved: string;
    shortDescription: string;
    supportingSource?: string;
    isInfrastructure: boolean;
    status?: ReportStatus;
    conditionOutcome?: 'working' | 'defective' | 'improved' | 'concerning' | 'neutral';
    existingIssueId?: string; // If user explicitly confirmed updating an existing issue
  }): { observation: SafetyObservation; isUpdateToExisting: boolean } {
    const list = this.getObservations();
    const outcome = params.conditionOutcome || (params.shortDescription.toLowerCase().includes('work') || params.shortDescription.toLowerCase().includes('lit') || params.shortDescription.toLowerCase().includes('bright') ? 'working' : 'defective');

    const historyEntry: ObservationHistoryEntry = {
      id: `hist_${Date.now()}`,
      observedAt: params.timeObserved,
      submittedAt: 'Just now',
      reportedBy: this.getUserProfile().displayName,
      description: params.shortDescription,
      conditionOutcome: outcome,
      confirmationsCount: 1,
      supportingSource: params.supportingSource || 'Civic observation',
    };

    // Check if an issue matches (either explicit issueId or location+category match)
    let existingIndex = -1;
    if (params.existingIssueId) {
      existingIndex = list.findIndex(i => i.issueId === params.existingIssueId);
    } else {
      existingIndex = list.findIndex(item => {
        if (item.category !== params.category) return false;
        const normExisting = item.normalizedLocation || normalizeLocationKey(item.approximateArea);
        const normInput = normalizeLocationKey(params.approximateArea);
        return normExisting === normInput || normExisting.includes(normInput) || normInput.includes(normExisting);
      });
    }

    if (existingIndex >= 0) {
      // UPDATE EXISTING ISSUE
      const target = list[existingIndex];
      const prevOutcomes = target.observationsHistory.map(h => h.conditionOutcome);
      const wasPreviouslyDefective = prevOutcomes.includes('defective') || prevOutcomes.includes('concerning');

      let updatedStatus: ReportStatus = target.status;

      // Recalculate status based on conflicting or corroborating evidence
      if (wasPreviouslyDefective && (outcome === 'working' || outcome === 'improved')) {
        // Conflicting reports! Prompt rule: "display 'Condition uncertain' or 'Needs recheck' rather than claiming the problem has definitely been fixed."
        updatedStatus = 'condition_uncertain';
      } else if (outcome === 'working' || outcome === 'improved') {
        updatedStatus = 'community_reports_improvement';
      } else if (outcome === 'defective') {
        updatedStatus = 'recently_corroborated';
      }

      const updatedIssue: SafetyObservation = {
        ...target,
        timeObserved: params.timeObserved,
        timeSubmitted: 'Updated just now',
        shortDescription: params.shortDescription,
        status: updatedStatus,
        confirmationsCount: target.confirmationsCount + 1,
        supportingSource: params.supportingSource || target.supportingSource,
        observationsHistory: [historyEntry, ...(target.observationsHistory || [])],
      };

      const updatedList = [...list];
      updatedList[existingIndex] = updatedIssue;
      localStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(updatedList));
      notify();
      return { observation: updatedIssue, isUpdateToExisting: true };
    } else {
      // CREATE NEW ISSUE
      const newIssue: SafetyObservation = {
        id: `obs_${Date.now()}`,
        issueId: `issue_${Date.now()}`,
        normalizedLocation: normalizeLocationKey(params.approximateArea),
        category: params.category,
        approximateArea: params.approximateArea,
        coordinates: params.coordinates,
        radiusMeters: params.radiusMeters || 180,
        timeObserved: params.timeObserved,
        timeSubmitted: 'Just now',
        shortDescription: params.shortDescription,
        status: outcome === 'working' ? 'newly_reported' : 'awaiting_confirmation',
        confirmationsCount: 1,
        supportingSource: params.supportingSource || 'First-hand observation',
        isInfrastructure: params.isInfrastructure,
        helpfulCount: 0,
        observationsHistory: [historyEntry],
      };

      const updatedList = [newIssue, ...list];
      localStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(updatedList));
      notify();
      return { observation: newIssue, isUpdateToExisting: false };
    }
  },

  corroborateObservation(idOrIssueId: string): void {
    const list = this.getObservations();
    const updated = list.map(item => {
      if (item.id === idOrIssueId || item.issueId === idOrIssueId) {
        const newCount = item.confirmationsCount + 1;
        return {
          ...item,
          confirmationsCount: newCount,
          status: newCount >= 2 && item.status !== 'condition_uncertain' ? ('recently_corroborated' as const) : item.status,
          supportingSource: `Corroborated by ${newCount} community members`,
        };
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(updated));
    notify();
  },

  markObservationHelpful(idOrIssueId: string): void {
    const list = this.getObservations();
    const updated = list.map(item => {
      if (item.id === idOrIssueId || item.issueId === idOrIssueId) {
        return { ...item, helpfulCount: item.helpfulCount + 1 };
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(updated));
    notify();
  },

  // Consent-based Nearby Alerts
  getNearbyAlerts(): NearbySafetyAlert[] {
    const user = this.getUserProfile();
    if (!user.privacy.enableNearbySafetyAlerts) return [];

    const observations = this.getObservations();
    // Return recent observations relevant to the user's approximate corridor
    return observations.slice(0, 3).map(obs => {
      let msg = '';
      if (obs.status === 'condition_uncertain' || obs.status === 'needs_recheck') {
        msg = `A recent ${obs.category.replace(/_/g, ' ')} issue was reported near ${obs.approximateArea}. The current condition is uncertain and needs recheck.`;
      } else if (obs.status === 'community_reports_improvement') {
        msg = `Community members reported improvement for ${obs.category.replace(/_/g, ' ')} near ${obs.approximateArea}.`;
      } else {
        msg = `Recent ${obs.category.replace(/_/g, ' ')} observation near ${obs.approximateArea}. Current status: ${obs.status.replace(/_/g, ' ')}.`;
      }

      return {
        id: `alert_${obs.issueId}`,
        issueId: obs.issueId,
        category: obs.category,
        approximateLocation: obs.approximateArea,
        reportAge: obs.timeSubmitted,
        currentStatus: obs.status,
        message: msg,
        timestamp: obs.timeObserved,
        coordinates: obs.coordinates,
      };
    });
  },

  // Saheli Circle Community Posts
  getCommunityPosts(): CommunityPost[] {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMUNITY_POSTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(INITIAL_COMMUNITY_POSTS));
      return INITIAL_COMMUNITY_POSTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_COMMUNITY_POSTS;
    }
  },

  addCommunityPost(post: Omit<CommunityPost, 'id' | 'createdAt' | 'responsesCount' | 'status'>): CommunityPost {
    const list = this.getCommunityPosts();
    const newPost: CommunityPost = {
      ...post,
      id: `post_${Date.now()}`,
      createdAt: 'Just now',
      responsesCount: 0,
      status: 'open',
    };
    const updated = [newPost, ...list];
    localStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(updated));
    notify();
    return newPost;
  },

  // Connection Requests (Saheli Circle & Saheli Share)
  getConnectionRequests(): ConnectionRequest[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CONNECTIONS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  sendConnectionRequest(fromUser: UserProfile, toUser: UserProfile, contextType: 'saheli_circle' | 'saheli_share', contextId?: string): ConnectionRequest {
    const list = this.getConnectionRequests();
    const existing = list.find(r => r.fromUserId === fromUser.id && r.toUserId === toUser.id && r.contextType === contextType);
    if (existing) return existing;

    const newReq: ConnectionRequest = {
      id: `conn_${Date.now()}`,
      fromUserId: fromUser.id,
      fromUserName: fromUser.displayName,
      fromUserCategory: fromUser.category,
      fromUserArea: fromUser.approximateArea,
      toUserId: toUser.id,
      toUserName: toUser.displayName,
      status: 'pending',
      contextType,
      contextId,
      createdAt: 'Just now',
      updatedAt: 'Just now',
    };
    const updated = [newReq, ...list];
    localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(updated));
    notify();
    return newReq;
  },

  updateConnectionStatus(requestId: string, status: 'accepted' | 'declined' | 'ended'): void {
    const list = this.getConnectionRequests();
    const updated = list.map(req => {
      if (req.id === requestId) {
        return { ...req, status, updatedAt: 'Just now' };
      }
      return req;
    });
    localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(updated));
    notify();
  },

  // Private Messages (mutual acceptance requirement enforced)
  getMessages(userAId: string, userBId: string): PrivateChatMessage[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const all: PrivateChatMessage[] = raw ? JSON.parse(raw) : [];
    return all.filter(m => (m.senderId === userAId && m.receiverId === userBId) || (m.senderId === userBId && m.receiverId === userAId));
  },

  sendPrivateMessage(message: Omit<PrivateChatMessage, 'id' | 'timestamp'>): PrivateChatMessage {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const all: PrivateChatMessage[] = raw ? JSON.parse(raw) : [];
    const newMsg: PrivateChatMessage = {
      ...message,
      id: `msg_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    all.push(newMsg);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(all));
    notify();
    return newMsg;
  },

  // Saheli Share - Ride Requests
  getRideRequests(): RideRequest[] {
    const raw = localStorage.getItem(STORAGE_KEYS.RIDE_REQUESTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.RIDE_REQUESTS, JSON.stringify(INITIAL_RIDE_REQUESTS));
      return INITIAL_RIDE_REQUESTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_RIDE_REQUESTS;
    }
  },

  addRideRequest(req: Omit<RideRequest, 'id' | 'createdAt' | 'status'>): RideRequest {
    const list = this.getRideRequests();
    const newReq: RideRequest = {
      ...req,
      id: `ride_${Date.now()}`,
      createdAt: 'Just now',
      status: 'open',
    };
    const updated = [newReq, ...list];
    localStorage.setItem(STORAGE_KEYS.RIDE_REQUESTS, JSON.stringify(updated));
    notify();
    return newReq;
  },

  // Saheli Share - Selectively Disclosed Trip Details
  getSharedTripDetails(connectionId: string): SharedTripDetails | null {
    const raw = localStorage.getItem(STORAGE_KEYS.SHARED_TRIPS);
    if (!raw) return null;
    try {
      const all: Record<string, SharedTripDetails> = JSON.parse(raw);
      return all[connectionId] || null;
    } catch {
      return null;
    }
  },

  saveSharedTripDetails(details: SharedTripDetails): void {
    const raw = localStorage.getItem(STORAGE_KEYS.SHARED_TRIPS);
    const all: Record<string, SharedTripDetails> = raw ? JSON.parse(raw) : {};
    all[details.connectionId] = details;
    localStorage.setItem(STORAGE_KEYS.SHARED_TRIPS, JSON.stringify(all));
    notify();
  },

  revokeSharedTripDetails(connectionId: string): void {
    const raw = localStorage.getItem(STORAGE_KEYS.SHARED_TRIPS);
    if (!raw) return;
    try {
      const all: Record<string, SharedTripDetails> = JSON.parse(raw);
      if (all[connectionId]) {
        all[connectionId].isSharingActive = false;
        localStorage.setItem(STORAGE_KEYS.SHARED_TRIPS, JSON.stringify(all));
        notify();
      }
    } catch {
      // ignore
    }
  },

  // Support Resources & Bookmarks
  getSupportResources(): SupportResource[] {
    const raw = localStorage.getItem(STORAGE_KEYS.RESOURCES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(OFFICIAL_SUPPORT_RESOURCES));
      return OFFICIAL_SUPPORT_RESOURCES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return OFFICIAL_SUPPORT_RESOURCES;
    }
  },

  toggleSaveResource(id: string): void {
    const list = this.getSupportResources();
    const updated = list.map(item => {
      if (item.id === id) {
        return { ...item, isSaved: !item.isSaved };
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(updated));
    notify();
  },

  // Route Change Demo State
  isRouteChangeDemoActive(): boolean {
    return localStorage.getItem(STORAGE_KEYS.ROUTE_CHANGED) === 'true';
  },

  setRouteChangeDemo(active: boolean): void {
    localStorage.setItem(STORAGE_KEYS.ROUTE_CHANGED, active ? 'true' : 'false');
    notify();
  },

  // Reset to initial clean state
  resetAllDemoData(): void {
    localStorage.clear();
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(CURRENT_USER));
    localStorage.setItem(STORAGE_KEYS.PEERS, JSON.stringify(SAMPLE_PEERS));
    localStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(INITIAL_OBSERVATIONS));
    localStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(INITIAL_COMMUNITY_POSTS));
    localStorage.setItem(STORAGE_KEYS.RIDE_REQUESTS, JSON.stringify(INITIAL_RIDE_REQUESTS));
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(OFFICIAL_SUPPORT_RESOURCES));
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_DONE, 'true');
    notify();
  }
};
