import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  Plus, 
  MapPin, 
  Clock, 
  IndianRupee, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Calculator, 
  Sparkles,
  Info,
  Car
} from 'lucide-react';
import { RideRequest, UserProfile, ConnectionRequest, SharedTripDetails } from '../../types';
import { storageService } from '../../services/storageService';
import { SAMPLE_PEERS } from '../../data/sampleData';
import { CreateRideModal } from './CreateRideModal';
import { SelectiveSharingModal } from './SelectiveSharingModal';
import { ActiveSharedTripView } from './ActiveSharedTripView';
import { FareCalculatorModal } from './FareCalculatorModal';
import { UserProfileModal } from '../SaheliCircle/UserProfileModal';

interface SaheliShareModuleProps {
  currentUser: UserProfile;
}

export const SaheliShareModule: React.FC<SaheliShareModuleProps> = ({ currentUser }) => {
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
  const [connections, setConnections] = useState<ConnectionRequest[]>([]);
  const [activeSharedTrip, setActiveSharedTrip] = useState<SharedTripDetails | null>(null);

  // Modals state
  const [isCreateRideOpen, setIsCreateRideOpen] = useState(false);
  const [isSelectiveSharingOpen, setIsSelectiveSharingOpen] = useState(false);
  const [isFareCalcOpen, setIsFareCalcOpen] = useState(false);
  const [inspectUser, setInspectUser] = useState<UserProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Simulated peer for the primary demo flow: Sneha K.
  const snehaPeer = SAMPLE_PEERS.find(p => p.id === 'usr_sneha_02') || SAMPLE_PEERS[0];
  const activeConnectionWithSneha = connections.find(
    c => (c.fromUserId === currentUser.id && c.toUserId === snehaPeer.id) ||
         (c.toUserId === currentUser.id && c.fromUserId === snehaPeer.id)
  );

  useEffect(() => {
    setRideRequests(storageService.getRideRequests());
    setConnections(storageService.getConnectionRequests());

    // Check if shared trip exists for Sneha connection
    if (activeConnectionWithSneha) {
      const details = storageService.getSharedTripDetails(activeConnectionWithSneha.id);
      setActiveSharedTrip(details && details.isSharingActive ? details : null);
    }

    const unsubscribe = storageService.subscribe(() => {
      setRideRequests(storageService.getRideRequests());
      setConnections(storageService.getConnectionRequests());
      if (activeConnectionWithSneha) {
        const details = storageService.getSharedTripDetails(activeConnectionWithSneha.id);
        setActiveSharedTrip(details && details.isSharingActive ? details : null);
      }
    });
    return unsubscribe;
  }, [activeConnectionWithSneha]);

  const handleRequestConnect = (targetPeer: UserProfile) => {
    const req = storageService.sendConnectionRequest(currentUser, targetPeer, 'saheli_share');
    alert(`Connection request sent to ${targetPeer.displayName}. No trip details will be disclosed until mutual acceptance.`);
    setIsProfileModalOpen(false);
  };

  const handleSimulateMutualAcceptance = () => {
    // If no connection exists yet, create one
    let targetConn = activeConnectionWithSneha;
    if (!targetConn) {
      targetConn = storageService.sendConnectionRequest(currentUser, snehaPeer, 'saheli_share');
    }
    storageService.updateConnectionStatus(targetConn.id, 'accepted');
    alert(`Mutual Acceptance Established: Sneha K. accepted the connection. You can now selectively share trip details.`);
  };

  const handleInspectProfile = (peer: UserProfile) => {
    setInspectUser(peer);
    setIsProfileModalOpen(true);
  };

  const isMutualConsentAchieved = activeConnectionWithSneha?.status === 'accepted';

  return (
    <div className="space-y-5">
      {/* Module Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Saheli Share</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-900 border border-purple-200">
              Consent-Based Ride Matching
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl font-medium">
            “Share the ride, not your privacy.” Coordinate compatible journeys without external cab-booking APIs or live location tracking.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => setIsFareCalcOpen(true)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Calculator className="w-3.5 h-3.5 text-indigo-700" />
            <span>Fare Calculator</span>
          </button>

          <button
            onClick={() => setIsCreateRideOpen(true)}
            className="px-3.5 py-2 bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 text-rose-300" />
            <span>New Ride Request</span>
          </button>
        </div>
      </div>

      {/* Safety & Aggregator Disclaimers Banner */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-800">Concept & Cab Aggregator Notice:</strong> SAAHARA AI does not book cabs or interface directly with Uber/Ola. Two women with existing or planned journeys in similar directions discover compatibility, mutually approve connection, and voluntarily exchange selective trip details to coordinate sharing.
        </div>
      </div>

      {/* ACTIVE SHARED TRIP VIEW (IF MUTUAL SHARING CONFIRMED) */}
      {activeSharedTrip && (
        <ActiveSharedTripView
          details={activeSharedTrip}
          peerUser={snehaPeer}
          currentUser={currentUser}
          onRevoke={() => {
            if (activeConnectionWithSneha) {
              storageService.revokeSharedTripDetails(activeConnectionWithSneha.id);
              setActiveSharedTrip(null);
            }
          }}
        />
      )}

      {/* MUTUAL CONSENT GATE / SELECTIVE DISCLOSURE ACTION BANNER */}
      {isMutualConsentAchieved && !activeSharedTrip && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Mutual Consent Established!
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  You and {snehaPeer.displayName} mutually accepted connection.
                </h3>
                <p className="text-xs text-slate-600">
                  You may now choose which specific trip details to disclose. Nothing is shared without your explicit confirmation.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsSelectiveSharingOpen(true)}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors shrink-0"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Open Selective Sharing Gate</span>
            </button>
          </div>
        </div>
      )}

      {/* COMPATIBLE NEARBY JOURNEYS LIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
            <Car className="w-4 h-4 text-indigo-600" />
            Compatible Nearby Journeys ({rideRequests.length - 1} matches found)
          </h3>

          {/* Quick Judge Simulation Helper */}
          {!isMutualConsentAchieved && (
            <button
              onClick={handleSimulateMutualAcceptance}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-lg border border-rose-200 transition-colors flex items-center gap-1.5"
              title="One-click simulation for judges to test the mutual consent stage"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>Simulate Sneha&apos;s Mutual Acceptance</span>
            </button>
          )}
        </div>

        {/* Sneha K. Match Card (Primary Compatible Match) */}
        <div className="bg-white rounded-2xl border-2 border-indigo-100 p-5 shadow-xs hover:border-indigo-200 transition-all space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div 
                onClick={() => handleInspectProfile(snehaPeer)}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center font-bold text-lg text-indigo-950 cursor-pointer shadow-xs hover:scale-105 transition-transform"
                title="Inspect limited profile"
              >
                {snehaPeer.displayName.slice(0, 1)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span 
                    onClick={() => handleInspectProfile(snehaPeer)}
                    className="font-bold text-base text-slate-900 cursor-pointer hover:underline"
                  >
                    {snehaPeer.displayName}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {snehaPeer.category.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">• {snehaPeer.broadField}</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Approx. Corridor: Indiranagar Metro to Bellandur Tech Park
                </div>
              </div>
            </div>

            {/* Compatibility Badge */}
            <div className="flex items-center gap-2">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 text-right">
                <span className="text-xs font-bold text-emerald-800 block">94% Compatibility</span>
                <span className="text-[10px] text-emerald-700 font-medium">Time & Corridor Overlap</span>
              </div>
            </div>
          </div>

          {/* Corridor & Time Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Approx. Pickup</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                Indiranagar Metro (~450m from 100ft Rd)
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Approx. Destination</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                Bellandur / Outer Ring Road
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Departure Window</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                8:45 PM - 9:05 PM
              </span>
            </div>
          </div>

          {/* Compatibility Explanation Note */}
          <div className="text-xs text-indigo-950 bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong>Compatibility Explanation:</strong> Departure time window matches within 5 minutes. Both passengers are travelling towards the Bellandur Ring Road corridor.
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <button
              onClick={() => handleInspectProfile(snehaPeer)}
              className="text-slate-600 hover:text-indigo-950 font-semibold flex items-center gap-1"
            >
              <span>Inspect Limited Profile & Disclaimers</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2">
              {isMutualConsentAchieved ? (
                <button
                  onClick={() => setIsSelectiveSharingOpen(true)}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Manage Disclosed Details</span>
                </button>
              ) : activeConnectionWithSneha?.status === 'pending' ? (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-medium">
                    Connection Request Sent
                  </span>
                  <button
                    onClick={handleSimulateMutualAcceptance}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                  >
                    Simulate Sneha&apos;s Accept
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleRequestConnect(snehaPeer)}
                  className="px-4 py-2 bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                  <span>Request to Connect</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Meera N. Match Card */}
        {SAMPLE_PEERS[2] && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div 
                  onClick={() => handleInspectProfile(SAMPLE_PEERS[2])}
                  className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 cursor-pointer hover:scale-105 transition-transform"
                >
                  {SAMPLE_PEERS[2].displayName.slice(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span 
                      onClick={() => handleInspectProfile(SAMPLE_PEERS[2])}
                      className="font-bold text-sm text-slate-900 cursor-pointer hover:underline"
                    >
                      {SAMPLE_PEERS[2].displayName}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {SAMPLE_PEERS[2].category.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Approx. Corridor: Koramangala 4th Block to HSR Layout
                  </div>
                </div>
              </div>

              <div className="bg-slate-100 rounded-xl px-2.5 py-1 text-right">
                <span className="text-xs font-bold text-slate-700">76% Compatibility</span>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              Departure window: 9:15 PM - 9:35 PM • Estimated fare ~₹260
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => handleInspectProfile(SAMPLE_PEERS[2])}
                className="text-slate-500 hover:text-slate-800 font-medium"
              >
                Inspect Profile
              </button>
              <button
                onClick={() => handleRequestConnect(SAMPLE_PEERS[2])}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold"
              >
                Request to Connect
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Selective Sharing Modal */}
      <SelectiveSharingModal
        isOpen={isSelectiveSharingOpen}
        onClose={() => setIsSelectiveSharingOpen(false)}
        peerUser={snehaPeer}
        connectionId={activeConnectionWithSneha?.id || 'demo_conn_01'}
        onConfirmedShare={(details) => setActiveSharedTrip(details)}
      />

      {/* Fare Calculator Modal */}
      <FareCalculatorModal
        isOpen={isFareCalcOpen}
        onClose={() => setIsFareCalcOpen(false)}
        initialFare={420}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        user={inspectUser}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onRequestConnect={handleRequestConnect}
        connectionStatus={inspectUser ? (inspectUser.id === snehaPeer.id && isMutualConsentAchieved ? 'accepted' : 'none') : 'none'}
      />

      {/* Create Ride Modal */}
      <CreateRideModal
        isOpen={isCreateRideOpen}
        onClose={() => setIsCreateRideOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
};
