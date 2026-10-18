import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  FileCheck, 
  Car, 
  User, 
  MapPin, 
  Clock, 
  IndianRupee 
} from 'lucide-react';
import { SharedTripDetails, UserProfile } from '../../types';
import { storageService } from '../../services/storageService';

interface SelectiveSharingModalProps {
  isOpen: boolean;
  onClose: () => void;
  peerUser: UserProfile;
  connectionId: string;
  onConfirmedShare: (details: SharedTripDetails) => void;
}

export const SelectiveSharingModal: React.FC<SelectiveSharingModalProps> = ({
  isOpen,
  onClose,
  peerUser,
  connectionId,
  onConfirmedShare,
}) => {
  // Step in modal: 'select_fields' -> 'preview_confirmation'
  const [step, setStep] = useState<'select' | 'preview'>('select');

  // Fields and user inputs
  const [shareProvider, setShareProvider] = useState(true);
  const [cabProvider, setCabProvider] = useState('Uber Premier (Personal Booking)');

  const [shareDriver, setShareDriver] = useState(true);
  const [driverName, setDriverName] = useState('Ramesh K. (User-Reported)');

  const [shareVehicle, setShareVehicle] = useState(true);
  const [vehicleReg, setVehicleReg] = useState('KA-03-MG-4821');

  const [shareBookingRef, setShareBookingRef] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const [sharePickupSpot, setSharePickupSpot] = useState(true);
  const [pickupSpot, setPickupSpot] = useState('Indiranagar Metro Gate 2 Street Level Auto Stand');

  const [shareDestination, setShareDestination] = useState(true);
  const [destination, setDestination] = useState('EcoSpace Business Park Gate 1, Bellandur');

  const [shareTime, setShareTime] = useState(true);
  const [departureTime, setDepartureTime] = useState('8:45 PM');

  const [shareFare, setShareFare] = useState(true);
  const [estimatedFare, setEstimatedFare] = useState<number>(420);
  const [agreedSplit, setAgreedSplit] = useState<number>(210);

  const [explicitConsentGiven, setExplicitConsentGiven] = useState(false);

  if (!isOpen) return null;

  const handleProceedToPreview = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('preview');
  };

  const handleFinalConfirm = () => {
    if (!explicitConsentGiven) return;

    const details: SharedTripDetails = {
      requestId: `req_${Date.now()}`,
      connectionId,
      sharedByUserId: 'usr_ananya_01',
      cabProviderDisclosed: shareProvider,
      cabProvider: shareProvider ? cabProvider : undefined,
      driverNameDisclosed: shareDriver,
      driverName: shareDriver ? driverName : undefined,
      vehicleRegDisclosed: shareVehicle,
      vehicleRegNumber: shareVehicle ? vehicleReg : undefined,
      bookingRefDisclosed: shareBookingRef,
      bookingRef: shareBookingRef ? bookingRef : undefined,
      pickupSpotDisclosed: sharePickupSpot,
      approxPickupSpot: sharePickupSpot ? pickupSpot : undefined,
      destinationDisclosed: shareDestination,
      approxDestination: shareDestination ? destination : undefined,
      departureTimeDisclosed: shareTime,
      departureTime: shareTime ? departureTime : undefined,
      estimatedFareDisclosed: shareFare,
      estimatedFare: shareFare ? estimatedFare : undefined,
      agreedSplitAmount: shareFare ? agreedSplit : undefined,
      confirmedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSharingActive: true,
    };

    storageService.saveSharedTripDetails(details);
    onConfirmedShare(details);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-[#1E112A] text-white p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-900/40 rounded-xl text-rose-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Selective Trip Disclosure Gate</h2>
              <p className="text-xs text-slate-300">Share with {peerUser.displayName} under mutual consent</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safeguard Notice */}
        <div className="bg-amber-50 border-b border-amber-200/80 p-3 text-xs text-amber-950 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p>
            <strong>Unverified Driver Notice:</strong> Manually entered vehicle numbers or driver names are user-provided and unverified by cab aggregators. Never disclose payment credentials, OTPs, or passwords.
          </p>
        </div>

        {/* Content based on step */}
        {step === 'select' ? (
          <form onSubmit={handleProceedToPreview} className="p-6 overflow-y-auto space-y-4">
            <div className="text-xs text-slate-600">
              Choose exactly which fields you wish to disclose to <strong>{peerUser.displayName}</strong>. All fields are optional.
            </div>

            {/* Field 1: Cab Provider */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-indigo-600" />
                  Cab Provider / Service
                </span>
                <input
                  type="checkbox"
                  checked={shareProvider}
                  onChange={(e) => setShareProvider(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>
              {shareProvider && (
                <input
                  type="text"
                  value={cabProvider}
                  onChange={(e) => setCabProvider(e.target.value)}
                  className="w-full py-1.5 px-3 text-xs border border-slate-300 rounded-lg bg-white"
                />
              )}
            </div>

            {/* Field 2 & 3: Driver & Vehicle Number */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    Driver Name
                  </span>
                  <input
                    type="checkbox"
                    checked={shareDriver}
                    onChange={(e) => setShareDriver(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
                {shareDriver && (
                  <div>
                    <input
                      type="text"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      placeholder="e.g. Ramesh K."
                      className="w-full py-1.5 px-3 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                    <span className="text-[10px] text-amber-700 block mt-1">Unverified user-entry</span>
                  </div>
                )}
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-indigo-600" />
                    Vehicle Reg. No.
                  </span>
                  <input
                    type="checkbox"
                    checked={shareVehicle}
                    onChange={(e) => setShareVehicle(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
                {shareVehicle && (
                  <div>
                    <input
                      type="text"
                      value={vehicleReg}
                      onChange={(e) => setVehicleReg(e.target.value)}
                      placeholder="e.g. KA-03-MG-4821"
                      className="w-full py-1.5 px-3 text-xs border border-slate-300 rounded-lg bg-white uppercase font-mono"
                    />
                    <span className="text-[10px] text-amber-700 block mt-1">Unverified user-entry</span>
                  </div>
                )}
              </div>
            </div>

            {/* Field 4: Pickup Spot */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  Proposed Pickup Spot (Public Landmark)
                </span>
                <input
                  type="checkbox"
                  checked={sharePickupSpot}
                  onChange={(e) => setSharePickupSpot(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>
              {sharePickupSpot && (
                <input
                  type="text"
                  value={pickupSpot}
                  onChange={(e) => setPickupSpot(e.target.value)}
                  className="w-full py-1.5 px-3 text-xs border border-slate-300 rounded-lg bg-white"
                />
              )}
            </div>

            {/* Field 5: Departure Time & Fare Estimate */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    Departure Time
                  </span>
                  <input
                    type="checkbox"
                    checked={shareTime}
                    onChange={(e) => setShareTime(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
                {shareTime && (
                  <input
                    type="text"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full py-1.5 px-3 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                )}
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-indigo-600" />
                    Agreed Contribution
                  </span>
                  <input
                    type="checkbox"
                    checked={shareFare}
                    onChange={(e) => setShareFare(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
                {shareFare && (
                  <input
                    type="number"
                    value={agreedSplit}
                    onChange={(e) => setAgreedSplit(Number(e.target.value))}
                    className="w-full py-1.5 px-3 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                )}
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
                Preview Disclosure Summary
              </button>
            </div>
          </form>
        ) : (
          /* PREVIEW CONFIRMATION STEP */
          <div className="p-6 overflow-y-auto space-y-4">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Preview Before Disclosure</h3>
              <p className="text-xs text-slate-500">
                You are about to disclose the following information strictly to <strong>{peerUser.displayName}</strong>.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2.5">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Provider:</span>
                <span className="font-semibold text-slate-800">{shareProvider ? cabProvider : 'Hidden'}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Driver Name:</span>
                <span className="font-semibold text-slate-800">
                  {shareDriver ? `${driverName} (Unverified User Entry)` : 'Hidden'}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Vehicle Registration:</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {shareVehicle ? `${vehicleReg} (Unverified User Entry)` : 'Hidden'}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Pickup Landmark:</span>
                <span className="font-semibold text-slate-800">{sharePickupSpot ? pickupSpot : 'Hidden'}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Departure Time:</span>
                <span className="font-semibold text-slate-800">{shareTime ? departureTime : 'Hidden'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Split:</span>
                <span className="font-semibold text-emerald-700">{shareFare ? `₹${agreedSplit} (Hypothetical)` : 'Hidden'}</span>
              </div>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={explicitConsentGiven}
                  onChange={(e) => setExplicitConsentGiven(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                />
                <span className="text-indigo-950 font-medium leading-relaxed">
                  I explicitly consent to share these selected details with {peerUser.displayName}. I understand I can withdraw consent and revoke this data at any time.
                </span>
              </label>
            </div>

            <div className="pt-2 flex justify-between gap-2">
              <button
                type="button"
                onClick={() => setStep('select')}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Back to Edit
              </button>
              <button
                type="button"
                disabled={!explicitConsentGiven}
                onClick={handleFinalConfirm}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white text-xs font-semibold rounded-xl shadow-md transition-colors flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirm & Disclose to {peerUser.displayName}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
