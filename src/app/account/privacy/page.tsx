'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Download, Trash2, Sliders, ArrowLeft, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';

export default function AccountPrivacyPage() {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmDeleteText, setConfirmDeleteText] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Consent Preferences
  const [whatsappConsent, setWhatsappConsent] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [savingConsent, setSavingConsent] = useState(false);

  const handleExportData = async () => {
    setDownloading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/privacy/export');
      if (!res.ok) {
        throw new Error('Please sign in to download your personal data.');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CELEBRITEE_My_Personal_Data_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      setMessage({
        text: 'Your complete personal data package has been downloaded successfully pursuant to DPDP Act Section 11.',
        type: 'success',
      });
    } catch (err: any) {
      setMessage({
        text: err.message || 'Failed to export data.',
        type: 'error',
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleUpdateConsent = async () => {
    setSavingConsent(true);
    setMessage(null);
    try {
      await fetch('/api/privacy/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consentType: 'ACCOUNT_PREFERENCES_UPDATE',
          status: whatsappConsent || marketingConsent ? 'UPDATED' : 'MINIMAL',
        }),
      });

      localStorage.setItem('celebritee_dpdp_consent_v1', JSON.stringify({
        essential: true,
        whatsapp: whatsappConsent,
        marketing: marketingConsent,
        analytics: analyticsConsent,
        timestamp: new Date().toISOString(),
        version: '1.0',
      }));

      setMessage({
        text: 'Your privacy and communication preferences have been updated.',
        type: 'success',
      });
    } catch (err) {
      setMessage({
        text: 'Failed to update preferences.',
        type: 'error',
      });
    } finally {
      setSavingConsent(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmDeleteText !== 'DELETE MY ACCOUNT') return;

    setDeleting(true);
    try {
      const res = await fetch('/api/privacy/erasure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmationText: confirmDeleteText,
          reason: deleteReason,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message);
        router.push('/');
      } else {
        alert(data.error || 'Failed to erase account.');
      }
    } catch (err) {
      alert('An error occurred during account erasure.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-canvas min-h-screen text-ink">
      
      {/* Back to Account Link */}
      <div className="mb-6">
        <Link
          href="/account"
          className="inline-flex items-center space-x-2 font-mono text-xs uppercase tracking-widest text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Account Overview</span>
        </Link>
      </div>

      {/* Title */}
      <div className="border-b border-border pb-6 mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-surface border border-border font-mono text-[10px] uppercase tracking-[0.25em] text-accent mb-2">
          <Shield className="w-3.5 h-3.5 text-accent" />
          <span>Data Principal Privacy Center</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
          My Privacy & Data Controls
        </h1>
        <p className="font-mono text-xs text-muted uppercase tracking-widest mt-1">
          Exercise your statutory rights under the Digital Personal Data Protection Act, 2023
        </p>
      </div>

      {message && (
        <div
          className={`p-4 border mb-8 flex items-center space-x-3 font-sans text-xs ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      <div className="space-y-8">
        
        {/* 1. Right to Access / Export Data */}
        <div className="p-6 bg-surface border border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl text-ink font-normal">
                1. Right to Access & Data Portability
              </h3>
              <p className="font-sans text-xs text-muted mt-1 leading-relaxed max-w-xl">
                Download a complete, machine-readable JSON copy of all personal records associated with your account, including profile information, shipping addresses, past orders, wishlists, and reviews.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportData}
              disabled={downloading}
              className="px-6 py-3 bg-ink text-canvas font-mono text-xs uppercase tracking-widest hover:bg-accent transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 flex-shrink-0 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Exporting...' : 'Export My Data'}</span>
            </button>
          </div>
        </div>

        {/* 2. Consent Management */}
        <div className="p-6 bg-surface border border-border">
          <h3 className="font-serif text-xl text-ink font-normal mb-1">
            2. Manage Communication & Marketing Consents
          </h3>
          <p className="font-sans text-xs text-muted mb-6">
            Under Section 6 of the DPDP Act, you can freely grant or revoke optional communications at any time.
          </p>

          <div className="space-y-4 font-sans text-xs">
            <div className="flex items-center justify-between p-3.5 bg-canvas border border-border">
              <div>
                <span className="font-mono font-semibold uppercase text-ink block">WhatsApp & SMS Tracking Updates</span>
                <span className="text-muted text-[11px]">Real-time courier dispatch status and delivery PINs.</span>
              </div>
              <input
                type="checkbox"
                checked={whatsappConsent}
                onChange={(e) => setWhatsappConsent(e.target.checked)}
                className="w-4 h-4 accent-ink cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-canvas border border-border">
              <div>
                <span className="font-mono font-semibold uppercase text-ink block">Exclusive Drops & Seasonal Invitations</span>
                <span className="text-muted text-[11px]">VIP early access to limited edition 240 GSM bespoke collections.</span>
              </div>
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="w-4 h-4 accent-ink cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-canvas border border-border">
              <div>
                <span className="font-mono font-semibold uppercase text-ink block">Anonymous Telemetry & Analytics</span>
                <span className="text-muted text-[11px]">Helps optimize studio mockup render times and browsing performance.</span>
              </div>
              <input
                type="checkbox"
                checked={analyticsConsent}
                onChange={(e) => setAnalyticsConsent(e.target.checked)}
                className="w-4 h-4 accent-ink cursor-pointer"
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex justify-end">
            <button
              type="button"
              onClick={handleUpdateConsent}
              disabled={savingConsent}
              className="px-6 py-2.5 bg-ink text-canvas font-mono text-xs uppercase tracking-widest hover:bg-accent transition-colors disabled:opacity-50"
            >
              {savingConsent ? 'Saving...' : 'Update Consents'}
            </button>
          </div>
        </div>

        {/* 3. Right to Erasure / Delete Account */}
        <div className="p-6 bg-rose-50/50 border border-rose-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl text-rose-950 font-normal">
                3. Right to Erasure & Account Deletion
              </h3>
              <p className="font-sans text-xs text-rose-900/80 mt-1 leading-relaxed max-w-xl">
                Permanently erase your login credentials, saved addresses, wishlist, and reviews pursuant to Section 12 of the DPDP Act 2023. Historical tax orders will be anonymized.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-3 bg-rose-700 text-white font-mono text-xs uppercase tracking-widest hover:bg-rose-800 transition-colors flex items-center justify-center space-x-2 flex-shrink-0 shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>

        {/* Statutory Policy Link */}
        <div className="text-center font-mono text-xs uppercase tracking-widest text-muted pt-4">
          <Link href="/privacy-policy" className="text-accent hover:underline">
            Read Full Statutory DPDP Notice & Grievance Policy →
          </Link>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-canvas border border-border max-w-md w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center space-x-2 text-rose-600 mb-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <h3 className="font-serif text-xl text-ink font-bold">
                Confirm Account Erasure
              </h3>
            </div>
            <p className="font-sans text-xs text-muted leading-relaxed mb-4">
              This action is permanent and cannot be undone. All your saved addresses, wishlists, and login credentials will be erased from our database.
            </p>

            <form onSubmit={handleDeleteAccount} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block uppercase text-muted mb-1">
                  Optional Reason:
                </label>
                <input
                  type="text"
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="e.g. Closing account"
                  className="w-full p-2.5 bg-surface border border-border text-ink focus:outline-none"
                />
              </div>

              <div>
                <label className="block uppercase text-ink font-semibold mb-1">
                  Type <span className="text-rose-600">DELETE MY ACCOUNT</span> to confirm:
                </label>
                <input
                  type="text"
                  required
                  value={confirmDeleteText}
                  onChange={(e) => setConfirmDeleteText(e.target.value)}
                  className="w-full p-2.5 bg-surface border border-border text-ink focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-border text-muted hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={confirmDeleteText !== 'DELETE MY ACCOUNT' || deleting}
                  className="px-6 py-2 bg-rose-700 text-white font-semibold hover:bg-rose-800 disabled:opacity-40"
                >
                  {deleting ? 'Erasing...' : 'Confirm Erasure'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
