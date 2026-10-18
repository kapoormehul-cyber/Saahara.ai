import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  X, 
  MapPin, 
  Users, 
  Radio, 
  Share2, 
  HeartHandshake, 
  Search, 
  ShieldCheck, 
  Layers,
  ArrowRight,
  Compass,
  Check,
  MousePointerClick
} from 'lucide-react';

interface JudgeTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenAction: (actionKey: string) => void;
}

interface WalkthroughSection {
  id: number;
  title: string;
  tab: string;
  badge: string;
  icon: React.ReactNode;
  summary: string;
  keyHighlights: string[];
  suggestedActions: Array<{
    label: string;
    tab: string;
    actionKey?: string;
  }>;
  evaluatorNote: string;
}

export const JudgeTourModal: React.FC<JudgeTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenAction,
}) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const sections: WalkthroughSection[] = [
    {
      id: 1,
      title: 'Dashboard & Living Safety Map',
      tab: 'map',
      badge: 'Section 1 of 4',
      icon: <MapPin className="w-5 h-5 text-teal-600" />,
      summary: 'Explore timely crowdsourced physical observations with uncertainty discs, nationwide location search, observation history tracking, and ethical report submission.',
      keyHighlights: [
        'Location-and-Category Grouping: Updating an existing location appends to its history and recalculates status instead of duplicating markers.',
        'Nationwide Search: Autocomplete search bar covering Delhi (Indira Gandhi Metro), Mumbai (BKC), Bengaluru (12th Main), and more.',
        'Anti-Fearmongering: Never labels neighborhoods "100% safe" or "wholly dangerous". Focuses on verifiable lighting, transit stops, and walkways.',
        'Dual View Mode: Toggle instantly between Leaflet interactive map and high-density list view.'
      ],
      suggestedActions: [
        { label: 'View Living Safety Map', tab: 'map' },
        { label: 'Open Observation Form (Test Issue Grouping)', tab: 'map', actionKey: 'open_submit_report' },
        { label: 'Inspect Dashboard Overview', tab: 'overview' }
      ],
      evaluatorNote: 'Notice how markers display exact timestamps, corroborations, and unvarnished condition statuses without fearmongering.'
    },
    {
      id: 2,
      title: 'Saheli Circle & Saheli Signal',
      tab: 'circle',
      badge: 'Section 2 of 4',
      icon: <Users className="w-5 h-5 text-indigo-600" />,
      summary: 'Privacy-first community companionship and first-hand place observations. Direct messaging is strictly locked behind mutual acceptance.',
      keyHighlights: [
        'Public Meeting Point Rule: Companionship requests emphasize bright public concourses (e.g. Metro Gate 1 ticket counter), never private residences.',
        'Limited Profile Safeguards: Hides exact employers, home addresses, phone numbers, and live movements.',
        'Mutual Consent Gating: Both parties must approve connection before private messaging unlocks.',
        'Saheli Signal Sightings: First-hand environmental place sightings with community helpfulness upvoting.'
      ],
      suggestedActions: [
        { label: 'Explore Saheli Circle Feed', tab: 'circle' },
        { label: 'Open Connection Requests Drawer', tab: 'circle', actionKey: 'open_circle_requests' },
        { label: 'Switch to Saheli Signal Board', tab: 'signal' },
        { label: 'Publish a Sample Signal', tab: 'signal', actionKey: 'open_publish_signal' }
      ],
      evaluatorNote: 'Inspect peer profile on Sneha K. or Priya S. to see honest verification disclaimers and privacy safeguards.'
    },
    {
      id: 3,
      title: 'Saheli Share (Consent-Based Ride Matching)',
      tab: 'share',
      badge: 'Section 3 of 4',
      icon: <Share2 className="w-5 h-5 text-purple-600" />,
      summary: 'Coordinate compatible journeys without requiring external ride-hailing APIs. Features selective trip disclosure preview and hypothetical fare-splitting.',
      keyHighlights: [
        'Zero Aggregator Dependency: Works as a consent-based trip coordination prototype without Uber/Ola API keys.',
        'Corridor Matching: Matches on broad departure windows and geographic corridors without exposing pickup doors.',
        'Selective Disclosure Gate: User chooses exactly which fields to share (cab provider, driver name, vehicle reg, pickup spot) with explicit preview confirmation.',
        'Unverified Driver Warning: User-entered driver details are prominently marked as unverified.',
        'Hypothetical Fare Split: Interactive calculator (e.g. ₹420 / 2 = ₹210) clearly disclaiming non-payment status.'
      ],
      suggestedActions: [
        { label: 'Open Saheli Share Module', tab: 'share' },
        { label: 'Simulate Sneha\'s Mutual Acceptance', tab: 'share', actionKey: 'simulate_mutual_accept' },
        { label: 'Open Selective Sharing Gate', tab: 'share', actionKey: 'open_selective_sharing' },
        { label: 'Test Fare-Splitting Calculator', tab: 'share', actionKey: 'open_fare_calc' }
      ],
      evaluatorNote: 'Notice that private trip information remains strictly concealed until both users explicitly inspect limited profiles and confirm consent.'
    },
    {
      id: 4,
      title: 'Account Verification, Privacy & Support Navigator',
      tab: 'support',
      badge: 'Section 4 of 4',
      icon: <HeartHandshake className="w-5 h-5 text-rose-500" />,
      summary: 'Trauma-informed survivor directory, safe evidence preservation protocols, TinyFish AI official research, and data sovereignty controls.',
      keyHighlights: [
        'Authoritative Helplines: Verified official links for 112 (ERSS), 1091 (Police), 181 (WHL), 15100 (NALSA), and 14416 (Tele-MANAS).',
        'Safe Evidence Protocol: Actionable guide on uncropped screenshots, raw chat archives (.txt/.eml), and Medico-Legal Certificates (MLC).',
        'TinyFish Public Research: Queries official portals (.gov.in / .nic.in). Clearly distinguishes verified statutory facts from AI summaries.',
        'Consent-Based Nearby Alerts: Optional notifications for nearby reports with explicit location permission or manual landmark selection.'
      ],
      suggestedActions: [
        { label: 'Open Support Navigator', tab: 'support' },
        { label: 'Explore TinyFish AI Research Hub', tab: 'tinyfish' },
        { label: 'Open Account & Onboarding Dialog', tab: 'settings', actionKey: 'open_auth_modal' },
        { label: 'Inspect Nearby Alerts Settings', tab: 'settings', actionKey: 'open_nearby_alerts' }
      ],
      evaluatorNote: 'Test the official external links (e.g. NALSA, MWCD, 112) to verify accurate external destinations and zero fake citations.'
    }
  ];

  if (!isOpen) return null;

  const currentSection = sections[currentSectionIndex];

  const handleExecuteAction = (tab: string, actionKey?: string) => {
    onNavigateTab(tab);
    if (actionKey) {
      setTimeout(() => {
        onOpenAction(actionKey);
      }, 300);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#180E28] via-[#2A1845] to-[#1E112A] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/20 rounded-xl text-rose-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-rose-300">
                  AZINHACK ’26 Judge Walkthrough
                </span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-slate-300 font-semibold">
                  4 Grouped Sections
                </span>
              </div>
              <h3 className="text-base font-bold text-white">Interactive Evaluation Guide</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            title="Exit Walkthrough"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs Selector */}
        <div className="grid grid-cols-4 bg-slate-100 p-1.5 border-b border-slate-200 text-xs font-semibold">
          {sections.map((sec, idx) => (
            <button
              key={sec.id}
              onClick={() => {
                setCurrentSectionIndex(idx);
                onNavigateTab(sec.tab);
              }}
              className={`py-2 px-2 rounded-xl transition-all text-center flex flex-col items-center gap-0.5 ${
                idx === currentSectionIndex
                  ? 'bg-white text-indigo-950 shadow-sm font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span className="text-[10px] text-slate-400 uppercase">Part {sec.id}</span>
              <span className="truncate w-full text-[11px]">{sec.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Section Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl shrink-0">
                {currentSection.icon}
              </div>
              <div>
                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
                  {currentSection.badge}
                </span>
                <h4 className="text-lg font-extrabold text-slate-900 leading-tight">
                  {currentSection.title}
                </h4>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab(currentSection.tab)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold shrink-0 transition-colors"
            >
              Jump to Screen
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {currentSection.summary}
          </p>

          {/* Key Feature Highlights */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Core Principles & What To Inspect:
            </span>
            <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs text-slate-700">
              {currentSection.keyHighlights.map((hl, hIdx) => (
                <div key={hIdx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Tap-Here Action Buttons */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
              <MousePointerClick className="w-3.5 h-3.5 text-indigo-600" />
              <span>Tap Here to Trigger Live Flows in this Section:</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentSection.suggestedActions.map((act, aIdx) => (
                <button
                  key={aIdx}
                  onClick={() => handleExecuteAction(act.tab, act.actionKey)}
                  className="p-3 bg-white hover:bg-indigo-50/80 border border-indigo-200/80 rounded-xl text-xs font-semibold text-indigo-950 flex items-center justify-between shadow-xs transition-all hover:border-indigo-300 text-left group"
                >
                  <span className="group-hover:text-indigo-700 transition-colors">{act.label}</span>
                  <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Evaluator Checklist Note */}
          <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-xs text-emerald-950 flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Judge Tip:</strong> {currentSection.evaluatorNote}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Exit Walkthrough
          </button>

          <div className="flex items-center gap-2">
            <button
              disabled={currentSectionIndex === 0}
              onClick={() => {
                const prev = Math.max(0, currentSectionIndex - 1);
                setCurrentSectionIndex(prev);
                onNavigateTab(sections[prev].tab);
              }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {currentSectionIndex < sections.length - 1 ? (
              <button
                onClick={() => {
                  const next = currentSectionIndex + 1;
                  setCurrentSectionIndex(next);
                  onNavigateTab(sections[next].tab);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-950 hover:bg-indigo-900 rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
              >
                <span>Next Section</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
              >
                <span>Finish Walkthrough</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
