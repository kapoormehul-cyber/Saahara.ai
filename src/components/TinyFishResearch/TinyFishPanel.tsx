import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  RefreshCw,
  Building,
  FileCheck,
  Info,
  Radio,
  BookOpen
} from 'lucide-react';
import { TinyFishResearchResult } from '../../types';
import { tinyFishService, TinyFishStatusResponse } from '../../services/tinyFishService';
import { openExternalOfficialUrl } from '../../utils/urlHelper';
import { LiveSafetyIntelligenceAgent } from './LiveSafetyIntelligenceAgent';

interface TinyFishPanelProps {
  initialInvestigation?: {
    query: string;
    approximateArea: string;
    observationId?: string;
  } | null;
}

export const TinyFishPanel: React.FC<TinyFishPanelProps> = ({ initialInvestigation }) => {
  const [activeSubTab, setActiveSubTab] = useState<'intelligence' | 'statutory'>('intelligence');
  const [status, setStatus] = useState<TinyFishStatusResponse | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('legal_aid');
  const [customQuery, setCustomQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<TinyFishResearchResult | null>(null);

  useEffect(() => {
    checkStatus();
    // Run default search for statutory tab
    handleSearch('legal_aid', 'Statutory free legal aid schemes and internal complaints committees in India');
  }, []);

  useEffect(() => {
    if (initialInvestigation) {
      setActiveSubTab('intelligence');
    }
  }, [initialInvestigation]);

  const checkStatus = async () => {
    const s = await tinyFishService.getStatus();
    setStatus(s);
  };

  const handleSearch = async (category: string, queryStr: string) => {
    setIsLoading(true);
    try {
      const res = await tinyFishService.researchPublicResources(queryStr, category);
      setResult(res);
    } finally {
      setIsLoading(false);
    }
  };

  const topicPresets = [
    { id: 'legal_aid', label: 'Free Legal Aid & ICCs', query: 'Statutory free legal aid schemes and POSH internal complaints committees in India' },
    { id: 'emergency_shelter', label: 'One Stop Centres (Sakhi)', query: 'Government One Stop Centres (Sakhi) and emergency shelter protocols' },
    { id: 'cyber_safety', label: 'Cyber Harassment & Takedowns', query: 'Non-consensual image removal and digital evidence recording procedures' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Navigation Tabs: Live Intelligence Agent vs Statutory Knowledge Base */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('intelligence')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'intelligence'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Safety Intelligence Agent</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] uppercase tracking-wider bg-white/20 text-white font-mono">
              Round 2
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('statutory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'statutory'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Statutory Knowledge Base</span>
          </button>
        </div>

      </div>

      {/* SUB-TAB 1: LIVE SAFETY INTELLIGENCE AGENT (ROUND 2) */}
      {activeSubTab === 'intelligence' && (
        <LiveSafetyIntelligenceAgent
          initialQuery={initialInvestigation?.query}
          initialArea={initialInvestigation?.approximateArea}
          initialObservationId={initialInvestigation?.observationId}
        />
      )}

      {/* SUB-TAB 2: STATUTORY RESOURCE DIRECTORY (PRESERVED) */}
      {activeSubTab === 'statutory' && (
        <div className="space-y-5">
          {/* Required Introductory Explanation Banner */}
          <div className="bg-indigo-900 text-white p-5 rounded-2xl shadow-sm border border-indigo-800 space-y-2">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-bold text-sm tracking-tight text-white">About TinyFish Research in SAAHARA AI</h3>
                <p className="text-xs text-indigo-100 leading-relaxed">
                  &ldquo;TinyFish Research helps SAAHARA AI find and organize relevant public information from official websites. It supports resource discovery; it does not verify user identities or replace professional or emergency assistance.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  TinyFish Public-Information Research
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  status?.isConfigured 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                    : 'bg-amber-50 text-amber-900 border-amber-300'
                }`}>
                  {status?.isConfigured ? 'Live research available' : 'Live research temporarily unavailable'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl font-medium">
                AI-powered discovery and retrieval of authoritative statutory guidelines, helpline directories, and compensation schemes strictly from official public government domains (.gov.in / .nic.in).
              </p>
            </div>
          </div>

          {/* Statutory Knowledge Notice when live research is unavailable */}
          {!status?.isConfigured && (
            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block">Authoritative Statutory Records Active</span>
                <p className="text-amber-800 leading-relaxed text-[11px]">
                  Live research is temporarily unavailable. SAAHARA AI is serving verified statutory guidance directly from official portals including the Ministry of Women and Child Development, NALSA, and the National Cyber Crime Reporting Portal.
                </p>
              </div>
            </div>
          )}

          {/* Query Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 mr-1">Public Topics:</span>
              {topicPresets.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedTopic(preset.id);
                    setCustomQuery(preset.query);
                    handleSearch(preset.id, preset.query);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    selectedTopic === preset.id
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="Ask a question about legal aid, FIR registration, or shelter rights..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customQuery.trim()) {
                      handleSearch(selectedTopic, customQuery);
                    }
                  }}
                />
              </div>
              <button
                onClick={() => handleSearch(selectedTopic, customQuery || topicPresets.find(t => t.id === selectedTopic)?.query || '')}
                disabled={isLoading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Research</span>
              </button>
            </div>
          </div>

          {/* Fact vs Summary Disclaimer */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-slate-800">Fact vs Summary Separation:</strong> Content below is organized strictly from official public government portals (.gov.in / .nic.in / .org). Statutory facts are separated from AI summary notes. Private user data is never transmitted to TinyFish.
            </div>
          </div>

          {/* Results Rendering */}
          {result && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1 flex-wrap gap-2">
                <span className="font-medium">
                  Topic: <strong className="text-slate-800">{result.category}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Verified snapshot: {result.checkedDate} • Mode: {result.status === 'live_result' ? 'Live Search' : 'Pre-verified Statutory Dataset'}
                </span>
              </div>

              <div className="space-y-3.5">
                {result.resources.map((item, idx) => (
                  <div 
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {item.organization}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-0.5">{item.name}</h3>
                      </div>

                      <a
                        href={item.officialSourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => openExternalOfficialUrl(item.officialSourceUrl, e)}
                        className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-indigo-200 self-start sm:self-auto shrink-0 transition-colors shadow-xs"
                        title={`Open official website: ${item.officialSourceUrl}`}
                        aria-label={`Inspect official source for ${item.name} (opens in new window)`}
                      >
                        <span>Inspect Official Source</span>
                        <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                      </a>
                    </div>

                    {/* Eligibility & Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span className="font-bold text-slate-700 block">Published Eligibility & Access:</span>
                        <p className="text-slate-600 leading-relaxed text-[11px]">{item.eligibilityInstructions}</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span className="font-bold text-slate-700 block">Official Helpline / Contact:</span>
                        <p className="text-slate-900 font-semibold text-[11px] font-mono">{item.contactInfo}</p>
                      </div>
                    </div>

                    {/* Verified Facts (Bulleted) */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Verified Statutory Facts (Retrieved from gazette / official source):
                      </span>
                      <ul className="text-xs text-slate-700 space-y-1 list-disc pl-5 leading-relaxed bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                        {item.verifiedFacts.map((fact, fIdx) => (
                          <li key={fIdx}>{fact}</li>
                        ))}
                      </ul>
                    </div>

                    {/* AI Summary Notice */}
                    <div className="text-[11px] text-slate-500 italic bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{item.aiSummaryNotice}</span>
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
