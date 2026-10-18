import React from 'react';
import { X, Check, Trash2, ShieldCheck, User, Users, Sparkles, AlertCircle } from 'lucide-react';
import { ConnectionRequest, UserProfile } from '../../types';
import { storageService } from '../../services/storageService';

interface ConnectionRequestsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onOpenChatWith: (peerId: string) => void;
}

export const ConnectionRequestsDrawer: React.FC<ConnectionRequestsDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenChatWith,
}) => {
  const [requests, setRequests] = React.useState<ConnectionRequest[]>([]);

  React.useEffect(() => {
    setRequests(storageService.getConnectionRequests());
    const unsubscribe = storageService.subscribe(() => {
      setRequests(storageService.getConnectionRequests());
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const incoming = requests.filter(r => r.toUserId === currentUser.id && r.status === 'pending');
  const activeAccepted = requests.filter(r => (r.toUserId === currentUser.id || r.fromUserId === currentUser.id) && r.status === 'accepted');

  const handleAccept = (reqId: string, peerId: string) => {
    storageService.updateConnectionStatus(reqId, 'accepted');
  };

  const handleDecline = (reqId: string) => {
    storageService.updateConnectionStatus(reqId, 'declined');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
      >
        <div className="bg-[#23153C] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl text-rose-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Community Connections</h2>
              <p className="text-xs text-slate-300">Mutual consent requests & accepted peers</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-300 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-indigo-50 border-b border-indigo-100 text-xs text-indigo-950 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>You can decline any request without explanation. Mutual acceptance is strictly required.</span>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {/* Incoming Pending Requests */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Incoming Connection Requests ({incoming.length})
            </h3>
            {incoming.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500 text-center border border-slate-200/60">
                No pending requests. Browse walking requests or send an invite to connect.
              </div>
            ) : (
              <div className="space-y-2.5">
                {incoming.map((req) => (
                  <div 
                    key={req.id}
                    className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-bold text-slate-900">{req.fromUserName}</div>
                        <div className="text-xs text-indigo-700 font-medium">
                          {req.fromUserCategory.replace(/_/g, ' ')} • {req.fromUserArea}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Context: {req.contextType === 'saheli_share' ? 'Saheli Share (Ride Coordination)' : 'Saheli Circle (Walking Companion)'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                      <button
                        onClick={() => handleAccept(req.id, req.fromUserId)}
                        className="flex-1 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow-xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept & Unlock Chat</span>
                      </button>
                      <button
                        onClick={() => handleDecline(req.id)}
                        className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Mutual Connections */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Connected Peers ({activeAccepted.length})
            </h3>
            {activeAccepted.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500 text-center border border-slate-200/60">
                No active connections yet.
              </div>
            ) : (
              <div className="space-y-2">
                {activeAccepted.map((conn) => {
                  const peerName = conn.fromUserId === currentUser.id ? conn.toUserName : conn.fromUserName;
                  const peerId = conn.fromUserId === currentUser.id ? conn.toUserId : conn.fromUserId;
                  return (
                    <div 
                      key={conn.id}
                      className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900">{peerName}</div>
                        <div className="text-[10px] text-emerald-800">Mutual consent established</div>
                      </div>

                      <button
                        onClick={() => {
                          onOpenChatWith(peerId);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-indigo-950 hover:bg-indigo-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                      >
                        Open Chat
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
