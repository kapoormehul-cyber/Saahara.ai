import React, { useState } from 'react';
import { 
  Lightbulb, 
  Bus, 
  AlertTriangle, 
  Accessibility, 
  Eye, 
  CheckCircle2, 
  ThumbsUp, 
  Clock, 
  MapPin, 
  ShieldCheck,
  Building,
  History,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import { SafetyObservation } from '../../types';
import { getStatusBadge } from './SafetyMap';

interface SafetyListViewProps {
  observations: SafetyObservation[];
  onCorroborate: (id: string) => void;
  onMarkHelpful: (id: string) => void;
  onAddObservationToIssue?: (obs: SafetyObservation) => void;
}

export const SafetyListView: React.FC<SafetyListViewProps> = ({
  observations,
  onCorroborate,
  onMarkHelpful,
  onAddObservationToIssue,
}) => {
  const [expandedHistories, setExpandedHistories] = useState<Record<string, boolean>>({});

  const toggleHistory = (issueId: string) => {
    setExpandedHistories(prev => ({
      ...prev,
      [issueId]: !prev[issueId]
    }));
  };

  if (observations.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
        <Eye className="w-10 h-10 text-slate-300 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">No observations match your current filter</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Try adjusting your search location, category, or status filters to view reports across India.
        </p>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'street_lighting':
        return <Lightbulb className="w-4 h-4 text-amber-600" />;
      case 'public_transport_stop':
        return <Bus className="w-4 h-4 text-sky-600" />;
      case 'infrastructure_problem':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'accessibility':
        return <Accessibility className="w-4 h-4 text-teal-600" />;
      default:
        return <Eye className="w-4 h-4 text-purple-600" />;
    }
  };

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'working':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">Observed Working</span>;
      case 'defective':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">Observed Defective</span>;
      case 'improved':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">Observed Improvement</span>;
      case 'concerning':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-300">Condition Concerning</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">Neutral Observation</span>;
    }
  };

  return (
    <div className="space-y-3">
      {observations.map((obs) => {
        const badge = getStatusBadge(obs.status);
        const historyList = obs.observationsHistory || [];
        const isHistoryExpanded = !!expandedHistories[obs.id];

        return (
          <div 
            key={obs.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-100 rounded-xl shrink-0">
                  {getCategoryIcon(obs.category)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {obs.category.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                      {obs.issueId || obs.id}
                    </span>
                    {obs.isHistoricalConcern && (
                      <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        Historical Record (Preserved)
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    {obs.approximateArea}
                    {obs.city && <span className="text-xs font-normal text-slate-500">({obs.city})</span>}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}>
                  {badge.label}
                </span>
              </div>
            </div>

            {/* Current Summary Description */}
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
              {obs.shortDescription}
            </p>

            {/* Observation History Timeline Accordion */}
            {historyList.length > 0 && (
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => toggleHistory(obs.id)}
                  className="w-full px-3.5 py-2 flex items-center justify-between text-left hover:bg-slate-100/60 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <History className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Observation History ({historyList.length} recorded {historyList.length === 1 ? 'observation' : 'observations'})</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                    <span>{isHistoryExpanded ? 'Hide Timeline' : 'View Timeline'}</span>
                    {isHistoryExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {isHistoryExpanded && (
                  <div className="p-3.5 pt-1 space-y-3 border-t border-slate-200">
                    <p className="text-[11px] text-slate-500 italic">
                      Chronological observations grouped for this location. New reports preserve original history rather than overwriting.
                    </p>
                    <div className="relative pl-4 space-y-3 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100">
                      {historyList.map((entry, idx) => (
                        <div key={entry.id || idx} className="relative text-xs space-y-1">
                          <div className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-2 ring-white" />
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-slate-900">{entry.observedAt}</span>
                            <span className="text-[10px] text-slate-400">by {entry.reportedBy}</span>
                            {getOutcomeBadge(entry.conditionOutcome)}
                          </div>
                          <p className="text-[11px] text-slate-600 leading-snug">
                            {entry.description}
                          </p>
                          {entry.supportingSource && (
                            <span className="text-[10px] text-slate-400 block">
                              Source: {entry.supportingSource}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Meta details & source */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Latest check: <strong className="text-slate-700">{obs.timeObserved}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <strong>{obs.confirmationsCount}</strong> community confirmations
                </span>
                {obs.supportingSource && (
                  <span className="text-slate-400 hidden md:inline">
                    • Source: {obs.supportingSource}
                  </span>
                )}
              </div>

              {/* Interaction buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {onAddObservationToIssue && (
                  <button
                    onClick={() => onAddObservationToIssue(obs)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                    title="Add a new observation to this existing issue"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-indigo-100" />
                    <span>Update Issue</span>
                  </button>
                )}

                <button
                  onClick={() => onCorroborate(obs.id)}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-lg text-xs font-semibold flex items-center gap-1 border border-indigo-200 transition-colors"
                  title="Confirm you witnessed similar conditions recently"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Corroborate</span>
                </button>

                <button
                  onClick={() => onMarkHelpful(obs.id)}
                  className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 flex items-center gap-1 transition-colors"
                  title="Mark as helpful"
                >
                  <ThumbsUp className="w-3 h-3 text-slate-500" />
                  <span>Helpful ({obs.helpfulCount})</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

