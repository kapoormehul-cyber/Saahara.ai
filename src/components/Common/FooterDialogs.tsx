import React from 'react';
import { X, Shield, Lock, FileText, PhoneCall, HelpCircle, AlertTriangle, ExternalLink } from 'lucide-react';

export type FooterModalType = 'privacy' | 'guidelines' | 'resources' | 'terms' | 'contact' | null;

interface FooterDialogsProps {
  activeModal: FooterModalType;
  onClose: () => void;
}

export const FooterDialogs: React.FC<FooterDialogsProps> = ({ activeModal, onClose }) => {
  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200/80 p-6 md:p-8"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {activeModal === 'privacy' && <Lock className="w-6 h-6 text-indigo-600" />}
            {activeModal === 'guidelines' && <Shield className="w-6 h-6 text-teal-600" />}
            {activeModal === 'resources' && <PhoneCall className="w-6 h-6 text-rose-500" />}
            {activeModal === 'terms' && <FileText className="w-6 h-6 text-slate-700" />}
            {activeModal === 'contact' && <HelpCircle className="w-6 h-6 text-indigo-600" />}
            <h2 className="text-xl font-bold text-slate-900">
              {activeModal === 'privacy' && 'Privacy Commitment & Data Architecture'}
              {activeModal === 'guidelines' && 'Community Safety & Respect Guidelines'}
              {activeModal === 'resources' && 'Emergency Services & Statutory Rights'}
              {activeModal === 'terms' && 'Prototype Terms of Use & Disclaimers'}
              {activeModal === 'contact' && 'Contact & Responsible Security Reporting'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 text-sm text-slate-700 leading-relaxed space-y-4">
          {activeModal === 'privacy' && (
            <>
              <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-950 font-medium text-xs">
                Key Principle: SAAHARA AI is built on Privacy by Design. We never sell user data, broadcast exact real-time GPS coordinates, or expose private travel routines.
              </div>
              <h3 className="font-semibold text-slate-900 text-base">1. Approximate Public Coordinates Only</h3>
              <p>
                Observations on the Living Safety Map and Saheli Signal are mapped strictly to public landmarks (metro stations, bus shelters, major road junctions) with intentional uncertainty radius buffers (100–300m). No private residential pinpoints are ever recorded or displayed.
              </p>
              <h3 className="font-semibold text-slate-900 text-base">2. Mutual Consent for Journey Data</h3>
              <p>
                In Saheli Share, journey matching is conducted on broad neighborhood zones. Trip details (driver name, vehicle number, pickup spot) remain strictly concealed until both users explicitly inspect limited profiles and approve mutual connection.
              </p>
              <h3 className="font-semibold text-slate-900 text-base">3. Data Retention & Deletion</h3>
              <p>
                Temporary infrastructure reports are weighted down over time. Users have unconditional rights to revoke active shared trip disclosures, wipe local browser data, or purge their profile instantly from the Settings view.
              </p>
            </>
          )}

          {activeModal === 'guidelines' && (
            <>
              <div className="p-3.5 bg-teal-50 border border-teal-100 rounded-xl text-teal-950 font-medium text-xs">
                Our motto is: Practical safety, informed decisions, privacy, and community support—never fearmongering.
              </div>
              <h3 className="font-semibold text-slate-900 text-base">1. Objective Public Observations</h3>
              <p>
                When sharing reports, focus on verifiable environmental conditions (lighting, footpath state, transit frequency). Do not publish unsubstantiated accusations or personal identifying details of individuals.
              </p>
              <h3 className="font-semibold text-slate-900 text-base">2. Public Meeting Points for Companionship</h3>
              <p>
                When coordinating walking companions in Saheli Circle, always arrange meeting points in well-lit, high-visibility public spaces (metro concourse near ticket counter, manned bus terminal, cafe foyer).
              </p>
              <h3 className="font-semibold text-slate-900 text-base">3. Cab Provider Rules & Feasibility</h3>
              <p>
                Saheli Share enables communication between independent commuters. It does not alter third-party cab booking terms. Passengers must ensure the cab driver permits additional stops or passengers according to provider policies.
              </p>
            </>
          )}

          {activeModal === 'resources' && (
            <>
              <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-950 font-medium text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  Immediate Danger Notice: If you or someone nearby is in urgent danger, call <strong>112</strong> immediately.
                </span>
              </div>
              <p>
                SAAHARA AI provides directory links to verified, official statutory authorities across India:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>112 (ERSS):</strong> Pan-India unified police, fire, and ambulance response.</li>
                <li><strong>1091:</strong> Women Helpline (State Police Dedicated Distress Escort).</li>
                <li><strong>181:</strong> Ministry of Women & Child Development Crisis Intervention & One Stop Centres.</li>
                <li><strong>15100:</strong> National Legal Services Authority (NALSA) free legal aid.</li>
                <li><strong>14416:</strong> Tele-MANAS free national mental health & crisis tele-counseling.</li>
                <li><strong>1930:</strong> National Cyber Crime Reporting Portal for non-consensual images and online harassment.</li>
              </ul>
            </>
          )}

          {activeModal === 'terms' && (
            <>
              <h3 className="font-semibold text-slate-900 text-base">1. Prototype Demonstration Notice</h3>
              <p>
                This software is an interactive prototype developed for <strong>AZINHACK ’26</strong>. It is not an active emergency dispatch portal, licensed commercial cab aggregator, or legal entity.
              </p>
              <h3 className="font-semibold text-slate-900 text-base">2. Age Eligibility</h3>
              <p>
                This prototype is strictly designed for adults (18+ years of age). To protect youth privacy and eliminate adult-minor contact risks, unverified youth registrations are not supported.
              </p>
              <h3 className="font-semibold text-slate-900 text-base">3. Verification Badges Transparency</h3>
              <p>
                Verification badges in this prototype represent simulated email/phone confirmation checks. They do not constitute certified background checks, government identity verification, or guarantees of individual trustworthiness.
              </p>
            </>
          )}

          {activeModal === 'contact' && (
            <>
              <h3 className="font-semibold text-slate-900 text-base">AZINHACK ’26 Team & Research Contact</h3>
              <p>
                SAAHARA AI was built as an open social-impact technology prototype for AZINHACK ’26 to champion privacy-respecting community safety architecture.
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                <div><strong>Project:</strong> SAAHARA AI (Privacy-First Women Safety & Community Platform)</div>
                <div><strong>Hackathon:</strong> AZINHACK ’26</div>
                <div><strong>Security Inquiries:</strong> security@saahara.ai.local (Demo)</div>
                <div><strong>Status:</strong> Functional Prototype with TinyFish AI Public Research Adapter</div>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Understood & Close
          </button>
        </div>
      </div>
    </div>
  );
};
