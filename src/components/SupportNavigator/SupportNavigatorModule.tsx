import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  Phone, 
  ShieldAlert, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  Scale, 
  Headphones, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Search,
  Filter,
  CheckCircle,
  Clock
} from 'lucide-react';
import { SupportResource } from '../../types';
import { storageService } from '../../services/storageService';
import { EvidencePreservationGuide } from './EvidencePreservationGuide';

export const SupportNavigatorModule: React.FC = () => {
  const [resources, setResources] = useState<SupportResource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showEvidenceGuide, setShowEvidenceGuide] = useState<boolean>(false);

  useEffect(() => {
    setResources(storageService.getSupportResources());
    const unsubscribe = storageService.subscribe(() => {
      setResources(storageService.getSupportResources());
    });
    return unsubscribe;
  }, []);

  const handleToggleSave = (id: string) => {
    storageService.toggleSaveResource(id);
  };

  const filteredResources = resources.filter(res => {
    const matchesCat = 
      selectedCategory === 'all' 
        ? true 
        : selectedCategory === 'saved'
        ? Boolean(res.isSaved)
        : res.category === selectedCategory;

    const matchesSearch = 
      !searchQuery.trim() ||
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.issuingOrganization.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Calm Header */}
      <div className="bg-gradient-to-r from-[#180E28] via-[#2A1845] to-[#1E112A] text-white p-6 rounded-2xl shadow-md border border-white/10 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-500/20 text-rose-300 rounded-lg">
                <HeartHandshake className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold tracking-tight">Survivor Support Navigator</h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              A confidential, calm, and trauma-informed directory of official statutory authorities, verified helplines, free legal aid, and safe evidence-preservation protocols across India.
            </p>
          </div>

          <button
            onClick={() => setShowEvidenceGuide(!showEvidenceGuide)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-2 border border-white/20 transition-colors self-start md:self-auto shrink-0"
          >
            <FileText className="w-4 h-4 text-rose-300" />
            <span>{showEvidenceGuide ? 'View Helpline Directory' : 'Evidence Preservation Guide'}</span>
          </button>
        </div>

        {/* Emergency Disclaimer Banner */}
        <div className="bg-rose-500/20 border border-rose-400/30 rounded-xl p-3 text-xs text-rose-100 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Immediate Danger Notice:</strong> SAAHARA AI does not replace emergency dispatch services. If you or someone you know is in immediate physical danger, dial <strong>112</strong> immediately.
          </p>
        </div>
      </div>

      {/* Show Evidence Guide Toggle View */}
      {showEvidenceGuide ? (
        <EvidencePreservationGuide />
      ) : (
        <>
          {/* Quick Helpline Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {[
              { num: '112', label: 'All Emergency', sub: 'Police, Fire, Med', col: 'text-rose-700 bg-rose-50 border-rose-200' },
              { num: '1091', label: 'Women Police', sub: 'Urgent Patrol', col: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
              { num: '181', label: 'Distress (WHL)', sub: 'Shelter & Crisis', col: 'text-purple-700 bg-purple-50 border-purple-200' },
              { num: '15100', label: 'NALSA Legal', sub: 'Free Legal Aid', col: 'text-teal-700 bg-teal-50 border-teal-200' },
              { num: '14416', label: 'Tele-MANAS', sub: 'Mental Health 24x7', col: 'text-sky-700 bg-sky-50 border-sky-200' },
              { num: '1930', label: 'Cyber Crime', sub: 'Harassment/Extortion', col: 'text-slate-800 bg-slate-100 border-slate-300' },
            ].map(item => (
              <a
                key={item.num}
                href={`tel:${item.num}`}
                className={`p-3 rounded-xl border ${item.col} flex flex-col justify-between hover:scale-[1.02] transition-transform`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div className="text-xl font-black mt-1">{item.num}</div>
                <span className="text-[10px] text-slate-500 mt-0.5">{item.sub}</span>
              </a>
            ))}
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto text-xs">
              {[
                { id: 'all', label: 'All Resources' },
                { id: 'emergency', label: 'Emergency Hotlines' },
                { id: 'legal_aid', label: 'Legal Aid & Courts' },
                { id: 'counseling_mental_health', label: 'Mental Health' },
                { id: 'cyber_safety', label: 'Cyber Harassment' },
                { id: 'saved', label: 'Bookmarked' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources, topics..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Resource Cards */}
          {filteredResources.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No support resources match your filter</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for general keywords like &ldquo;legal&rdquo;, &ldquo;shelter&rdquo;, &ldquo;police&rdquo;, or &ldquo;emergency&rdquo;.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResources.map((res) => (
                <div 
                  key={res.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          {res.issuingOrganization}
                        </span>
                        <h3 className="font-bold text-sm text-slate-900 mt-0.5">{res.name}</h3>
                      </div>

                      <button
                        onClick={() => handleToggleSave(res.id)}
                        className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                          res.isSaved 
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                            : 'text-slate-400 hover:text-slate-600 border-slate-200'
                        }`}
                        title={res.isSaved ? 'Remove bookmark' : 'Bookmark resource'}
                      >
                        {res.isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* What this helps with: simpleExplanation */}
                    {res.simpleExplanation && (
                      <div className="p-3 bg-indigo-50/70 border border-indigo-100/90 rounded-xl space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 block flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-indigo-600" />
                          What this helps with:
                        </span>
                        <p className="text-xs text-indigo-950 font-medium leading-relaxed">
                          {res.simpleExplanation}
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {res.description}
                    </p>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-700 space-y-1">
                      <div><strong>Eligibility / Access:</strong> {res.eligibility}</div>
                      {res.coverage && <div><strong>Coverage:</strong> {res.coverage}</div>}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      {res.contactNumber && (
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            {res.contactNumber}
                          </span>
                          <a
                            href={`tel:${res.contactNumber}`}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call</span>
                          </a>
                        </div>
                      )}

                      <a
                        href={res.officialSourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-lg font-semibold flex items-center gap-1.5 text-xs border border-indigo-200 transition-colors shadow-xs"
                        title={`Visit official government portal: ${res.officialSourceUrl}`}
                      >
                        <span>Inspect Official Source</span>
                        <ExternalLink className="w-3 h-3 text-indigo-600" />
                      </a>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-50 flex-wrap gap-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        Last checked: {res.dateChecked}
                      </span>
                      <span>Verified via {res.verifiedBy}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
