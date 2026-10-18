import React from 'react';
import { X, ShieldCheck, AlertCircle, Ban, Flag, UserCheck, Briefcase, MapPin, Sparkles } from 'lucide-react';
import { UserProfile } from '../../types';

interface UserProfileModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestConnect?: (user: UserProfile) => void;
  connectionStatus?: 'none' | 'pending' | 'accepted' | 'declined';
  onOpenMessage?: (user: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onRequestConnect,
  connectionStatus = 'none',
  onOpenMessage,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header background banner */}
        <div className="bg-gradient-to-r from-[#2A1647] to-[#4A2B7A] h-24 relative p-4 flex justify-end items-start">
          <button 
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="px-6 pb-6 pt-0 relative">
          {/* Avatar and basic badge */}
          <div className="flex justify-between items-end -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-md border border-slate-200/80">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-100 to-rose-100 flex items-center justify-center text-2xl font-bold text-indigo-950">
                {user.displayName.slice(0, 1)}
              </div>
            </div>

            <span className="text-[11px] font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
              {user.category.replace(/_/g, ' ')}
            </span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">{user.displayName}</h3>
            {user.broadField && (
              <p className="text-xs text-indigo-800 font-medium flex items-center gap-1.5 mt-0.5">
                <Briefcase className="w-3.5 h-3.5" />
                {user.broadField}
              </p>
            )}
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Approximate Area: {user.approximateArea}
            </p>
          </div>

          {/* Honest Verification Badge */}
          <div className="mt-4 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-indigo-950">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Verification Status:</span>
            </div>
            <p className="text-indigo-900/90 leading-relaxed text-[11px]">
              {user.verificationBadgeDescription || 'Basic community phone verification simulated. Identity documents NOT requested or verified.'}
            </p>
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="mt-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">About</span>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                &ldquo;{user.bio}&rdquo;
              </p>
            </div>
          )}

          {/* Privacy Safeguards Reminder */}
          <div className="mt-4 p-2.5 bg-slate-100/70 rounded-xl text-[11px] text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-slate-500" />
              <span>Privacy by Design Notice:</span>
            </div>
            <p className="text-slate-500 leading-normal">
              Exact residential address, workplace location, live GPS tracking, and phone numbers are hidden. A profile is never proof that a person is trustworthy.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  alert(`Report submitted for ${user.displayName}. Our moderation team has been notified.`);
                  onClose();
                }}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-xs flex items-center gap-1"
                title="Report user"
              >
                <Flag className="w-4 h-4" />
                <span className="hidden sm:inline">Report</span>
              </button>
              <button
                onClick={() => {
                  alert(`User ${user.displayName} has been blocked.`);
                  onClose();
                }}
                className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors text-xs flex items-center gap-1"
                title="Block user"
              >
                <Ban className="w-4 h-4" />
                <span className="hidden sm:inline">Block</span>
              </button>
            </div>

            {connectionStatus === 'accepted' ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenMessage && onOpenMessage(user);
                }}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Open Secure Chat</span>
              </button>
            ) : connectionStatus === 'pending' ? (
              <span className="px-4 py-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold">
                Request Pending
              </span>
            ) : (
              onRequestConnect && (
                <button
                  onClick={() => {
                    onRequestConnect(user);
                  }}
                  className="px-4 py-2 bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                  <span>Request Connection</span>
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
