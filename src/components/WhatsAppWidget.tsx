'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function WhatsAppWidget() {
  const whatsappNumber = '919345452087';
  const message = encodeURIComponent(
    'Hello CELEBRITEE Atelier, I need assistance with an order / size inquiry.'
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 group font-mono text-xs font-semibold tracking-wider"
    >
      <MessageSquare className="w-5 h-5 fill-current text-white" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out uppercase text-[11px] tracking-widest pl-1">
        WhatsApp Support
      </span>
    </a>
  );
}
