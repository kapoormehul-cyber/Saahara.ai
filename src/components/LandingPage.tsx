import React from 'react';
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
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  PhoneCall, 
  Car, 
  EyeOff, 
  ShieldCheck,
  Compass,
  ArrowRight
} from 'lucide-react';
import { FooterModalType } from './Common/FooterDialogs';

interface LandingPageProps {
  onExploreDashboard: () => void;
  onFindSupport: () => void;
  onOpenJudgeTour: () => void;
  onOpenFooterModal: (type: FooterModalType) => void;
  onNavigateTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExploreDashboard,
  onFindSupport,
  onOpenJudgeTour,
  onOpenFooterModal,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-16 pb-12">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 md:pt-16 md:pb-20">
        {/* Subtle radial ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-purple-200/40 via-rose-100/30 to-teal-100/20 blur-3xl rounded-full -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
              AZINHACK ’26 Social Impact Showcase
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs font-semibold text-indigo-700">Privacy-First Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#140E24] tracking-tight leading-[1.12]">
            Your safety shouldn&apos;t <br className="hidden sm:block" />
            depend on <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B2864] via-rose-600 to-[#1E112A]">luck</span>.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Find timely local observations, connect with a supportive community, coordinate compatible journeys, and access trusted support resources—while staying in control of your privacy.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onExploreDashboard}
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#3B2864] to-[#1E112A] hover:from-[#4C3282] hover:to-[#28153A] text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-950/15 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <span>Explore Safety Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onFindSupport}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <HeartHandshake className="w-4 h-4 text-rose-500" />
              <span>Find Support</span>
            </button>

            <button
              onClick={onOpenJudgeTour}
              className="w-full sm:w-auto px-5 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-rose-600" />
              <span>Judge Evaluation Tour</span>
            </button>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <EyeOff className="w-4 h-4 text-teal-600" /> Zero Live GPS Broadcasting
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-indigo-600" /> Mutual Consent Required
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-rose-600" /> Non-Fearmongering Reports
            </span>
          </div>
        </div>
      </section>

      {/* PLATFORM OVERVIEW PREVIEW WIDGET */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          <div className="bg-[#190F26] text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-teal-400" />
              <span className="text-xs font-mono text-slate-400 ml-2">saahara.ai/live-preview</span>
            </div>
            <span className="text-xs text-rose-300 font-semibold hidden sm:inline">
              Interactive Prototype Sandbox
            </span>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-50/50">
            {/* Widget 1: Map Insight */}
            <div 
              onClick={() => onNavigateTab('map')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 cursor-pointer transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Street Lighting Insight
                </span>
                <MapPin className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">12th Main Rd Junction, Indiranagar</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                High-mast streetlights active and bright following civic repair. 5 independent community corroborations.
              </p>
              <div className="text-[11px] text-teal-700 font-semibold flex items-center gap-1">
                <span>View on Living Map</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>

            {/* Widget 2: Saheli Share Match */}
            <div 
              onClick={() => onNavigateTab('share')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 cursor-pointer transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  94% Ride Match Found
                </span>
                <Share2 className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Sneha K. • Architecture Student</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Heading towards Bellandur at 8:45 PM. Selective trip details locked behind mutual consent gate.
              </p>
              <div className="text-[11px] text-indigo-700 font-semibold flex items-center gap-1">
                <span>Inspect Mutual Flow</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>

            {/* Widget 3: Official Support */}
            <div 
              onClick={() => onNavigateTab('support')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 cursor-pointer transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  Statutory Free Legal Aid
                </span>
                <HeartHandshake className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">NALSA Helpline 15100</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Free legal counsel and advocate appointment under Section 12 of Legal Services Authorities Act.
              </p>
              <div className="text-[11px] text-rose-700 font-semibold flex items-center gap-1">
                <span>Access Support Navigator</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE-STEP EXPLANATION */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">How SAAHARA AI Works</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            A Respectful, Privacy-First Approach to Safety
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Safety through clarity, community, and consent—never fearmongering or invasive tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-base">Observe & Corroborate</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Commuters share verifiable environmental conditions (lighting, walkway obstacles, transit frequency). Reports age gracefully and require multi-member confirmation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-base">Connect with Consent</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Coordinate walking companionship from transit hubs or discover compatible cab journeys. Direct messaging unlocks only after both parties review limited profiles and approve.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-base">Journey Stronger</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              In Saheli Share, choose exactly which cab fields to disclose before meeting. Calculate fair hypothetical splits and revoke shared trip details at any time with zero friction.
            </p>
          </div>
        </div>
      </section>

      {/* CORE MODULES FEATURE CARDS */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Platform Modules</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Engineered for Impact & Dignity
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Module 1: Living Safety Map */}
          <div 
            onClick={() => onNavigateTab('map')}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">1. Living Safety Map</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interactive map with 100–300m uncertainty buffers. Filters for street lighting, transit shelters, accessibility, and civic repairs. No neighborhood is ever labelled &quot;wholly dangerous&quot;.
            </p>
            <span className="text-xs text-indigo-700 font-semibold flex items-center gap-1 pt-1">
              <span>Open Living Map</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Module 2: Saheli Circle */}
          <div 
            onClick={() => onNavigateTab('circle')}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">2. Saheli Circle</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Coordinate walking companionship from metro gates and bus bays to nearby offices. Strictly requires public meeting spots and mutual acceptance before private messaging.
            </p>
            <span className="text-xs text-indigo-700 font-semibold flex items-center gap-1 pt-1">
              <span>Explore Circle Feed</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Module 3: Saheli Signal */}
          <div 
            onClick={() => onNavigateTab('signal')}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">3. Saheli Signal</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              First-hand environmental sightings (&ldquo;Footpath illuminated&rdquo;, &ldquo;Bus bay manned&rdquo;). Community upvoting, anti-abuse flagging, and strict prohibition of personal accusations.
            </p>
            <span className="text-xs text-indigo-700 font-semibold flex items-center gap-1 pt-1">
              <span>View Signals</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Module 4: Saheli Share */}
          <div 
            onClick={() => onNavigateTab('share')}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">4. Saheli Share</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Consent-based ride matching without requiring Uber/Ola APIs. Selectively disclose driver or vehicle details only after mutual consent, with preview confirmation and a fare-split calculator.
            </p>
            <span className="text-xs text-indigo-700 font-semibold flex items-center gap-1 pt-1">
              <span>Coordinate Rides</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Module 5: Survivor Support Navigator */}
          <div 
            onClick={() => onNavigateTab('support')}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">5. Survivor Support Navigator</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Trauma-informed access to official hotlines (112, 1091, 181, 15100 NALSA, Tele-MANAS) and a 4-step actionable protocol for digital and physical evidence preservation under Indian law.
            </p>
            <span className="text-xs text-indigo-700 font-semibold flex items-center gap-1 pt-1">
              <span>Access Helplines</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Module 6: TinyFish Public Research */}
          <div 
            onClick={() => onNavigateTab('tinyfish')}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">6. TinyFish AI Public Research</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Queries official public websites (.gov.in / .nic.in). Distinguishes statutory facts from AI summaries with clear source verification dates and adapter status indicators.
            </p>
            <span className="text-xs text-indigo-700 font-semibold flex items-center gap-1 pt-1">
              <span>Query Official Data</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>

      {/* PRIVACY & TRUST COMMITMENTS */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-[#180E28] text-white p-8 md:p-10 rounded-3xl border border-white/10 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-rose-300 uppercase tracking-widest">Our Guiding Core</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Privacy by Design & Trust Guarantees
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
            <div className="space-y-1.5">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                Never Broadcasts Exact Live GPS
              </h4>
              <p>
                Public map observations and community requests use approximate public landmark buffers. Private homes, flat numbers, and real-time step movements are never recorded or published.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                Mutual Consent Gates
              </h4>
              <p>
                No user can view your cab details, vehicle numbers, or send direct messages simply because an algorithm detected a route overlap. Mutual opt-in is non-negotiable.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                No False Verification Claims
              </h4>
              <p>
                We do not claim that an OTP confirms a user&apos;s identity, trustworthiness, or gender. Driver details entered manually are marked explicitly as user-provided and unverified.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                Anti-Fearmongering Principle
              </h4>
              <p>
                We reject sensational crime heatmaps that stigmatize neighborhoods. We focus on verifiable municipal infrastructure (lighting, walkways, transit presence).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <h3 className="text-lg font-bold text-slate-900">About SAAHARA AI & AZINHACK ’26</h3>
        <p className="text-xs text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Built as an interactive prototype for <strong>AZINHACK ’26</strong>, SAAHARA AI reimagines urban technology for women by combining civic accountability, community companionship, and data sovereignty. It proves that social safety does not require sacrificing individual privacy.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200/80 pt-8 mt-12 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="SAAHARA AI" className="w-6 h-6 object-contain" />
            <span className="font-bold text-slate-800">SAAHARA AI</span>
            <span>— “Safer journeys. Stronger together.”</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 font-semibold text-slate-600">
            <button 
              onClick={() => onOpenFooterModal('privacy')}
              className="hover:text-indigo-900 transition-colors"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => onOpenFooterModal('guidelines')}
              className="hover:text-indigo-900 transition-colors"
            >
              Safety Guidelines
            </button>
            <button 
              onClick={() => onOpenFooterModal('resources')}
              className="hover:text-indigo-900 transition-colors"
            >
              Support Resources
            </button>
            <button 
              onClick={() => onOpenFooterModal('terms')}
              className="hover:text-indigo-900 transition-colors"
            >
              Terms of Use
            </button>
            <button 
              onClick={() => onOpenFooterModal('contact')}
              className="hover:text-indigo-900 transition-colors"
            >
              Contact & Security
            </button>
          </div>
        </div>
        <div className="text-center text-[11px] text-slate-400 mt-4">
          AZINHACK ’26 Social Impact Prototype • Developed with React, TypeScript & Vite
        </div>
      </footer>
    </div>
  );
};
