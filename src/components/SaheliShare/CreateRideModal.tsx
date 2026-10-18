import React, { useState } from 'react';
import { X, Share2, MapPin, Clock, IndianRupee, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { RideRequest, UserProfile } from '../../types';
import { storageService } from '../../services/storageService';

interface CreateRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

export const CreateRideModal: React.FC<CreateRideModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [approxPickupArea, setApproxPickupArea] = useState('Indiranagar (Near CMH Road / Metro)');
  const [approxDestinationArea, setApproxDestinationArea] = useState('Bellandur / EcoSpace Outer Ring Rd');
  const [travelDate, setTravelDate] = useState('Tonight');
  const [departureTimeWindow, setDepartureTimeWindow] = useState('8:40 PM - 9:00 PM');
  const [cabProvider, setCabProvider] = useState('Uber Premier (Existing Booking)');
  const [estimatedFare, setEstimatedFare] = useState<number>(420);
  const [seatsAvailable, setSeatsAvailable] = useState<number>(2);
  const [notes, setNotes] = useState('Heading via Intermediate Ring Road. Open to sharing with fellow verified commuter.');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approxPickupArea.trim() || !approxDestinationArea.trim()) return;

    storageService.addRideRequest({
      userId: currentUser.id,
      userName: currentUser.displayName,
      userCategory: currentUser.category,
      userField: currentUser.broadField,
      userApproxArea: currentUser.approximateArea,
      approxPickupArea: approxPickupArea.trim(),
      approxDestinationArea: approxDestinationArea.trim(),
      travelDate,
      departureTimeWindow,
      cabProvider: cabProvider.trim(),
      estimatedFare: Number(estimatedFare) || 0,
      seatsAvailable: Number(seatsAvailable) || 1,
      isOpenToSharing: true,
      notes: notes.trim(),
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
        <div className="bg-gradient-to-r from-[#1E112A] to-[#3B2864] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl text-rose-300">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Coordinate Compatible Journey</h2>
              <p className="text-xs text-rose-200">“Share the ride, not your privacy.”</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-300 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-indigo-50 border-b border-indigo-100 text-xs text-indigo-950 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
          <p>
            <strong>Zero Public Door-to-Door Disclosure:</strong> Use broad neighborhoods only. Exact pickup gates or destination building numbers are strictly hidden from public searches.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900">Ride Request Created</h3>
            <p className="text-xs text-slate-500">Searching for compatible journey corridors...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Approx. Pickup Area
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={approxPickupArea}
                    onChange={(e) => setApproxPickupArea(e.target.value)}
                    placeholder="e.g. Indiranagar CMH Rd"
                    className="w-full pl-8 pr-2 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Approx. Destination Area
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={approxDestinationArea}
                    onChange={(e) => setApproxDestinationArea(e.target.value)}
                    placeholder="e.g. Bellandur Tech Park"
                    className="w-full pl-8 pr-2 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Travel Date
                </label>
                <input
                  type="text"
                  required
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  placeholder="Tonight / Today"
                  className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Departure Window
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={departureTimeWindow}
                    onChange={(e) => setDepartureTimeWindow(e.target.value)}
                    placeholder="e.g. 8:30 PM - 9:00 PM"
                    className="w-full pl-8 pr-2 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cab Provider (Optional)
                </label>
                <input
                  type="text"
                  value={cabProvider}
                  onChange={(e) => setCabProvider(e.target.value)}
                  placeholder="e.g. Uber Premier / Ola / Self Booked"
                  className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimated Total Fare (₹)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={estimatedFare}
                    onChange={(e) => setEstimatedFare(Number(e.target.value))}
                    placeholder="400"
                    className="w-full pl-7 pr-2 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  <IndianRupee className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Seats Available to Share
              </label>
              <select
                value={seatsAvailable}
                onChange={(e) => setSeatsAvailable(Number(e.target.value))}
                className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value={1}>1 Passenger Seat</option>
                <option value={2}>2 Passenger Seats</option>
                <option value={3}>3 Passenger Seats</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Trip Coordination Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention preferred stops or landmark wait points."
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
                Find Compatible Matches
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
