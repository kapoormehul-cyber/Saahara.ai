import React, { useState, useEffect, useRef } from 'react';
import { X, Send, ShieldCheck, MapPin, AlertCircle, Ban, Flag, Sparkles } from 'lucide-react';
import { UserProfile, PrivateChatMessage } from '../../types';
import { storageService } from '../../services/storageService';

interface PrivateChatModalProps {
  currentUser: UserProfile;
  peerUser: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onEndConnection?: () => void;
}

export const PrivateChatModal: React.FC<PrivateChatModalProps> = ({
  currentUser,
  peerUser,
  isOpen,
  onClose,
  onEndConnection,
}) => {
  const [messages, setMessages] = useState<PrivateChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!peerUser) return;
    const currentMsgs = storageService.getMessages(currentUser.id, peerUser.id);
    if (currentMsgs.length === 0) {
      // Seed initial helpful message if thread is empty
      storageService.sendPrivateMessage({
        senderId: peerUser.id,
        senderName: peerUser.displayName,
        receiverId: currentUser.id,
        message: `Hi ${currentUser.displayName}! Thanks for connecting. I will be heading out shortly. Would you like to meet at a public spot?`,
        isSystemNote: false,
      });
    }
    setMessages(storageService.getMessages(currentUser.id, peerUser.id));

    const unsubscribe = storageService.subscribe(() => {
      setMessages(storageService.getMessages(currentUser.id, peerUser.id));
    });
    return unsubscribe;
  }, [currentUser.id, peerUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen || !peerUser) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    storageService.sendPrivateMessage({
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      receiverId: peerUser.id,
      message: inputText.trim(),
    });
    setInputText('');

    // Simulated responsive reply after short delay
    setTimeout(() => {
      storageService.sendPrivateMessage({
        senderId: peerUser.id,
        senderName: peerUser.displayName,
        receiverId: currentUser.id,
        message: 'Sounds good! Looking forward to coordinating safely.',
      });
    }, 1200);
  };

  const handleInsertQuickSuggestion = (text: string) => {
    setInputText(text);
  };

  const handleBlockAndEnd = () => {
    if (confirm(`Are you sure you want to block ${peerUser.displayName} and end this connection?`)) {
      onEndConnection && onEndConnection();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[600px] max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Chat Header */}
        <div className="bg-[#1E112A] text-white p-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-400/30 flex items-center justify-center font-bold text-rose-300">
              {peerUser.displayName.slice(0, 1)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">{peerUser.displayName}</h3>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded-full font-semibold">
                  Mutual Consent Active
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {peerUser.category.replace(/_/g, ' ')} • {peerUser.approximateArea}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleBlockAndEnd}
              className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-white/10 rounded-lg transition-colors text-xs flex items-center gap-1"
              title="End connection & Block"
            >
              <Ban className="w-4 h-4" />
              <span className="text-[11px] hidden sm:inline">End & Block</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Safety & Meeting Safeguard Banner */}
        <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2 text-[11px] text-amber-950 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Mutual privacy gate active. Never share banking OTPs or home addresses.</span>
          </div>
        </div>

        {/* Chat Message List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
          <div className="text-center my-2">
            <span className="text-[10px] font-medium text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
              Connection established with mutual consent
            </span>
          </div>

          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div 
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                    isMe 
                      ? 'bg-indigo-950 text-white rounded-br-xs' 
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                  }`}
                >
                  <p className="leading-relaxed">{msg.message}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Public Meeting Point Quick Chips */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-400 shrink-0 flex items-center gap-1 text-[10px] font-semibold uppercase">
            <MapPin className="w-3 h-3 text-indigo-600" />
            Public Meeting Ideas:
          </span>
          <button
            onClick={() => handleInsertQuickSuggestion("Shall we meet at Metro Station Gate 1 ticket counter?")}
            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md shrink-0 transition-colors"
          >
            Metro Gate 1 Concourse
          </button>
          <button
            onClick={() => handleInsertQuickSuggestion("How about waiting at the cafe foyer near 100ft road?")}
            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md shrink-0 transition-colors"
          >
            Cafe Foyer (Brightly Lit)
          </button>
        </div>

        {/* Message Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${peerUser.displayName}...`}
            className="flex-1 py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 bg-indigo-950 hover:bg-indigo-900 disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
