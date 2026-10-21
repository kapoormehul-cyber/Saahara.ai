import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  MapPin, 
  RefreshCw, 
  Radio,
  FileCheck2,
  AlertCircle,
  Database,
  PhoneCall,
  GitBranch,
  ShieldAlert
} from 'lucide-react';
import { 
  SafetyIntelligenceBriefing, 
  EvidenceState, 
  IntelligenceEvidenceItem,
  InvestigationProgressStage 
} from '../../types';
import { tinyFishService, TinyFishStatusResponse } from '../../services/tinyFishService';

interface LiveSafetyIntelligenceAgentProps {
  initialQuery?: string;
  initialArea?: string;
  initialObservationId?: string;
  onCloseInvestigation?: () => void;
}

export const LiveSafetyIntelligenceAgent: React.FC<LiveSafetyIntelligenceAgentProps> = ({
  initialQuery,
  initialArea,
  initialObservationId,
}) => {
  const [status, setStatus] = useState<TinyFishStatusResponse | null>(null);
  const [searchArea, setSearchArea] = useState<string>(initialArea || initialQuery || '12th Main Road, Indiranagar, Bengaluru');
  const [customContext, setCustomContext] = useState<string>(initialQuery || 'Transit safety, municipal lighting, and station security audit');
  const [observationId, setObservationId] = useState<string | undefined>(initialObservationId);
  const [briefing, setBriefing] = useState<SafetyIntelligenceBriefing | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progressStage, setProgressStage] = useState<InvestigationProgressStage>('idle');
  const [filterState, setFilterState] = useState<string>('all');

  useEffect(() => {
    checkStatus();
    // Auto-run initial investigation if provided or default
    handleRunInvestigation(false);
  }, [initialArea, initialObservationId]);

  const checkStatus = async () => {
    const s = await tinyFishService.getStatus();
    setStatus(s);
  };

  const corridorPresets = [
    {
      id: 'indiranagar',
      label: 'Indiranagar 12th Main (BLR)',
      area: '12th Main Road, Indiranagar, Bengaluru',
      query: '12th Main Indiranagar & Indiranagar Metro Corridor Safety',
      obsId: 'OBS-BLR-001',
    },
    {
      id: 'delhi_airport',
      label: 'IGI Airport Express (DEL)',
      area: 'IGI Airport Terminal 3 to New Delhi Metro Station, Delhi NCR',
      query: 'Indira Gandhi Metro & Airport Express Corridor Safety',
      obsId: 'OBS-DEL-003',
    },
    {
      id: 'bkc_mumbai',
      label: 'BKC Terminal & G-Block (BOM)',
      area: 'Bandra Kurla Complex, Mumbai, Maharashtra',
      query: 'BKC Terminal & Bandra Kurla Complex Transit Safety',
      obsId: 'OBS-BOM-002',
    },
    {
      id: 'connaught_place',
      label: 'Connaught Place / Rajiv Chowk (DEL)',
      area: 'Connaught Place, Central Delhi, New Delhi',
      query: 'Connaught Place Inner and Outer Circle Late Night Safety',
      obsId: 'OBS-DEL-005',
    },
    {
      id: 'cmh_road',
      label: 'CMH Road Hospital Corridor (BLR)',
      area: 'Chinmaya Mission Hospital Road, Indiranagar, Bengaluru',
      query: 'CMH Road & CMH Hospital Metro Corridor Safety',
      obsId: 'OBS-BLR-004',
    },
  ];

  const handleRunInvestigation = async (forceRefresh: boolean = false) => {
    if (!searchArea.trim()) return;

    setIsLoading(true);
    setProgressStage('analyzing_query');

    // Visual progression for transparency of multi-step AI workflow
    const t1 = setTimeout(() => setProgressStage('formulating_plan'), 400);
    const t2 = setTimeout(() => setProgressStage('executing_search'), 900);
    const t3 = setTimeout(() => setProgressStage('fetching_sources'), 1500);
    const t4 = setTimeout(() => setProgressStage('cross_referencing'), 2100);

    try {
      const result = await tinyFishService.investigateSafety(
        customContext,
        searchArea,
        observationId,
        forceRefresh
      );
      setBriefing(result);
      setProgressStage('completed');
    } catch {
      setProgressStage('error');
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      setIsLoading(false);
    }
  };

  const getEvidenceStateBadge = (state: EvidenceState) => {
    switch (state) {
      case 'official_information_found':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Official Portal Record
          </span>
        );
      case 'corroborated_by_independent_sources':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-300">
            <ShieldCheck className="w-3 h-3 text-teal-600" />
            Independent Corroboration
          </span>
        );
      case 'conflicting_information':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Conflicting Information
          </span>
        );
      case 'community_report':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-300">
            <Radio className="w-3 h-3 text-purple-600" />
            Community Observation
          </span>
        );
      case 'not_independently_verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <HelpCircle className="w-3 h-3 text-slate-500" />
            Not Independently Verified
          </span>
        );
      case 'source_unavailable_or_outdated':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-300">
            <Clock className="w-3 h-3 text-rose-600" />
            Outdated / Unavailable Source
          </span>
        );
      default:
        return null;
    }
  };

  const filteredEvidence = (briefing?.evidence || []).filter((item: IntelligenceEvidenceItem) => {
    if (filterState === 'all') return true;
    return item.state === filterState;
  });

  return (
    <div className="space-y-6">
      {/* Privacy Notice Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-sm border border-indigo-800 space-y-2">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-800/80 rounded-xl shrink-0">
            <Sparkles className="w-5 h-5 text-indigo-300" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-base text-white">Live Safety Intelligence Agent</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
                Round 2 AZINHACK &apos;26
              </span>
            </div>
            <p className="text-xs text-indigo-200 leading-relaxed max-w-3xl">
              A bounded research workflow powered by TinyFish Search &amp; Fetch. Formulates structured queries across municipal portals, transit authority charters, and police bulletins to corroborate local community reports without transmitting user identities or private credentials.
            </p>
          </div>
        </div>
      </div>

      {/* Query Bar & Presets */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Transit Corridor or Location to Investigate</h4>
            <p className="text-xs text-slate-500">
              Enter an approximate area, transit hub, or community observation ID.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
              status?.isConfigured 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                : 'bg-amber-50 text-amber-900 border-amber-300'
            }`}>
              {status?.isConfigured ? 'Live research available' : 'Live research temporarily unavailable'}
            </span>
          </div>
        </div>

        {/* Quick Corridor Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-1">Transit Hubs:</span>
          {corridorPresets.map(preset => (
            <button
              key={preset.id}
              onClick={() => {
                setSearchArea(preset.area);
                setCustomContext(preset.query);
                setObservationId(preset.obsId);
                // Trigger investigation
                setTimeout(() => handleRunInvestigation(false), 50);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                searchArea === preset.area
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
          <div className="md:col-span-5 relative">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Approximate Location / Corridor
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchArea}
                onChange={(e) => setSearchArea(e.target.value)}
                placeholder="e.g. 12th Main Road, Indiranagar, Bengaluru"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-medium"
              />
            </div>
          </div>

          <div className="md:col-span-5 relative">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Safety Inquiry Context
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
                placeholder="e.g. Broken street lighting, late night transit escort"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-medium"
              />
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col justify-end gap-1">
            <button
              onClick={() => handleRunInvestigation(true)}
              disabled={isLoading || !searchArea.trim()}
              className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Researching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                  <span>Investigate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {observationId && (
          <div className="flex items-center gap-2 text-[11px] text-indigo-700 bg-indigo-50/80 px-3 py-1.5 rounded-lg border border-indigo-200">
            <Radio className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>Investigating linked community report: <strong>{observationId}</strong></span>
            <button 
              onClick={() => setObservationId(undefined)}
              className="text-[10px] text-slate-500 underline ml-auto hover:text-slate-800"
            >
              Clear link
            </button>
          </div>
        )}
      </div>

      {/* Workflow Stepper Indicator */}
      {isLoading && (
        <div className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-sm space-y-3 animate-pulse">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-950 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
              Executing Bounded Research Workflow
            </span>
            <span className="text-[11px] font-mono text-indigo-600 uppercase">
              {progressStage.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <div className={`p-2.5 rounded-xl border ${
              ['analyzing_query', 'formulating_plan', 'executing_search', 'fetching_sources', 'cross_referencing', 'completed'].includes(progressStage)
                ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              1. Understand &amp; Plan
            </div>
            <div className={`p-2.5 rounded-xl border ${
              ['executing_search', 'fetching_sources', 'cross_referencing', 'completed'].includes(progressStage)
                ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              2. TinyFish Search API
            </div>
            <div className={`p-2.5 rounded-xl border ${
              ['fetching_sources', 'cross_referencing', 'completed'].includes(progressStage)
                ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              3. TinyFish Content Fetch
            </div>
            <div className={`p-2.5 rounded-xl border ${
              ['cross_referencing', 'completed'].includes(progressStage)
                ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              4. Cross-Reference &amp; Gaps
            </div>
          </div>
        </div>
      )}

      {/* Briefing Report Presentation */}
      {briefing && !isLoading && (
        <div className="space-y-6">
          {/* Executive Briefing Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Safety Intelligence Briefing
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    briefing.status === 'live_result'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-indigo-50 text-indigo-800 border-indigo-300'
                  }`}>
                    {briefing.status === 'live_result' ? 'Live Retrieval' : 'Curated Transit Intelligence'}
                  </span>
                  {briefing.cached && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <Database className="w-3 h-3 text-amber-600" />
                      Cached (15m TTL)
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {briefing.query}
                </h3>
                <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  {briefing.approximateArea}
                </span>
              </div>

              <div className="text-right text-[11px] text-slate-400 shrink-0">
                <span>Checked: {briefing.generatedAt ? new Date(briefing.generatedAt).toLocaleString() : 'Recent'}</span>
              </div>
            </div>

            {/* Assessment Statement */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <FileCheck2 className="w-4 h-4 text-indigo-600" />
                <span>Multi-Source Synthesis</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                {briefing.summary}
              </p>
              <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-800 font-medium">
                <strong>Ground Assessment: </strong>{briefing.overallAssessment}
              </div>
            </div>

            {/* Absence of Data Warning — Crucial for AZINHACK Honesty */}
            <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-amber-950">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold block text-[11px] uppercase tracking-wider text-amber-900">
                  Data Honesty &amp; Limitations Notice
                </span>
                <p className="text-[11px] text-amber-900/90 leading-snug">
                  {briefing.absenceOfDataNotice}
                </p>
              </div>
            </div>

            {/* Research Plan Steps Executed */}
            {briefing.researchPlan && briefing.researchPlan.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
                  Bounded Research Plan ({briefing.researchPlan.length} steps executed)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {briefing.researchPlan.map((step) => (
                    <div 
                      key={step.stepNumber}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          Step {step.stepNumber}: {step.title}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          {step.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        {step.description}
                      </p>
                      {step.targetDomain && (
                        <div className="text-[10px] text-indigo-600 font-mono">
                          Target: {step.targetDomain}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Conflicting Claims Callout (if detected) */}
          {briefing.conflicts && briefing.conflicts.length > 0 && (
            <div className="bg-rose-50/90 border border-rose-300 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-rose-950">
                    Conflicting Claims Detected ({briefing.conflicts.length})
                  </h4>
                  <p className="text-xs text-rose-800">
                    Discrepancies identified between official civic grievance resolutions and on-ground community reports.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                {briefing.conflicts.map((conf) => (
                  <div 
                    key={conf.id}
                    className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs space-y-2 text-xs"
                  >
                    <div className="font-bold text-slate-900">
                      Discrepancy: {conf.issue}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Official Civic Record
                        </span>
                        <span className="font-semibold text-slate-800 block">{conf.sourceA.name}</span>
                        <p className="text-[11px] text-slate-600">{conf.sourceA.claim}</p>
                        {conf.sourceA.url && (
                          <a 
                            href={conf.sourceA.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] text-indigo-600 hover:underline flex items-center gap-0.5 pt-1"
                          >
                            <span>Inspect record</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>

                      <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200 space-y-1">
                        <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                          Community Observation
                        </span>
                        <span className="font-semibold text-amber-950 block">{conf.sourceB.name}</span>
                        <p className="text-[11px] text-amber-900">{conf.sourceB.claim}</p>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 bg-slate-100/70 p-2.5 rounded-lg border border-slate-200">
                      <strong>Analysis: </strong>{conf.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Structured Evidence Items */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Structured Evidence &amp; Verified Records ({filteredEvidence.length})
                </h4>
                <p className="text-xs text-slate-500">
                  Every claim is tied to its originating authority or community observer with explicit provenance.
                </p>
              </div>

              {/* State Filter Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button
                  onClick={() => setFilterState('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    filterState === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({briefing.evidence.length})
                </button>
                <button
                  onClick={() => setFilterState('official_information_found')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    filterState === 'official_information_found'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  Official
                </button>
                <button
                  onClick={() => setFilterState('conflicting_information')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    filterState === 'conflicting_information'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  Conflicts
                </button>
                <button
                  onClick={() => setFilterState('community_report')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    filterState === 'community_report'
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                  }`}
                >
                  Community
                </button>
              </div>
            </div>

            {/* Evidence Cards Grid */}
            <div className="space-y-3">
              {filteredEvidence.map((item: IntelligenceEvidenceItem) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 space-y-3 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {getEvidenceStateBadge(item.state)}
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {item.id}
                        </span>
                        {item.organization && (
                          <span className="text-[11px] text-slate-500 font-medium">
                            {item.organization}
                          </span>
                        )}
                      </div>
                      <h5 className="font-bold text-slate-900 text-sm mt-1">
                        {item.title}
                      </h5>
                    </div>

                    {item.publishDate && (
                      <span className="text-[10px] text-slate-400 shrink-0">
                        Date: {item.publishDate}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {item.summary}
                  </p>

                  {/* Verified facts bullets */}
                  {item.verifiedFacts && item.verifiedFacts.length > 0 && (
                    <div className="bg-white p-3 rounded-lg border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Verified Facts Extracted:
                      </span>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600">
                        {item.verifiedFacts.map((fact, idx) => (
                          <li key={idx}>{fact}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Notes callout */}
                  {item.notes && (
                    <div className="text-[11px] text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                      <strong>Observation: </strong>{item.notes}
                    </div>
                  )}

                  {/* Link to source */}
                  {item.sourceUrl && (
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/50">
                      <span className="text-[10px] font-mono text-slate-400">
                        Domain: {item.domain || new URL(item.sourceUrl).hostname}
                      </span>
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 hover:underline"
                      >
                        <span>Inspect Official Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Unverified Information & Data Gaps */}
          {briefing.unverifiedGaps && briefing.unverifiedGaps.length > 0 && (
            <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <AlertCircle className="w-4 h-4 text-slate-500" />
                <span>Unverified Gaps &amp; Surveillance Blind Spots</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-[11px]">
                {briefing.unverifiedGaps.map((gap, idx) => (
                  <li key={idx}>{gap}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Official Emergency Helplines & Desks */}
          {briefing.helplines && briefing.helplines.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  Verified Transit &amp; Women Safety Desks
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {briefing.helplines.map((hl, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/40 space-y-1 text-xs"
                  >
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                      {hl.organization}
                    </span>
                    <span className="font-semibold text-slate-900 block">{hl.name}</span>
                    <div className="text-sm font-bold text-indigo-700 font-mono">
                      {hl.contact}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
