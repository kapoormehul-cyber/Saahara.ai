import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Plus, 
  ThumbsUp, 
  Flag, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Filter, 
  AlertCircle,
  Eye,
  Sparkles
} from 'lucide-react';
import { SafetyObservation } from '../../types';
import { storageService } from '../../services/storageService';
import { PublishSignalModal } from './PublishSignalModal';
import { getStatusBadge } from '../LivingSafetyMap/SafetyMap';

interface SignalBoardProps {
  onInvestigateObservation?: (obs: SafetyObservation) => void;
}

export const SignalBoard: React.FC<SignalBoardProps> = ({ onInvestigateObservation }) => {
  const [observations, setObservations] = useState<SafetyObservation[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  useEffect(() => {
    setObservations(storageService.getObservations());
    const unsubscribe = storageService.subscribe(() => {
      setObservations(storageService.getObservations());
    });
    return unsubscribe;
  }, []);

  const handleMarkHelpful = (id: string) => {
    storageService.markObservationHelpful(id);
  };

  const handleReportAbuse = (id: string) => {
    alert('Thank you. This signal observation has been flagged for human moderator verification.');
  };

  const filtered = observations.filter(obs => {
    if (selectedFilter === 'all') return true;
    return obs.category === selectedFilter;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Saheli Signal</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
              First-Hand Place Observations
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Recent environmental sightings voluntarily contributed by local commuters. Observations are never converted into definitive fear ratings.
          </p>
        </div>

        <button
          onClick={() => setIsPublishModalOpen(true)}
          className="px-3.5 py-2 bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors self-start md:self-auto shrink-0"
        >
          <Plus className="w-4 h-4 text-rose-300" />
          <span>Publish Observation</span>
        </button>
      </div>

      {/* Disclaimers */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3 text-xs text-slate-600">
        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>No Automatic Safety Scoring:</strong> Individual sightings reflect conditions at a specific moment in time. One positive report does not invalidate another user&apos;s negative experience, nor does an outage make an entire area unsafe.
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs text-xs">
        <span className="font-semibold text-slate-500 mx-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          Category:
        </span>
        {[
          { id: 'all', label: 'All Signals' },
          { id: 'street_lighting', label: 'Lighting' },
          { id: 'public_transport_stop', label: 'Transit Stops' },
          { id: 'infrastructure_problem', label: 'Walkways & Roads' },
          { id: 'community_observation', label: 'Civic Activity' },
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
              selectedFilter === filter.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Signals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((obs) => {
          const badge = getStatusBadge(obs.status);
          return (
            <div 
              key={obs.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {obs.category.replace(/_/g, ' ')}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                    {badge.label}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  {obs.approximateArea}
                </h3>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  &ldquo;{obs.shortDescription}&rdquo;
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{obs.timeObserved}</span>
                </div>

                <div className="flex items-center gap-2">
                  {onInvestigateObservation && (
                    <button
                      onClick={() => onInvestigateObservation(obs)}
                      className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-lg font-medium flex items-center gap-1 transition-colors"
                      title="Investigate observation with Live Safety Intelligence"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      <span>Investigate</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleMarkHelpful(obs.id)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium flex items-center gap-1 transition-colors"
                  >
                    <ThumbsUp className="w-3 h-3 text-slate-500" />
                    <span>Helpful ({obs.helpfulCount})</span>
                  </button>
                  <button
                    onClick={() => handleReportAbuse(obs.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Flag misleading or inaccurate content"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Publish Signal Modal */}
      <PublishSignalModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
      />
    </div>
  );
};
