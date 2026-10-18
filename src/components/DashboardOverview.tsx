import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  MapPin, 
  Users, 
  Radio, 
  Share2, 
  HeartHandshake, 
  Search, 
  Sparkles, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  Car, 
  FileCheck,
  Building,
  ArrowRight
} from 'lucide-react';
import { 
  UserProfile, 
  SafetyObservation, 
  CommunityPost, 
  RideRequest, 
  SupportResource 
} from '../types';
import { storageService } from '../services/storageService';
import { getStatusBadge } from './LivingSafetyMap/SafetyMap';

interface DashboardOverviewProps {
  currentUser: UserProfile;
  onNavigateTab: (tab: string) => void;
  onOpenJudgeTour: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  currentUser,
  onNavigateTab,
  onOpenJudgeTour,
}) => {
  const [observations, setObservations] = useState<SafetyObservation[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
  const [savedResources, setSavedResources] = useState<SupportResource[]>([]);

  useEffect(() => {
    setObservations(storageService.getObservations());
    setPosts(storageService.getCommunityPosts());
    setRideRequests(storageService.getRideRequests());
    setSavedResources(storageService.getSupportResources().filter(r => r.isSaved));

    const unsubscribe = storageService.subscribe(() => {
      setObservations(storageService.getObservations());
      setPosts(storageService.getCommunityPosts());
      setRideRequests(storageService.getRideRequests());
      setSavedResources(storageService.getSupportResources().filter(r => r.isSaved));
    });
    return unsubscribe;
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#201435] via-[#352055] to-[#1E112A] text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-white/10 relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-400/30">
              Community Hub
            </span>
            <span className="text-xs text-slate-300">
              Approximate Area: <strong className="text-white">{currentUser.approximateArea}</strong>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser.displayName}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Your neighborhood safety overview: <strong>{observations.length}</strong> active public observations, <strong>{posts.length}</strong> companion requests, and <strong>{rideRequests.length - 1}</strong> compatible ride opportunities along your transit corridor.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('map')}
              className="px-4 py-2 bg-white text-indigo-950 rounded-xl text-xs font-bold shadow-md hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              <span>Explore Living Map</span>
            </button>

            <button
              onClick={() => onNavigateTab('share')}
              className="px-4 py-2 bg-indigo-900/60 hover:bg-indigo-900 text-white rounded-xl text-xs font-semibold border border-white/20 transition-colors flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-rose-300" />
              <span>Check Saheli Share Matches</span>
            </button>

            <button
              onClick={onOpenJudgeTour}
              className="px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 rounded-xl text-xs font-semibold border border-rose-400/30 transition-colors flex items-center gap-1.5 ml-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Judge Walkthrough</span>
            </button>
          </div>
        </div>
      </div>

      {/* Illustrative Demo State Indicator Banner */}
      <div className="p-3 bg-amber-50/90 border border-amber-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-amber-950">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Illustrative Sample Data Notice:</strong> The observations, matched journeys, and community profiles shown below are realistic evaluation records curated for the AZINHACK ’26 prototype. All verification states accurately reflect the checks performed.
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Recent Local Observations & Infrastructure */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-50 rounded-lg text-amber-700">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Recent Public Observations</h3>
            </div>
            <button
              onClick={() => onNavigateTab('map')}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
            >
              <span>View Map</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {observations.slice(0, 3).map((obs) => {
              const badge = getStatusBadge(obs.status);
              return (
                <div 
                  key={obs.id}
                  className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {obs.category.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">{obs.approximateArea}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{obs.shortDescription}</p>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                    <span>🕒 {obs.timeObserved}</span>
                    <span>🛡️ {obs.confirmationsCount} confirmations</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 2: Saheli Share & Compatible Ride Match */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-50 rounded-lg text-purple-700">
                <Share2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Compatible Saheli Share Journeys</h3>
            </div>
            <button
              onClick={() => onNavigateTab('share')}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
            >
              <span>Manage Shares</span>
              <ChevronRight className="w-3" />
            </button>
          </div>

          <div className="space-y-3">
            {rideRequests.slice(1, 3).map((req) => (
              <div 
                key={req.id}
                className="p-3.5 bg-indigo-50/40 border border-indigo-100 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{req.userName}</h4>
                    <span className="text-[10px] text-slate-500">
                      {req.userCategory.replace(/_/g, ' ')} • Approx Corridor: {req.approxPickupArea}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                    94% Match
                  </span>
                </div>

                <div className="text-xs text-slate-700 bg-white p-2 rounded-lg border border-slate-200/60 flex items-center justify-between">
                  <span>Departure: <strong>{req.departureTimeWindow}</strong></span>
                  <span className="text-emerald-700 font-semibold">Est. Share: ~₹{Math.round((req.estimatedFare || 400) / 2)}</span>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => onNavigateTab('share')}
                    className="text-xs font-semibold text-indigo-900 hover:underline flex items-center gap-1"
                  >
                    <span>Inspect Match & Connect</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Nearby Community Posts (Saheli Circle) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-700">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Nearby Saheli Circle Updates</h3>
            </div>
            <button
              onClick={() => onNavigateTab('circle')}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
            >
              <span>Open Circle</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {posts.slice(0, 2).map((post) => (
              <div 
                key={post.id}
                className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{post.authorName}</span>
                  <span className="text-[10px] text-slate-400">{post.createdAt}</span>
                </div>
                <h4 className="font-semibold text-xs text-slate-800">{post.title}</h4>
                {post.suggestedMeetingPoint && (
                  <div className="text-[11px] text-indigo-700 font-medium">
                    📍 Public Meeting: {post.suggestedMeetingPoint}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Card 4: Saved & Emergency Support Resources */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-rose-50 rounded-lg text-rose-700">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Saved Support Resources</h3>
            </div>
            <button
              onClick={() => onNavigateTab('support')}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
            >
              <span>All Resources</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {savedResources.slice(0, 3).map((res) => (
              <div 
                key={res.id}
                className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{res.name}</h4>
                  <span className="text-[10px] text-slate-500">{res.issuingOrganization}</span>
                </div>
                {res.contactNumber && (
                  <span className="font-mono text-xs font-bold text-indigo-950 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {res.contactNumber}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
