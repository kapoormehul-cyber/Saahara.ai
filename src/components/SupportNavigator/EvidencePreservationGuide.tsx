import React from 'react';
import { Shield, Camera, FileText, Lock, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

export const EvidencePreservationGuide: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
              <Shield className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-900">Safe Evidence Preservation Protocol</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Guidelines on securing digital and physical documentation for legal admissibility under Indian law (Section 65B of Indian Evidence Act / BSA 2023).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1: Digital Messages & Screenshots */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
            <Camera className="w-4 h-4 text-indigo-600" />
            <span>1. Capture Full Uncropped Screenshots</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
            <li>Ensure the contact&apos;s phone number, username handle, and device status bar (time, date, battery) are fully visible.</li>
            <li>Take scrolling screenshots or record the screen while scrolling through message threads.</li>
            <li>Never crop, annotate, blur, or filter the original image. Keep exact unmodified camera files.</li>
          </ul>
        </div>

        {/* Step 2: Chat Backups & Raw Exports */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
            <FileText className="w-4 h-4 text-teal-600" />
            <span>2. Export Raw Chat Archives</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
            <li>In WhatsApp or Telegram: Use <em>Export Chat (Without Media or With Media)</em> to produce a raw .txt archive.</li>
            <li>Backup email headers: In Gmail, select <em>&ldquo;Show Original&rdquo;</em> and download the .eml header file with IP hops.</li>
            <li>Upload backups immediately to a secure cloud drive or personal email accessible only by you.</li>
          </ul>
        </div>

        {/* Step 3: Contemporaneous Incident Diary */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
            <Lock className="w-4 h-4 text-purple-600" />
            <span>3. Maintain an Incident Logbook</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
            <li>Write down date, exact time, exact physical location, and any witnesses present as soon after the event as possible.</li>
            <li>Note exact words or actions without paraphrasing.</li>
            <li>Timestamped digital notes (e.g. Google Docs revision history) provide strong temporal proof of contemporaneous recording.</li>
          </ul>
        </div>

        {/* Step 4: Medical & Physical Proof */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>4. Physical & Medical Documentation</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
            <li>Seek medical attention at a government district hospital or One Stop Centre (Sakhi Centre) within 72 hours.</li>
            <li>Request a Medico-Legal Certificate (MLC). Medical examination cannot be refused by hospitals.</li>
            <li>Preserve clothing or physical items in a clean, breathable paper bag (avoid airtight plastic).</li>
          </ul>
        </div>
      </div>

      <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-xl text-xs text-indigo-950 space-y-1">
        <span className="font-bold flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-indigo-600" />
          Statutory Free Legal Assistance:
        </span>
        <p className="leading-relaxed pl-5">
          Under Section 12 of the Legal Services Authorities Act, all women in India are entitled to free legal counsel and court representation. You can dial <strong>15100</strong> (NALSA) or visit the legal aid clinic at any district court.
        </p>
      </div>
    </div>
  );
};
