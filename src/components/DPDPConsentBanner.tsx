'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Check, X, Sliders, ChevronRight } from 'lucide-react';

interface ConsentPreferences {
  essential: boolean;
  whatsapp: boolean;
  marketing: boolean;
  analytics: boolean;
}

export default function DPDPConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomiseModal, setShowCustomiseModal] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    essential: true,
    whatsapp: true,
    marketing: false,
    analytics: true,
  });

  useEffect(() => {
    // Check if user has already made a consent choice
    const savedConsent = localStorage.getItem('celebritee_dpdp_consent_v1');
    if (!savedConsent) {
      // Delay display slightly for smooth page entry
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = async (prefs: ConsentPreferences) => {
    localStorage.setItem('celebritee_dpdp_consent_v1', JSON.stringify({
      ...prefs,
      timestamp: new Date().toISOString(),
      version: '1.0',
    }));

    setIsVisible(false);
    setShowCustomiseModal(false);

    // Asynchronously log consent to backend for DPDP statutory compliance audit trail
    try {
      let sessionId = sessionStorage.getItem('celeb_session_id');
      if (!sessionId) {
        sessionId = 'sess_' + Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('celeb_session_id', sessionId);
      }

      await fetch('/api/privacy/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          consentType: 'GLOBAL_DPDP_PREFERENCES',
          status: prefs.marketing || prefs.whatsapp ? 'GRANTED' : 'ESSENTIAL_ONLY',
          noticeVersion: '1.0',
        }),
      });
    } catch (e) {
      // Non-blocking
    }
  };

  const handleAcceptAll = () => {
    const all = { essential: true, whatsapp: true, marketing: true, analytics: true };
    setPreferences(all);
    saveConsent(all);
  };

  const handleEssentialOnly = () => {
    const essentialOnly = { essential: true, whatsapp: false, marketing: false, analytics: false };
    setPreferences(essentialOnly);
    saveConsent(essentialOnly);
  };

  if (!isVisible && !showCustomiseModal) return null;

  return (
    <>
      {/* Floating Minimal Luxury Consent Bar */}
      {isVisible && !showCustomiseModal && (
        <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-xl z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-[#151515] text-[#FFFEFA] border border-[#B89B5E]/30 p-5 md:p-6 shadow-2xl backdrop-blur-md">
            <div className="flex items-start space-x-3 mb-3">
              <Shield className="w-4 h-4 text-[#B89B5E] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-[#B89B5E] font-semibold">
                  Privacy & Data Protection Notice
                </h4>
                <p className="font-sans text-xs text-[#FAF7F2]/80 leading-relaxed mt-1.5">
                  Pursuant to India’s{' '}
                  <strong className="text-white font-medium">Digital Personal Data Protection Act, 2023</strong>, we process your personal data strictly for order fulfillment, logistics dispatch, and tailored atelier experiences with your informed consent.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 mt-3 font-mono text-[11px] uppercase tracking-wider">
              <Link
                href="/privacy-policy"
                className="text-[#B89B5E] hover:underline underline-offset-4 flex items-center"
              >
                <span>Read DPDP Notice</span>
                <ChevronRight className="w-3 h-3 ml-0.5" />
              </Link>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomiseModal(true)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/20 text-[#FAF7F2] transition-colors"
                >
                  Customise
                </button>
                <button
                  type="button"
                  onClick={handleEssentialOnly}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/30 text-[#FAF7F2] transition-colors"
                >
                  Essential Only
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-4 py-1.5 bg-[#104EA5] hover:bg-[#0c3e85] text-white font-semibold transition-colors shadow-sm"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Granular Preference Customization Modal */}
      {showCustomiseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-canvas border border-border max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                  Statutory Consent Preferences
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-ink mt-0.5">
                  Manage Your Data Consent
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomiseModal(false)}
                className="p-1.5 text-muted hover:text-ink hover:bg-surface transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-8 font-sans text-xs">
              {/* Essential */}
              <div className="p-3.5 bg-surface/60 border border-border flex items-start justify-between">
                <div className="pr-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-semibold uppercase text-ink">
                      1. Core Order & Delivery Fulfillment
                    </span>
                    <span className="font-mono text-[9px] bg-ink text-canvas px-1.5 py-0.5 uppercase">
                      Mandatory
                    </span>
                  </div>
                  <p className="text-muted mt-1 leading-relaxed">
                    Required for processing payments, courier shipping, GST invoices, and account security.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="mt-1 accent-ink cursor-not-allowed opacity-60"
                />
              </div>

              {/* WhatsApp Alerts */}
              <div className="p-3.5 bg-surface/60 border border-border flex items-start justify-between">
                <div className="pr-4">
                  <span className="font-mono text-xs font-semibold uppercase text-ink block">
                    2. WhatsApp & SMS Order Tracking
                  </span>
                  <p className="text-muted mt-1 leading-relaxed">
                    Receive direct WhatsApp/SMS dispatch notifications, real-time tracking links, and delivery confirmations.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.whatsapp}
                  onChange={(e) => setPreferences({ ...preferences, whatsapp: e.target.checked })}
                  className="mt-1 w-4 h-4 accent-accent cursor-pointer"
                />
              </div>

              {/* Marketing & Drops */}
              <div className="p-3.5 bg-surface/60 border border-border flex items-start justify-between">
                <div className="pr-4">
                  <span className="font-mono text-xs font-semibold uppercase text-ink block">
                    3. Exclusive Drops & Editorial Invitations
                  </span>
                  <p className="text-muted mt-1 leading-relaxed">
                    Priority access to limited 240 GSM drops, celebrity collaborations, and curated seasonal previews.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  className="mt-1 w-4 h-4 accent-accent cursor-pointer"
                />
              </div>

              {/* Analytics */}
              <div className="p-3.5 bg-surface/60 border border-border flex items-start justify-between">
                <div className="pr-4">
                  <span className="font-mono text-xs font-semibold uppercase text-ink block">
                    4. Performance & Experience Enhancement
                  </span>
                  <p className="text-muted mt-1 leading-relaxed">
                    Anonymous telemetry to improve page speeds, responsive t-shirt customizer rendering, and catalog browsing.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="mt-1 w-4 h-4 accent-accent cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border font-mono text-xs uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setShowCustomiseModal(false)}
                className="px-4 py-2.5 border border-border text-muted hover:text-ink transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => saveConsent(preferences)}
                className="px-6 py-2.5 bg-ink text-canvas font-semibold hover:bg-accent transition-colors shadow-sm"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
