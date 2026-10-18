import React, { useState } from 'react';
import { X, Calculator, IndianRupee, Users, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

interface FareCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFare?: number;
}

export const FareCalculatorModal: React.FC<FareCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialFare = 420,
}) => {
  const [totalFare, setTotalFare] = useState<number>(initialFare);
  const [passengers, setPassengers] = useState<number>(2);
  const [isCustomRatio, setIsCustomRatio] = useState<boolean>(false);
  const [customRatioMyShare, setCustomRatioMyShare] = useState<number>(200);

  if (!isOpen) return null;

  const equalShare = passengers > 0 ? Math.round(totalFare / passengers) : 0;
  const companionShare = isCustomRatio ? Math.max(0, totalFare - customRatioMyShare) : equalShare;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <div className="bg-[#1E112A] text-white p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-900/40 rounded-xl text-emerald-300">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Fare-Splitting Calculator</h2>
              <p className="text-xs text-slate-300">Hypothetical cost arrangement guide</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer banner */}
        <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs text-amber-950 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p>
            <strong>Estimate Only:</strong> SAAHARA AI does not process digital payments or alter commercial cab rates. This calculator is strictly a tool for two passengers to mutually agree on a voluntary contribution.
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Estimated Total Cab Booking Fare (₹)
            </label>
            <div className="relative">
              <input
                type="number"
                min={50}
                max={5000}
                value={totalFare}
                onChange={(e) => setTotalFare(Math.max(0, Number(e.target.value)))}
                className="w-full pl-8 pr-3 py-2 text-sm font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
              <IndianRupee className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Number of Sharing Passengers
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[2, 3, 4].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setPassengers(count)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    passengers === count
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-950 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {count} Passengers
                </button>
              ))}
            </div>
          </div>

          {/* Equal Split Output */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-center space-y-1">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wide">
              Agreed Contribution per Passenger
            </span>
            <div className="text-3xl font-extrabold text-emerald-950 tracking-tight">
              ₹{isCustomRatio ? customRatioMyShare : equalShare}
              <span className="text-xs font-normal text-slate-500 ml-1">/ person</span>
            </div>
            <p className="text-[11px] text-emerald-900/80 pt-1">
              {isCustomRatio 
                ? `Custom split: You pay ₹${customRatioMyShare}, companion contributes ₹${companionShare}`
                : `₹${totalFare} split equally across ${passengers} passengers`
              }
            </p>
          </div>

          {/* Toggle custom arrangement */}
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={isCustomRatio}
                onChange={(e) => setIsCustomRatio(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Agree on an unequal contribution (e.g. shorter route drop)</span>
            </label>

            {isCustomRatio && (
              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-[11px] font-semibold text-slate-600">
                  Your Proposed Contribution: ₹{customRatioMyShare}
                </label>
                <input
                  type="range"
                  min={0}
                  max={totalFare}
                  step={10}
                  value={customRatioMyShare}
                  onChange={(e) => setCustomRatioMyShare(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Your share: ₹{customRatioMyShare}</span>
                  <span>Companion share: ₹{companionShare}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Apply to Journey Notes
          </button>
        </div>
      </div>
    </div>
  );
};
