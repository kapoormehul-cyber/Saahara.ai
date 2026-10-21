import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  Phone, 
  ShieldAlert, 
  Bookmark, 
  BookmarkCheck, 
  Scale, 
  Headphones, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Search,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Languages,
  Compass,
  Home,
  Lock,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { SupportResource } from '../../types';
import { storageService } from '../../services/storageService';
import { EvidencePreservationGuide } from './EvidencePreservationGuide';
import { 
  SupportLanguage, 
  HelpCategoryId, 
  HELP_CATEGORIES, 
  UI_STRINGS 
} from './supportTranslations';

export const SupportNavigatorModule: React.FC = () => {
  const [resources, setResources] = useState<SupportResource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<HelpCategoryId | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showEvidenceGuide, setShowEvidenceGuide] = useState<boolean>(false);
  const [language, setLanguage] = useState<SupportLanguage>('en');
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const handleCopyDetails = async (res: SupportResource) => {
    const textLines = [
      `SAAHARA AI — Verified Support Resource`,
      `Service: ${res.name}`,
      `Issuing Authority: ${res.issuingOrganization}`,
      res.contactNumber ? `Helpline / Dial: ${res.contactNumber}` : '',
      res.alternateContact ? `Alternate Contact: ${res.alternateContact}` : '',
      `What this helps with: ${res.simpleExplanation}`,
      `Eligibility & Access: ${res.eligibility}`,
      res.coverage ? `Coverage: ${res.coverage}` : '',
      `Verification: ${res.verifiedBy} (Date: ${res.dateChecked})`
    ].filter(Boolean).join('\n');

    let copied = false;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textLines);
        copied = true;
      }
    } catch {
      // Fallback below
    }

    if (!copied) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = textLines;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        copied = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        // ignore
      }
    }

    setCopiedId(res.id);
    setTimeout(() => {
      setCopiedId((curr) => (curr === res.id ? null : curr));
    }, 2500);
  };

  const t = UI_STRINGS[language];

  // Active Category Definition
  const activeCategoryDef = HELP_CATEGORIES.find(c => c.id === selectedCategory);

  const filteredResources = resources.filter(res => {
    // 1. Category Filter
    let matchesCat = true;
    if (selectedCategory === 'all') {
      matchesCat = true;
    } else if (selectedCategory === 'saved') {
      matchesCat = Boolean(res.isSaved);
    } else if (activeCategoryDef) {
      matchesCat = activeCategoryDef.matchedResourceIds.includes(res.id);
    }

    // 2. Search Filter
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = 
      !q ||
      res.name.toLowerCase().includes(q) ||
      res.description.toLowerCase().includes(q) ||
      res.issuingOrganization.toLowerCase().includes(q) ||
      res.simpleExplanation.toLowerCase().includes(q) ||
      (res.contactNumber && res.contactNumber.includes(q));

    return matchesCat && matchesSearch;
  });

  const getCategoryIcon = (iconType: string) => {
    switch (iconType) {
      case 'emergency': return ShieldAlert;
      case 'domestic': return Home;
      case 'cyber': return Lock;
      case 'legal': return Scale;
      case 'emotional': return Headphones;
      case 'other': return HelpCircle;
      default: return HeartHandshake;
    }
  };

  return (
    <div className="space-y-6">
      {/* Calm Header */}
      <div className="bg-gradient-to-r from-[#180E28] via-[#2A1845] to-[#1E112A] text-white p-6 rounded-2xl shadow-md border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-500/20 text-rose-300 rounded-lg">
                <HeartHandshake className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold tracking-tight">{t.title}</h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Language Toggle (EN / HI) */}
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/20">
              <Languages className="w-3.5 h-3.5 text-slate-300 ml-1.5 mr-0.5" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  language === 'en' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
                title="Switch to English"
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  language === 'hi' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
                title="हिन्दी में बदलें"
              >
                हिन्दी
              </button>
            </div>

            <button
              onClick={() => setShowEvidenceGuide(!showEvidenceGuide)}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-2 border border-white/20 transition-colors shrink-0"
            >
              <FileText className="w-4 h-4 text-rose-300" />
              <span>{showEvidenceGuide ? t.directoryBtn : t.evidenceBtn}</span>
            </button>
          </div>
        </div>

        {/* Immediate Emergency Disclaimer Banner */}
        <div className="bg-rose-500/20 border border-rose-400/30 rounded-xl p-3 text-xs text-rose-100 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>{t.dangerNoticeTitle}</strong> {t.dangerNoticeBody}
          </p>
        </div>
      </div>

      {/* Show Evidence Guide Toggle View */}
      {showEvidenceGuide ? (
        <EvidencePreservationGuide />
      ) : (
        <>
          {/* Quick Helpline Strip (Always Visible for Emergency Safety) */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {t.quickHelplinesTitle}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {[
                { num: '112', labelEn: 'All Emergency', labelHi: 'सभी आपातकाल', subEn: 'Police, Fire, Med', subHi: 'पुलिस, आग, चिकित्सा', col: 'text-rose-700 bg-rose-50 border-rose-200' },
                { num: '1091', labelEn: 'Women Police', labelHi: 'महिला पुलिस', subEn: 'Urgent Patrol', subHi: 'तत्काल गश्ती', col: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
                { num: '181', labelEn: 'Distress (WHL)', labelHi: 'महिला हेल्पलाइन', subEn: 'Shelter & Crisis', subHi: 'आश्रय एवं संकट', col: 'text-purple-700 bg-purple-50 border-purple-200' },
                { num: '15100', labelEn: 'NALSA Legal', labelHi: 'नालसा कानूनी', subEn: 'Free Legal Aid', subHi: 'मुफ्त कानूनी सहायता', col: 'text-teal-700 bg-teal-50 border-teal-200' },
                { num: '14416', labelEn: 'Tele-MANAS', labelHi: 'टेली-मानस', subEn: 'Mental Health 24x7', subHi: 'मानसिक स्वास्थ्य 24x7', col: 'text-sky-700 bg-sky-50 border-sky-200' },
                { num: '1930', labelEn: 'Cyber Crime', labelHi: 'साइबर अपराध', subEn: 'Harassment/Extortion', subHi: 'धोखाधड़ी/उत्पीड़न', col: 'text-slate-800 bg-slate-100 border-slate-300' },
              ].map(item => (
                <a
                  key={item.num}
                  href={`tel:${item.num}`}
                  className={`p-3 rounded-xl border ${item.col} flex flex-col justify-between hover:scale-[1.02] transition-transform`}
                  title={`${language === 'hi' ? 'कॉल करें' : 'Call'} ${item.num}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {language === 'hi' ? item.labelHi : item.labelEn}
                    </span>
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xl font-black mt-1">{item.num}</div>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    {language === 'hi' ? item.subHi : item.subEn}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* "Find My Help" Category Selector */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
                    <Compass className="w-4 h-4" />
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{t.findMyHelpTitle}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.findMyHelpSubtitle}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {t.showAllCategories}
                </button>
                <button
                  onClick={() => setSelectedCategory('saved')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    selectedCategory === 'saved'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Bookmark className="w-3 h-3" />
                  <span>{t.bookmarkedCategory}</span>
                </button>
              </div>
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {HELP_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const Icon = getCategoryIcon(cat.iconType);
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-400/40'
                        : 'bg-slate-50/80 hover:bg-slate-100/90 text-slate-800 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`p-2 rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-white text-indigo-700 border border-slate-200/90 shadow-2xs'}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-indigo-900">
                          Selected
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm leading-snug">
                        {language === 'hi' ? cat.labelHi : cat.labelEn}
                      </h4>
                      <p className={`text-[11px] mt-1 leading-relaxed ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                        {language === 'hi' ? cat.subHi : cat.subEn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actionable Next Steps (Rendered when a specific category is selected) */}
          {activeCategoryDef && (
            <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-50/90 to-purple-50/90 rounded-2xl border border-indigo-100 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-indigo-100/80">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-600 text-white rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-indigo-950">
                    {t.actionPlanTitle}: {language === 'hi' ? activeCategoryDef.labelHi : activeCategoryDef.labelEn}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>{t.showAllCategories}</span>
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-indigo-950/90 pt-1">
                {(language === 'hi' ? activeCategoryDef.actionStepsHi : activeCategoryDef.actionStepsEn).map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 bg-white/80 p-3 rounded-xl border border-indigo-100 shadow-2xs">
                    <span className="font-bold text-indigo-700 shrink-0 font-mono text-xs mt-0.5">{idx + 1}.</span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Search Bar & Result Summary */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="text-xs text-slate-600 font-medium">
              Showing <strong>{filteredResources.length}</strong> verified support resource{filteredResources.length === 1 ? '' : 's'}
              {activeCategoryDef && (
                <span className="ml-1 text-indigo-600 font-semibold">
                  ({language === 'hi' ? activeCategoryDef.labelHi : activeCategoryDef.labelEn})
                </span>
              )}
            </div>

            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Resource Cards */}
          {filteredResources.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">{t.noResultsTitle}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {t.noResultsText}
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                {t.resetFilters}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResources.map((res) => (
                <div 
                  key={res.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          {res.issuingOrganization}
                        </span>
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 mt-0.5">{res.name}</h3>
                      </div>

                      <button
                        onClick={() => handleToggleSave(res.id)}
                        className={`p-1.5 rounded-lg border transition-colors shrink-0 cursor-pointer ${
                          res.isSaved 
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                            : 'text-slate-400 hover:text-slate-600 border-slate-200'
                        }`}
                        title={res.isSaved ? t.removeBookmarkTitle : t.bookmarkTitle}
                      >
                        {res.isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* What this helps with: simpleExplanation highlighted */}
                    {res.simpleExplanation && (
                      <div className="p-3 bg-indigo-50/70 border border-indigo-100/90 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 block flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                          {t.whatItHelpsWith}
                        </span>
                        <p className="text-xs text-indigo-950 font-medium leading-relaxed">
                          {res.simpleExplanation}
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {res.description}
                    </p>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-700 space-y-1">
                      <div><strong>{t.eligibility}</strong> {res.eligibility}</div>
                      {res.coverage && <div><strong>{t.coverage}</strong> {res.coverage}</div>}
                    </div>
                  </div>

                  {/* Actions & Verification Footer */}
                  <div className="pt-3 border-t border-slate-100 space-y-3 text-xs">
                    {/* Primary Contact & Copy Action Row */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      {/* Left: Call Action if Contact Number is Available */}
                      {res.contactNumber ? (
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            {res.contactNumber}
                          </span>
                          <a
                            href={`tel:${res.contactNumber}`}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                            title={`${t.callBtn} ${res.contactNumber}`}
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>{t.callBtn}</span>
                          </a>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs italic">
                          Online official reporting / referral
                        </span>
                      )}

                      {/* Right: Copy Details Action as Reliable Fallback */}
                      <button
                        onClick={() => handleCopyDetails(res)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                          copiedId === res.id
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                        }`}
                        title="Copy complete verified resource details to clipboard"
                      >
                        {copiedId === res.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{t.copiedBtn}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-600" />
                            <span>{t.copyBtn}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {res.alternateContact && (
                      <div className="text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-600">Additional Contact:</span> {res.alternateContact}
                      </div>
                    )}

                    {/* Source Name & Verification Date */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-50 flex-wrap gap-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {t.lastChecked} {res.dateChecked}
                      </span>
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-indigo-500" />
                        {t.verifiedVia} {res.verifiedBy}
                      </span>
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
