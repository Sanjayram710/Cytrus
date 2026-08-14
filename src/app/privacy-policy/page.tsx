'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Lock, FileText, CheckCircle2, AlertCircle, Send, UserCheck, RefreshCw, Trash2, Mail, MapPin } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const [activeTab, setActiveTab] = useState<'notice' | 'grievance'>('notice');

  // Grievance Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [grievanceType, setGrievanceType] = useState('ACCESS_EXPORT');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ success: boolean; message: string; ticketId?: string } | null>(null);

  const handleSubmitGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmissionResult(null);

    try {
      const res = await fetch('/api/privacy/grievance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          grievanceType,
          description,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmissionResult({
          success: true,
          message: data.message,
          ticketId: data.ticketId,
        });
        setName('');
        setEmail('');
        setPhone('');
        setDescription('');
      } else {
        setSubmissionResult({
          success: false,
          message: data.error || 'Failed to submit grievance. Please try again.',
        });
      }
    } catch (err) {
      setSubmissionResult({
        success: false,
        message: 'A network error occurred. Please try again or email privacy@celebritee.in directly.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-canvas min-h-screen text-ink">
      
      {/* Header Banner */}
      <div className="border-b border-border pb-8 mb-10 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-surface border border-border font-mono text-[10px] uppercase tracking-[0.25em] text-accent mb-3">
          <Shield className="w-3.5 h-3.5 text-accent" />
          <span>Statutory Privacy & Data Governance</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-ink">
          Privacy Policy & DPDP Notice
        </h1>
        <p className="font-mono text-xs text-muted uppercase tracking-widest mt-2">
          Compliance under the Digital Personal Data Protection Act, 2023 (DPDP Act, India) · Effective Version 1.0
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-8 font-mono text-xs uppercase tracking-wider">
        <button
          type="button"
          onClick={() => setActiveTab('notice')}
          className={`py-3 px-5 border-b-2 font-semibold transition-all ${
            activeTab === 'notice'
              ? 'border-ink text-ink bg-surface/50'
              : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          1. Statutory DPDP Notice & Disclosures
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('grievance')}
          className={`py-3 px-5 border-b-2 font-semibold transition-all ${
            activeTab === 'grievance'
              ? 'border-ink text-ink bg-surface/50'
              : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          2. Data Rights & Grievance Redressal
        </button>
      </div>

      {activeTab === 'notice' ? (
        <div className="prose prose-stone max-w-none font-sans text-xs sm:text-sm leading-relaxed text-ink/90 space-y-8">
          
          {/* Section 1 */}
          <section className="p-6 bg-surface border border-border space-y-3">
            <h2 className="font-serif text-xl text-ink font-normal tracking-tight m-0">
              1. Identity of the Data Fiduciary
            </h2>
            <p className="text-muted leading-relaxed">
              This Digital Personal Data Protection Notice is issued by <strong>CELEBRITEE.in / CYTRUS ATELIER</strong> (hereinafter referred to as the <em>"Data Fiduciary"</em>, <em>"we"</em>, <em>"us"</em>, or <em>"our"</em>) pursuant to Section 5 and Section 6 of the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
              <div className="flex items-center space-x-2 text-ink">
                <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                <span>Headquarters: Bangalore, Karnataka, India</span>
              </div>
              <div className="flex items-center space-x-2 text-ink">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <span>Grievance Desk: privacy@celebritee.in</span>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl text-ink font-normal tracking-tight border-b border-border pb-2">
              2. Personal Data We Collect & Specific Purposes
            </h2>
            <p>
              We process personal digital data strictly based on your freely given, specific, informed, unconditional, and unambiguous consent.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border font-mono text-xs text-left">
                <thead>
                  <tr className="bg-surface text-ink">
                    <th className="border border-border p-3">Data Category</th>
                    <th className="border border-border p-3">Specific Fields Collected</th>
                    <th className="border border-border p-3">Statutory Purpose (Section 4 & 7)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="border border-border p-3 font-semibold text-ink">Identity & Contact</td>
                    <td className="border border-border p-3 text-muted">Full Name, Email Address, Mobile Phone Number</td>
                    <td className="border border-border p-3">Order confirmations, account verification, login security.</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-semibold text-ink">Delivery & Logistics</td>
                    <td className="border border-border p-3 text-muted">Shipping Address, City, State, PIN Code</td>
                    <td className="border border-border p-3">Physical courier dispatch, delivery route optimization.</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-semibold text-ink">Custom Atelier Data</td>
                    <td className="border border-border p-3 text-muted">Custom text headlines, uploaded artwork emblems, apparel size/fit</td>
                    <td className="border border-border p-3">Bespoke 240 GSM print rendering and manufacturing.</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-semibold text-ink">Payment Identifiers</td>
                    <td className="border border-border p-3 text-muted">Razorpay Order IDs, Payment Transaction Status (No card/CVV saved)</td>
                    <td className="border border-border p-3">Secure payment settlement, GST invoice generation, refunds.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl text-ink font-normal tracking-tight border-b border-border pb-2">
              3. Authorised Data Processors & Third Parties
            </h2>
            <p>
              Under Section 8(2) of the DPDP Act, we only engage contractually bound Data Processors that uphold stringent data security safeguards:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-muted">
              <li><strong>Payment Gateway:</strong> Razorpay Software Private Limited (PCI-DSS Level 1 Compliant).</li>
              <li><strong>Courier Logistics:</strong> Integrated courier partners (Shiprocket, Delhivery, BlueDart) for physical door-to-door delivery.</li>
              <li><strong>Order Notifications:</strong> Official WhatsApp Business API & SMS Gateways for real-time dispatch alerts.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl text-ink font-normal tracking-tight border-b border-border pb-2">
              4. Rights of the Data Principal (Sections 11 – 14)
            </h2>
            <p>
              As a Data Principal under Indian law, you have absolute statutory rights over your personal data:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-surface/60 border border-border">
                <div className="flex items-center space-x-2 mb-1">
                  <UserCheck className="w-4 h-4 text-accent" />
                  <h4 className="font-mono text-xs uppercase font-semibold text-ink">Right to Access (Section 11)</h4>
                </div>
                <p className="text-muted text-xs leading-relaxed">
                  Request a complete machine-readable copy of all personal profile data, addresses, and order history held by us.
                </p>
              </div>

              <div className="p-4 bg-surface/60 border border-border">
                <div className="flex items-center space-x-2 mb-1">
                  <RefreshCw className="w-4 h-4 text-accent" />
                  <h4 className="font-mono text-xs uppercase font-semibold text-ink">Right to Correction (Section 12)</h4>
                </div>
                <p className="text-muted text-xs leading-relaxed">
                  Correct inaccurate, misleading, or outdated personal contact and shipping details in real-time.
                </p>
              </div>

              <div className="p-4 bg-surface/60 border border-border">
                <div className="flex items-center space-x-2 mb-1">
                  <Trash2 className="w-4 h-4 text-accent" />
                  <h4 className="font-mono text-xs uppercase font-semibold text-ink">Right to Erasure (Section 12)</h4>
                </div>
                <p className="text-muted text-xs leading-relaxed">
                  Request permanent deletion of your account and personal data (subject to mandatory 7-year statutory tax retention).
                </p>
              </div>

              <div className="p-4 bg-surface/60 border border-border">
                <div className="flex items-center space-x-2 mb-1">
                  <Lock className="w-4 h-4 text-accent" />
                  <h4 className="font-mono text-xs uppercase font-semibold text-ink">Right to Withdraw Consent</h4>
                </div>
                <p className="text-muted text-xs leading-relaxed">
                  Withdraw consent for WhatsApp alerts, marketing drops, or telemetry anytime via your account settings.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="p-6 bg-[#151515] text-[#FFFEFA] border border-[#B89B5E]/40 space-y-3">
            <h2 className="font-serif text-xl text-white font-normal tracking-tight m-0">
              5. Data Protection Officer (DPO) & Grievance Redressal
            </h2>
            <p className="text-[#FAF7F2]/80 leading-relaxed text-xs">
              Pursuant to Section 13 of the DPDP Act 2023, if you have any inquiry, dispute, or complaint regarding the processing of your personal data, you may reach our designated Grievance Officer:
            </p>
            <div className="font-mono text-xs space-y-1.5 pt-2 text-[#FAF7F2]">
              <p><strong className="text-[#B89B5E]">Designation:</strong> Data Protection & Grievance Redressal Officer</p>
              <p><strong className="text-[#B89B5E]">Entity:</strong> CELEBRITEE.in / CYTRUS ATELIER</p>
              <p><strong className="text-[#B89B5E]">Address:</strong> Bangalore, Karnataka - 560001, India</p>
              <p><strong className="text-[#B89B5E]">Grievance Email:</strong> <a href="mailto:privacy@celebritee.in" className="text-[#B89B5E] underline">privacy@celebritee.in</a></p>
              <p><strong className="text-[#B89B5E]">Statutory Resolution SLA:</strong> Within thirty (30) days from receipt of grievance.</p>
            </div>
            <p className="text-muted text-[11px] pt-2">
              If your grievance is not resolved satisfactorily by our officer within the prescribed statutory timeline, you have the right to file a complaint before the <strong>Data Protection Board of India (DPBI)</strong>.
            </p>
          </section>
        </div>
      ) : (
        /* Grievance & Rights Request Form */
        <div className="max-w-2xl bg-surface border border-border p-6 sm:p-8">
          <div className="mb-6">
            <h3 className="font-serif text-2xl text-ink">
              Submit a Data Privacy or Rights Request
            </h3>
            <p className="font-mono text-xs text-muted uppercase tracking-widest mt-1">
              Directly routed to the Data Protection Officer under DPDP Act 2023
            </p>
          </div>

          {submissionResult && (
            <div
              className={`p-4 border mb-6 flex items-start space-x-3 ${
                submissionResult.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
            >
              {submissionResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="font-sans text-xs">
                {submissionResult.ticketId && (
                  <p className="font-mono font-bold uppercase tracking-wider mb-1">
                    Ticket Reference: {submissionResult.ticketId}
                  </p>
                )}
                <p>{submissionResult.message}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmitGrievance} className="space-y-5 font-mono text-xs">
            <div>
              <label className="block uppercase tracking-widest text-muted mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aneesh Naren"
                className="w-full p-3 bg-canvas border border-border text-ink focus:outline-none focus:border-ink"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block uppercase tracking-widest text-muted mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-3 bg-canvas border border-border text-ink focus:outline-none focus:border-ink"
                />
              </div>
              <div>
                <label className="block uppercase tracking-widest text-muted mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-3 bg-canvas border border-border text-ink focus:outline-none focus:border-ink"
                />
              </div>
            </div>

            <div>
              <label className="block uppercase tracking-widest text-muted mb-1.5">
                Nature of Request / Grievance *
              </label>
              <select
                value={grievanceType}
                onChange={(e) => setGrievanceType(e.target.value)}
                className="w-full p-3 bg-canvas border border-border text-ink focus:outline-none focus:border-ink"
              >
                <option value="ACCESS_EXPORT">Right to Access / Export Personal Data</option>
                <option value="CORRECTION">Right to Correction / Update Outdated Data</option>
                <option value="ERASURE_DELETE">Right to Erasure / Delete Account</option>
                <option value="WITHDRAW_CONSENT">Withdraw Marketing / WhatsApp Consent</option>
                <option value="DATA_SECURITY_DISPUTE">Data Security & Privacy Dispute</option>
                <option value="OTHER_GRIEVANCE">Other DPDP Statutory Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block uppercase tracking-widest text-muted mb-1.5">
                Detailed Description of Query / Dispute *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe your data protection request or inquiry in detail..."
                className="w-full p-3 bg-canvas border border-border text-ink focus:outline-none focus:border-ink resize-y"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-ink text-canvas font-semibold uppercase tracking-widest hover:bg-accent transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting to DPO...' : 'Submit Grievance Ticket'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
