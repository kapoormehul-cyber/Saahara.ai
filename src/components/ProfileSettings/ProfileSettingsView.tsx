import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Lock, 
  Trash2, 
  Download, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle, 
  Briefcase, 
  MapPin, 
  FileText 
} from 'lucide-react';
import { BroadCategory, PrivacyPreferences, UserProfile } from '../../types';
import { storageService } from '../../services/storageService';

interface ProfileSettingsViewProps {
  currentUser: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  currentUser,
  onUpdateUser,
}) => {
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [category, setCategory] = useState<BroadCategory>(currentUser.category);
  const [broadField, setBroadField] = useState(currentUser.broadField || '');
  const [approximateArea, setApproximateArea] = useState(currentUser.approximateArea);
  const [bio, setBio] = useState(currentUser.bio || '');

  const [privacy, setPrivacy] = useState<PrivacyPreferences>(currentUser.privacy);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = storageService.updateUserProfile({
      displayName: displayName.trim(),
      category,
      broadField: broadField.trim(),
      approximateArea: approximateArea.trim(),
      bio: bio.trim(),
      privacy,
    });
    onUpdateUser(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportData = () => {
    const data = {
      profile: storageService.getUserProfile(),
      observations: storageService.getObservations(),
      communityPosts: storageService.getCommunityPosts(),
      connections: storageService.getConnectionRequests(),
      rideRequests: storageService.getRideRequests(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saahara_user_data_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetDemo = () => {
    if (confirm('Reset all sample data, connections, and reports back to original demo state?')) {
      storageService.resetAllDemoData();
      window.location.reload();
    }
  };

  const handlePurgeData = () => {
    if (confirm('Completely erase all locally stored data from your browser?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-950 text-white flex items-center justify-center font-bold text-lg">
            {currentUser.displayName.slice(0, 1)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Privacy & Profile Settings</h2>
            <p className="text-xs text-slate-500">Manage your data sovereignty, approximate area, and mutual consent controls</p>
          </div>
        </div>

        {saveSuccess && (
          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Settings Saved</span>
          </span>
        )}
      </div>

      {/* Honest Verification Badge Card */}
      <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-5 space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-700" />
          <h3 className="font-bold text-indigo-950 text-sm">Transparent Verification Badge Description</h3>
        </div>
        <p className="text-xs text-indigo-900 leading-relaxed">
          {currentUser.verificationBadgeDescription || 'Community phone check (Simulated).'}
        </p>
        <p className="text-[11px] text-indigo-800/80 leading-normal pt-1 border-t border-indigo-200/60">
          <strong>Transparency Guarantee:</strong> SAAHARA AI does not collect government ID documents (Aadhaar/PAN) in this prototype and does not treat mobile OTP verification as proof of identity or personal trustworthiness.
        </p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-3">
          Profile Details (Public-facing Limited View)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Display Name or Nickname
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">No legal full name required.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Broad Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as BroadCategory)}
              className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="working_professional">Working Professional</option>
              <option value="college_student">College Student</option>
              <option value="school_student">School Student (18+)</option>
              <option value="self_employed">Self Employed</option>
              <option value="other">Other Community Member</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Broad Study or Work Field
            </label>
            <input
              type="text"
              value={broadField}
              onChange={(e) => setBroadField(e.target.value)}
              placeholder="e.g. Software, Healthcare, Architecture"
              className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Approximate Area / Transit Corridor
            </label>
            <input
              type="text"
              required
              value={approximateArea}
              onChange={(e) => setApproximateArea(e.target.value)}
              placeholder="e.g. Indiranagar, Bengaluru"
              className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Short Bio
          </label>
          <textarea
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>

        {/* Privacy Preferences */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Privacy Preferences & Consent Controls
          </h4>

          <div className="space-y-2.5 text-xs text-slate-700">
            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.shareApproximateAreaOnly}
                onChange={(e) => setPrivacy({ ...privacy, shareApproximateAreaOnly: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="font-bold text-slate-900 block">Enforce Approximate Public Locations Only</span>
                <span className="text-[11px] text-slate-500">Live GPS tracking and private residence pins are permanently disabled.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.requireMutualConsentForMessages}
                onChange={(e) => setPrivacy({ ...privacy, requireMutualConsentForMessages: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="font-bold text-slate-900 block">Require Mutual Consent for All Communications</span>
                <span className="text-[11px] text-slate-500">Direct messages and selective trip details are locked until both users accept.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.strictRideSharingPrivacy}
                onChange={(e) => setPrivacy({ ...privacy, strictRideSharingPrivacy: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="font-bold text-slate-900 block">Strict Selective Ride Sharing Gate</span>
                <span className="text-[11px] text-slate-500">Always show preview modal and require explicit confirmation before sharing cab fields.</span>
              </div>
            </label>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
          >
            Save Privacy & Profile Preferences
          </button>
        </div>
      </form>

      {/* Data Management & Deletion */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-3">
          Data Sovereignty & Prototype Storage Notice
        </h3>

        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed">
          <strong>Storage Disclosure:</strong> This prototype stores session states and preferences inside your browser&apos;s local storage. In production, sensitive communications are secured with asymmetric end-to-end encryption. You have the unconditional right to export or erase your data at any time.
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export My Stored Data (JSON)</span>
          </button>

          <button
            onClick={handleResetDemo}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo to Clean State</span>
          </button>

          <button
            onClick={handlePurgeData}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-rose-200 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge All Local Browser Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
