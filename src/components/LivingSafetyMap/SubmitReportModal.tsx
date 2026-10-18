import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  AlertCircle, 
  CheckCircle, 
  ShieldAlert, 
  Clock, 
  FileText,
  History,
  CheckCircle2,
  HelpCircle,
  Layers
} from 'lucide-react';
import { ObservationCategory, SafetyObservation, SearchableLocation } from '../../types';
import { storageService, normalizeLocationKey } from '../../services/storageService';

interface SubmitReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedLocation?: SearchableLocation | null;
  targetExistingIssue?: SafetyObservation | null;
}

export const SubmitReportModal: React.FC<SubmitReportModalProps> = ({ 
  isOpen, 
  onClose,
  preselectedLocation,
  targetExistingIssue
}) => {
  const [category, setCategory] = useState<ObservationCategory>('street_lighting');
  const [approximateArea, setApproximateArea] = useState('');
  const [timeObserved, setTimeObserved] = useState('Today, around 8:30 PM');
  const [shortDescription, setShortDescription] = useState('');
  const [supportingSource, setSupportingSource] = useState('');
  const [isInfrastructure, setIsInfrastructure] = useState(true);
  const [conditionOutcome, setConditionOutcome] = useState<'working' | 'defective' | 'improved' | 'concerning'>('working');
  
  // Existing issue matching state
  const [detectedExistingIssue, setDetectedExistingIssue] = useState<SafetyObservation | null>(null);
  const [updateMode, setUpdateMode] = useState<'update_existing' | 'create_new'>('update_existing');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ message: string; isUpdate: boolean } | null>(null);

  useEffect(() => {
    if (preselectedLocation) {
      setApproximateArea(preselectedLocation.name);
    } else if (targetExistingIssue) {
      setApproximateArea(targetExistingIssue.approximateArea);
      setCategory(targetExistingIssue.category);
      setDetectedExistingIssue(targetExistingIssue);
    }
  }, [preselectedLocation, targetExistingIssue, isOpen]);

  // Check for existing matching issue when location or category changes
  useEffect(() => {
    if (!approximateArea.trim()) {
      setDetectedExistingIssue(null);
      return;
    }
    const match = storageService.findMatchingIssue(approximateArea, category);
    setDetectedExistingIssue(match || null);
  }, [approximateArea, category]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approximateArea.trim() || !shortDescription.trim()) return;

    setIsSubmitting(true);

    // Coordinates: use existing issue coords if available, or preselected location, or nearby jitter
    let coords: [number, number] = [12.9716, 77.6412];
    if (detectedExistingIssue && updateMode === 'update_existing') {
      coords = detectedExistingIssue.coordinates;
    } else if (preselectedLocation) {
      coords = preselectedLocation.coordinates;
    } else {
      coords = [
        12.9716 + (Math.random() - 0.5) * 0.015,
        77.6412 + (Math.random() - 0.5) * 0.015
      ];
    }

    setTimeout(() => {
      const result = storageService.addObservation({
        category,
        approximateArea: approximateArea.trim(),
        coordinates: coords,
        radiusMeters: 180,
        timeObserved: timeObserved.trim(),
        shortDescription: shortDescription.trim(),
        supportingSource: supportingSource.trim() || 'First-hand observation',
        isInfrastructure,
        conditionOutcome,
        existingIssueId: updateMode === 'update_existing' && detectedExistingIssue ? detectedExistingIssue.issueId : undefined,
      });

      setIsSubmitting(false);
      setSuccessInfo({
        message: result.isUpdateToExisting 
          ? `Successfully appended your observation to the existing issue at ${approximateArea}. Status updated to: ${result.observation.status.replace(/_/g, ' ')}.`
          : `Created new observation issue at ${approximateArea}.`,
        isUpdate: result.isUpdateToExisting
      });

      setTimeout(() => {
        setSuccessInfo(null);
        onClose();
      }, 1800);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#180E28] via-[#2D1B48] to-[#1E112A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <MapPin className="w-5 h-5 text-rose-300" />
            </div>
            <div>
              <h2 className="text-base font-bold">Submit Safety Observation</h2>
              <p className="text-xs text-slate-300">Location-aware observation reporting with history tracking</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-300 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safeguard Notice */}
        <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs text-amber-950 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p>
            <strong>Responsible Posting:</strong> Do not name private individuals or publish personal accusations. Reports must be objective environmental observations (lighting, transit stops, walkways).
          </p>
        </div>

        {/* Form Body */}
        {successInfo ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {successInfo.isUpdate ? 'Issue Timeline Updated' : 'New Observation Recorded'}
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">{successInfo.message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
            {/* Category Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Observation Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ObservationCategory)}
                className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="street_lighting">Street Lighting (Defect or Active Luminaires)</option>
                <option value="public_transport_stop">Public Transport Stop (Crowd, Visibility, Shelter)</option>
                <option value="infrastructure_problem">Infrastructure Problem (Barricades, Pavement, Drainage)</option>
                <option value="accessibility">Accessibility (Ramps, Pavements, Tactile Paths)</option>
                <option value="community_observation">Community Observation (Civic Presence, Shops Open)</option>
                <option value="other_concern">Other Public-Space Concern</option>
              </select>
            </div>

            {/* Approximate Area Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Approximate Public Landmark or Junction
              </label>
              <input
                type="text"
                required
                value={approximateArea}
                onChange={(e) => setApproximateArea(e.target.value)}
                placeholder="e.g. Indira Gandhi Metro Station or 12th Main Road Junction"
                className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Approximate public area only. No private home doors or specific apartments.
              </span>
            </div>

            {/* LOCATION-AND-CATEGORY GROUPING CONFIRMATION BANNER */}
            {detectedExistingIssue && (
              <div className="p-3.5 bg-indigo-50/80 border border-indigo-200 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                  <Layers className="w-4 h-4 text-indigo-700" />
                  <span>Existing Issue Detected at This Location</span>
                </div>
                <p className="text-indigo-900 leading-relaxed text-[11px]">
                  An active report for <strong>{category.replace(/_/g, ' ')}</strong> already exists at <strong>{detectedExistingIssue.approximateArea}</strong> (Current Status: {detectedExistingIssue.status.replace(/_/g, ' ')}).
                </p>

                <div className="space-y-1.5 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-indigo-950">
                    <input
                      type="radio"
                      name="updateMode"
                      checked={updateMode === 'update_existing'}
                      onChange={() => setUpdateMode('update_existing')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Append to existing issue timeline (Preserves history & recalculates status)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input
                      type="radio"
                      name="updateMode"
                      checked={updateMode === 'create_new'}
                      onChange={() => setUpdateMode('create_new')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Create an entirely separate issue</span>
                  </label>
                </div>
              </div>
            )}

            {/* Condition Outcome Choice */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Observed Condition Outcome
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setConditionOutcome('working')}
                  className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                    conditionOutcome === 'working' || conditionOutcome === 'improved'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  ✓ Working / Improved
                </button>
                <button
                  type="button"
                  onClick={() => setConditionOutcome('defective')}
                  className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                    conditionOutcome === 'defective' || conditionOutcome === 'concerning'
                      ? 'bg-rose-50 border-rose-300 text-rose-950 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  ⚠ Defective / Obstructed
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Time Observed
                </label>
                <input
                  type="text"
                  required
                  value={timeObserved}
                  onChange={(e) => setTimeObserved(e.target.value)}
                  placeholder="e.g. Today, 8:40 PM"
                  className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nature of Report
                </label>
                <select
                  value={isInfrastructure ? 'infra' : 'observation'}
                  onChange={(e) => setIsInfrastructure(e.target.value === 'infra')}
                  className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  <option value="infra">Physical Infrastructure</option>
                  <option value="observation">Temporal First-Hand Note</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Observation Description
              </label>
              <textarea
                required
                rows={3}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="e.g. Streetlight working when checked; footpath clear of repair barricades."
                className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supporting Source / Civic Complaint ID (Optional)
              </label>
              <input
                type="text"
                value={supportingSource}
                onChange={(e) => setSupportingSource(e.target.value)}
                placeholder="e.g. Personal walk-through or BBMP Sahaaya Complaint #10294"
                className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-bold rounded-xl shadow-md transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Recording...' : detectedExistingIssue && updateMode === 'update_existing' ? 'Update Issue Timeline' : 'Publish New Issue'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
