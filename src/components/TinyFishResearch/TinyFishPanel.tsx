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
  Terminal, 
  RefreshCw,
  Building,
  FileCheck,
  Info
} from 'lucide-react';
import { TinyFishResearchResult } from '../../types';
import { tinyFishService, TinyFishStatusResponse } from '../../services/tinyFishService';

export const TinyFishPanel: React.FC = () => {
  const [status, setStatus] = useState<TinyFishStatusResponse | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('legal_aid');
  const [customQuery, setCustomQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<TinyFishResearchResult | null>(null);
  const [showConfigGuide, setShowConfigGuide] = useState<boolean>(false);

  useEffect(() => {
    checkStatus();
    // Run default search
    handleSearch('legal_aid', 'Statutory free legal aid schemes and internal complaints committees in India');
  }, []);

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
              {status?.isConfigured ? 'Live TinyFish Connected' : 'Demo resources — live retrieval not configured'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl font-medium">
            AI-powered discovery and retrieval of authoritative statutory guidelines, helpline directories, and compensation schemes strictly from official public government domains (.gov.in / .nic.in).
          </p>
        </div>

        <button
          onClick={() => setShowConfigGuide(!showConfigGuide)}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors self-start md:self-auto shrink-0"
        >
          <Terminal className="w-3.5 h-3.5 text-indigo-700" />
          <span>{showConfigGuide ? 'Hide Setup Guide' : 'Integration Setup Guide'}</span>
        </button>
      </div>

      {/* Clear Demo Mode Alert when live API key is missing */}
      {!status?.isConfigured && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Demo Resources Active — Live Retrieval Not Configured</span>
            <p className="text-amber-800 leading-relaxed text-[11px]">
              No active TinyFish API key is detected in the local environment (<code className="bg-amber-100 px-1 py-0.5 rounded text-amber-950 font-mono">TINYFISH_API_KEY</code>). 
              SAAHARA AI is currently serving authoritative, pre-verified statutory snapshots from the Ministry of Women and Child Development, NALSA, and the National Cyber Crime Reporting Portal. We never simulate or claim fake live external API responses.
            </p>
          </div>
        </div>
      )}

      {/* Integration Setup Accordion */}
      {showConfigGuide && (
        <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl border border-slate-800 text-xs space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 flex-wrap gap-2">
            <span className="text-rose-400 font-bold flex items-center gap-1.5">
              <Terminal className="w-4 h-4" />
              TinyFish AI Configuration Guide (.env)
            </span>
            <span className="text-slate-400 text-[11px]">Target Endpoint: {status?.endpoint || 'https://api.search.tinyfish.ai'}</span>
          </div>
          <p className="font-sans text-slate-300 text-xs leading-relaxed">
            To connect a live TinyFish account:
          </p>
          <ol className="list-decimal pl-5 space-y-1 font-sans text-slate-400 text-xs">
            <li>Generate your API Key from the TinyFish Developer Dashboard (<code className="text-rose-300 bg-slate-800 px-1 py-0.5 rounded">agent.tinyfish.ai/api-keys</code>).</li>
            <li>Add <code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded">TINYFISH_API_KEY=your_key_here</code> to your <code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded">.env</code> file.</li>
            <li>Restart the development server via <code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded">npm run dev:all</code>.</li>
          </ol>
          <div className="text-[11px] text-amber-300 font-sans pt-1">
            Note: Without an API key, SAAHARA AI transparently falls back to pre-verified authoritative statutory records. We never fake live API success.
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
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (customQuery.trim()) {
              handleSearch('custom_query', customQuery.trim());
            }
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="Ask for public safety resources, legal aid eligibility, or shelter guidelines..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2 bg-indigo-950 hover:bg-indigo-900 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Querying...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                <span>Search Official Data</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Safety Notice Regarding AI Results */}
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
                    onClick={(e) => e.stopPropagation()}
                    className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-indigo-200 self-start sm:self-auto shrink-0 transition-colors shadow-xs"
                    title={`Open official website: ${item.officialSourceUrl}`}
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
  );
};
