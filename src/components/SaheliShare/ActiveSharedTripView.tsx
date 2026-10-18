import React, { useState } from 'react';
import { 
  Car, 
  User, 
  MapPin, 
  Clock, 
  IndianRupee, 
  ShieldCheck, 
  AlertTriangle, 
  Trash2, 
  Ban, 
  Share, 
  CheckCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { SharedTripDetails, UserProfile } from '../../types';
import { storageService } from '../../services/storageService';

interface ActiveSharedTripViewProps {
  details: SharedTripDetails;
  peerUser: UserProfile;
  currentUser: UserProfile;
  onRevoke: () => void;
}

export const ActiveSharedTripView: React.FC<ActiveSharedTripViewProps> = ({
  details,
  peerUser,
  currentUser,
  onRevoke,
}) => {
  const [trustedContactCopied, setTrustedContactCopied] = useState(false);
  const [showTrustedContactModal, setShowTrustedContactModal] = useState(false);

  const handleCopyTrustedSummary = () => {
    const summary = `[SAAHARA AI Voluntary Journey Summary]
Hi! I am coordinating a shared cab journey with ${peerUser.displayName}.
• Departure Window: ${details.departureTime || 'Tonight'}
• Meeting / Pickup Point: ${details.approxPickupSpot || 'Public Landmark'}
• Destination: ${details.approxDestination || 'Bellandur Corridor'}
• Cab Details: ${details.cabProvider || 'Personal Booking'} (${details.vehicleRegNumber || 'Vehicle pending'})
Note: SAAHARA AI does not broadcast live location. This summary is sent voluntarily by me.`;

    navigator.clipboard.writeText(summary);
    setTrustedContactCopied(true);
    setTimeout(() => setTrustedContactCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-indigo-200/90 p-5 md:p-6 shadow-md space-y-5">
      {/* Active Trip Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-900 to-[#1E112A] text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <Car className="w-6 h-6 text-rose-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                Active Mutual Sharing
              </span>
              <span className="text-xs text-slate-400">Confirmed {details.confirmedAt}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Shared Journey with {peerUser.displayName}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowTrustedContactModal(true)}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-indigo-200 transition-colors"
          >
            <Share className="w-3.5 h-3.5 text-indigo-600" />
            <span>Voluntary Trusted Contact Link</span>
          </button>

          <button
            onClick={onRevoke}
            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-rose-200 transition-colors"
            title="Immediately revoke trip details and end sharing"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Revoke Access</span>
          </button>
        </div>
      </div>

      {/* Disclosed Trip Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* Cab Service */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Car className="w-3 h-3 text-indigo-600" />
            Cab Service
          </span>
          <div className="text-xs font-bold text-slate-900">
            {details.cabProvider || 'Not specified'}
          </div>
        </div>

        {/* Driver Details (Labelled Unverified) */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <User className="w-3 h-3 text-indigo-600" />
            Driver (User-Entered)
          </span>
          <div className="text-xs font-bold text-slate-900">
            {details.driverName || 'Not disclosed'}
          </div>
          <span className="text-[10px] text-amber-700 block font-medium">Unverified by aggregator</span>
        </div>

        {/* Vehicle Registration (Labelled Unverified) */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Car className="w-3 h-3 text-indigo-600" />
            Vehicle Reg.
          </span>
          <div className="text-xs font-bold font-mono text-slate-900">
            {details.vehicleRegNumber || 'Not disclosed'}
          </div>
          <span className="text-[10px] text-amber-700 block font-medium">Unverified by aggregator</span>
        </div>

        {/* Pickup Spot */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3 h-3 text-indigo-600" />
            Pickup Landmark
          </span>
          <div className="text-xs font-bold text-slate-900">
            {details.approxPickupSpot || 'Indiranagar Metro Concourse'}
          </div>
        </div>

        {/* Timing */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3 text-indigo-600" />
            Departure Time
          </span>
          <div className="text-xs font-bold text-slate-900">
            {details.departureTime || 'Tonight, 8:45 PM'}
          </div>
        </div>

        {/* Agreed Contribution */}
        <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
            <IndianRupee className="w-3 h-3 text-emerald-600" />
            Agreed Contribution
          </span>
          <div className="text-xs font-bold text-emerald-950">
            ₹{details.agreedSplitAmount || 210} per person
          </div>
          <span className="text-[10px] text-emerald-700 block">Agreed voluntary estimate</span>
        </div>
      </div>

      {/* Cab Booking Rules Reminder */}
      <div className="p-3.5 bg-amber-50/90 border border-amber-200/80 rounded-xl text-xs text-amber-950 space-y-1">
        <div className="font-semibold flex items-center gap-1.5 text-amber-900">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
          <span>Cab Provider Rules & Passenger Feasibility:</span>
        </div>
        <p className="text-amber-900/90 leading-relaxed text-[11px] pl-5">
          SAAHARA AI does not modify third-party cab bookings. You must coordinate the rendezvous yourselves and ensure the cab driver permits the additional passenger or drop-off according to the cab aggregator&apos;s policies.
        </p>
      </div>

      {/* Voluntary Trusted Contact Modal */}
      {showTrustedContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Share Summary with Trusted Contact</h3>
              <button 
                onClick={() => setShowTrustedContactModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              SAAHARA AI <strong>never</strong> broadcasts your data automatically. If you wish, you can copy this pre-formatted summary to send to your trusted family or emergency contact via your personal SMS or WhatsApp:
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono text-slate-700 whitespace-pre-wrap leading-relaxed">
{`Coordinating shared cab with ${peerUser.displayName}.
• Departure: ${details.departureTime || '8:45 PM'}
• Pickup: ${details.approxPickupSpot}
• Cab: ${details.cabProvider || 'Uber'} (${details.vehicleRegNumber})`}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowTrustedContactModal(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={handleCopyTrustedSummary}
                className="px-4 py-1.5 bg-indigo-950 hover:bg-indigo-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                {trustedContactCopied ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Summary</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
