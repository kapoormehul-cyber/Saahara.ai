import React from 'react';
import { Phone, ShieldAlert, X, AlertTriangle, ExternalLink, Copy, Check } from 'lucide-react';
import { OFFICIAL_SUPPORT_RESOURCES } from '../../data/sampleData';

interface EmergencyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyDrawer: React.FC<EmergencyDrawerProps> = ({ isOpen, onClose }) => {
  const [copiedNumber, setCopiedNumber] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const emergencyContacts = [
    { number: '112', title: 'National Emergency Helpline (ERSS)', desc: 'Police, Fire, Medical Integrated Response', bg: 'bg-rose-50 border-rose-200 text-rose-950', badge: 'Immediate Distress' },
    { number: '1091', title: 'Women Police Helpline', desc: 'Direct state police patrol & distress intervention', bg: 'bg-indigo-50 border-indigo-200 text-indigo-950', badge: 'Police Escort / Threat' },
    { number: '181', title: 'Women in Distress (MWCD)', desc: 'Crisis intervention, shelter referral & One Stop Centres', bg: 'bg-amber-50 border-amber-200 text-amber-950', badge: 'Crisis & Shelter' },
    { number: '1930', title: 'Cyber Crime Reporting', desc: 'Online harassment, image morphing & financial extortion', bg: 'bg-teal-50 border-teal-200 text-teal-950', badge: 'Cyber Safety' },
    { number: '15100', title: 'NALSA Free Legal Aid', desc: 'Free legal advice & government panel lawyer appointment', bg: 'bg-purple-50 border-purple-200 text-purple-950', badge: 'Legal Counsel' },
    { number: '14416', title: 'Tele-MANAS Mental Health', desc: 'Free 24x7 crisis counseling by psychologists', bg: 'bg-slate-50 border-slate-200 text-slate-900', badge: 'Trauma Support' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-rose-100 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        <div className="bg-rose-600 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Urgent Emergency & Helplines</h2>
              <p className="text-xs text-rose-100">Direct connections to official government services</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-rose-50 border-b border-rose-100 text-xs text-rose-950 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p>
            <strong>Emergency Notice:</strong> This website does not replace emergency dispatch services. If you are in immediate danger, dial <strong>112</strong> immediately from any telephone or mobile device.
          </p>
        </div>

        <div className="p-5 overflow-y-auto space-y-3">
          {emergencyContacts.map((contact) => (
            <div 
              key={contact.number}
              className={`p-3.5 rounded-xl border ${contact.bg} flex items-center justify-between gap-3`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/80 border border-slate-200">
                    {contact.badge}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{contact.title}</span>
                </div>
                <div className="text-xl font-black tracking-tight mt-1">
                  {contact.number}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{contact.desc}</p>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0">
                <a
                  href={`tel:${contact.number}`}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
                <button
                  onClick={() => handleCopy(contact.number)}
                  className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 flex items-center gap-1 transition-colors"
                  title="Copy number"
                >
                  {copiedNumber === contact.number ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
          >
            Close Emergency Panel
          </button>
        </div>
      </div>
    </div>
  );
};
