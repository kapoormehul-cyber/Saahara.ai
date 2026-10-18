import React, { useState } from 'react';
import { X, Radio, MapPin, Clock, Eye, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { ObservationCategory, SafetyObservation } from '../../types';
import { storageService } from '../../services/storageService';

interface PublishSignalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublishSignalModal: React.FC<PublishSignalModalProps> = ({ isOpen, onClose }) => {
  const [area, setArea] = useState('100ft Road Metro Concourse, Indiranagar');
  const [category, setCategory] = useState<ObservationCategory>('street_lighting');
  const [description, setDescription] = useState('');
  const [observationTime, setObservationTime] = useState('Just passed by (10 mins ago)');
  const [visibility, setVisibility] = useState<'approximate_community' | 'public_board'>('approximate_community');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !area.trim()) return;

    storageService.addObservation({
      category,
      approximateArea: area.trim(),
      coordinates: [12.9716, 77.6412],
      radiusMeters: 200,
      timeObserved: observationTime.trim(),
      shortDescription: description.trim(),
      status: 'newly_reported',
      supportingSource: 'First-hand Saheli Signal place observation',
      isInfrastructure: category === 'street_lighting' || category === 'infrastructure_problem',
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        <div className="bg-gradient-to-r from-[#201435] to-[#401C48] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl text-rose-300">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Publish Saheli Signal</h2>
              <p className="text-xs text-rose-200">Share first-hand civic observations about public places</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-300 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs text-amber-950 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p>
            Observations must describe factual public environment conditions (e.g. lighting, crowds, sidewalks). Individual people must never be targeted or accused.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900">Saheli Signal Published</h3>
            <p className="text-xs text-slate-500">Your observation is now active on the community board.</p>
          </div>
        ) : (
          <form onSubmit={handlePublish} className="p-6 overflow-y-auto space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Public Area / Landmark
              </label>
              <input
                type="text"
                required
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Indiranagar Metro Station Bus Bay"
                className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ObservationCategory)}
                  className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  <option value="street_lighting">Street Lighting</option>
                  <option value="public_transport_stop">Transit Stop / Crowd</option>
                  <option value="infrastructure_problem">Walkway / Construction</option>
                  <option value="accessibility">Accessibility</option>
                  <option value="community_observation">Civic Visibility</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Observation Time
                </label>
                <input
                  type="text"
                  required
                  value={observationTime}
                  onChange={(e) => setObservationTime(e.target.value)}
                  placeholder="e.g. 15 mins ago / Tonight 8 PM"
                  className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Factual Place Observation
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. I passed this bus stop recently; it was well-lit and multiple commuters were waiting. Shops nearby are open."
                className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Visibility Settings
              </label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === 'approximate_community'}
                    onChange={() => setVisibility('approximate_community')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Approximate Area Community (No precise GPS coordinate exposure)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === 'public_board'}
                    onChange={() => setVisibility('public_board')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Public SAAHARA Safety Board</span>
                </label>
              </div>
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
                className="px-5 py-2 bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
              >
                Publish Signal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
