'use client';

import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  name?: string;
  email?: string;
  message?: string;
  variant?: 'floating' | 'inline';
}

export default function WhatsAppButton({ name = '', email = '', message = '', variant = 'floating' }: WhatsAppButtonProps) {
  const phone = '919121308626';
  const text = encodeURIComponent(
    `Hello Vanikara! I'm ${name}${email ? ` (${email})` : ''}.\n\nMessage: ${message || 'I would like to discuss a project.'}`
  );
  const url = `https://wa.me/${phone}?text=${text}`;

  if (variant === 'inline') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-600/20 w-full"
      >
        <MessageCircle className="w-5 h-5" />
        Chat on WhatsApp
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[100] p-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-2xl shadow-green-600/40 transition-all hover:scale-110 active:scale-95 flex items-center gap-2 group"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap px-0 group-hover:px-2">
        WhatsApp Us
      </span>
    </a>
  );
}
