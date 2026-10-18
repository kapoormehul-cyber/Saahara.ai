import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellOff, 
  MapPin, 
  ShieldCheck, 
  AlertCircle, 
  X, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Radio
} from 'lucide-react';
import { NearbySafetyAlert, UserProfile } from '../../types';
import { storageService } from '../../services/storageService';
import { getStatusBadge } from '../LivingSafetyMap/SafetyMap';

interface NearbyAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onOpenReportDetail: (issueId: string) => void;
}

export const NearbyAlertsModal: React.FC<NearbyAlertsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenReportDetail,
}) => {
  const [alertsEnabled, setAlertsEnabled] = useState(currentUser.privacy.enableNearbySafetyAlerts);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'manual'>('manual');
  const [selectedRadius, setSelectedRadius] = useState<number>(currentUser.privacy.alertRadiusKm || 3);
  const [alerts, setAlerts] = useState<NearbySafetyAlert[]>([]);

  useEffect(() => {
    setAlerts(storageService.getNearbyAlerts());
    const unsub = storageService.subscribe(() => {
      setAlerts(storageService.getNearbyAlerts());
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const handleRequestLiveLocation = () => {
    setPermissionRequested(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setPermissionState('granted');
          setAlertsEnabled(true);
          storageService.updateUserProfile({
            privacy: { ...currentUser.privacy, enableNearbySafetyAlerts: true }
          });
        },
        () => {
          // Graceful fallback to manual approximate area selection
          setPermissionState('manual');
          setAlertsEnabled(true);
          storageService.updateUserProfile({
            privacy: { ...currentUser.privacy, enableNearbySafetyAlerts: true }
          });
        },
        { timeout: 5000 }
      );
    } else {
      setPermissionState('manual');
    }
  };

  const handleToggleAlerts = (enabled: boolean) => {
    setAlertsEnabled(enabled);
    storageService.updateUserProfile({
      privacy: { ...currentUser.privacy, enableNearbySafetyAlerts: enabled }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-[#1E112A] text-white p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-900/40 rounded-xl text-rose-300">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Consent-Based Nearby Safety Alerts</h2>
              <p className="text-xs text-slate-300">Timely environmental reports near your selected public route</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Consent & Privacy Notice */}
        <div className="p-3.5 bg-indigo-50 border-b border-indigo-100 text-xs text-indigo-950 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Privacy Safeguard:</strong> SAAHARA AI never performs silent background tracking. Alerts are calculated strictly around your chosen public landmark ({currentUser.approximateArea}) or optional one-time location permission.
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {/* Toggle Alert Switch */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Enable Nearby Civic & Observation Alerts
              </span>
              <span className="text-[11px] text-slate-500">
                Receive notifications when recent lighting or walkway reports appear near your area.
              </span>
            </div>
            <button
              onClick={() => handleToggleAlerts(!alertsEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                alertsEnabled ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <div 
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  alertsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Location Mode Selector */}
          {alertsEnabled && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Location Source
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPermissionState('manual')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    permissionState === 'manual'
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-indigo-600 mb-1" />
                  <span className="block text-xs">Manual Landmark Area</span>
                  <span className="text-[10px] text-slate-500 block font-normal">
                    {currentUser.approximateArea}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleRequestLiveLocation}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    permissionState === 'granted'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Radio className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="block text-xs">Current Location</span>
                  <span className="text-[10px] text-slate-500 block font-normal">
                    {permissionState === 'granted' ? 'One-time GPS verified' : 'Click to grant permission'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Active Alerts Feed */}
          {alertsEnabled && (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Active Alerts Along Your Corridor ({alerts.length})
              </span>

              {alerts.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500 border border-slate-200">
                  No critical infrastructure warnings in your vicinity.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {alerts.map((alert) => {
                    const badge = getStatusBadge(alert.currentStatus);
                    return (
                      <div 
                        key={alert.id}
                        className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            {alert.category.replace(/_/g, ' ')}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </div>

                        <p className="text-xs text-slate-800 leading-relaxed font-medium">
                          &ldquo;{alert.message}&rdquo;
                        </p>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-400">
                          <span>🕒 Observed {alert.reportAge}</span>
                          <button
                            onClick={() => {
                              onClose();
                              onOpenReportDetail(alert.issueId);
                            }}
                            className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
                          >
                            <span>Open Report</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Save Preferences & Close
          </button>
        </div>
      </div>
    </div>
  );
};
