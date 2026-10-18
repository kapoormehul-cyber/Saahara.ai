import React, { useState } from 'react';
import { X, Users, MapPin, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { UserProfile } from '../../types';
import { storageService } from '../../services/storageService';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [postType, setPostType] = useState<'walking_companion' | 'public_meeting_point' | 'neighborhood_update'>('walking_companion');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [approximateArea, setApproximateArea] = useState('Indiranagar / Metro Corridor');
  const [suggestedMeetingPoint, setSuggestedMeetingPoint] = useState('Metro Station Gate 1 Concourse (Ticket Counter)');
  const [plannedTime, setPlannedTime] = useState('Tonight, 8:45 PM');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    storageService.addCommunityPost({
      authorId: currentUser.id,
      authorName: currentUser.displayName,
      authorCategory: currentUser.category,
      authorField: currentUser.broadField,
      approximateArea: approximateArea.trim(),
      type: postType,
      title: title.trim(),
      content: content.trim(),
      suggestedMeetingPoint: suggestedMeetingPoint.trim(),
      plannedTime: plannedTime.trim(),
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
        <div className="bg-[#23153C] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl text-rose-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Post to Saheli Circle</h2>
              <p className="text-xs text-slate-300">Request a walking companion or share local public advice</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-300 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-teal-50 border-b border-teal-100 text-xs text-teal-950 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <p>
            <strong>Public Meeting Rule:</strong> Walking companions must always meet in bright, busy public areas (metro stations, bus terminals, cafe entrances). Never coordinate pickups at private residences.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900">Post Shared with Saheli Circle</h3>
            <p className="text-xs text-slate-500">Your post is now visible to nearby verified community members.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Post Category
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPostType('walking_companion')}
                  className={`py-2 px-2 rounded-xl font-medium border text-center transition-all ${
                    postType === 'walking_companion'
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Walking Buddy
                </button>
                <button
                  type="button"
                  onClick={() => setPostType('public_meeting_point')}
                  className={`py-2 px-2 rounded-xl font-medium border text-center transition-all ${
                    postType === 'public_meeting_point'
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Safe Meeting Spot
                </button>
                <button
                  type="button"
                  onClick={() => setPostType('neighborhood_update')}
                  className={`py-2 px-2 rounded-xl font-medium border text-center transition-all ${
                    postType === 'neighborhood_update'
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Local Civic Tip
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Post Headline
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Walking from Metro Gate 1 to 100ft Road around 8:45 PM"
                className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Approximate Corridor
                </label>
                <input
                  type="text"
                  required
                  value={approximateArea}
                  onChange={(e) => setApproximateArea(e.target.value)}
                  placeholder="e.g. Indiranagar 100ft Rd"
                  className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Planned Departure / Time
                </label>
                <input
                  type="text"
                  required
                  value={plannedTime}
                  onChange={(e) => setPlannedTime(e.target.value)}
                  placeholder="e.g. Tonight, 8:45 PM"
                  className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Suggested Public Meeting Point
              </label>
              <input
                type="text"
                required
                value={suggestedMeetingPoint}
                onChange={(e) => setSuggestedMeetingPoint(e.target.value)}
                placeholder="e.g. Outside Metro Station Gate 1 Ticket Counter"
                className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Details & Safety Notes
              </label>
              <textarea
                required
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share context on your route, transit timing, and public landmarks."
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
                className="px-5 py-2 bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
              >
                Share with Circle
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
