import { PhoneCall, CheckCircle2, ShieldCheck } from "lucide-react";

/**
 * Conceptual enterprise visualization of AI-Assisted Telephone Ordering
 * (app-free voice ordering with live inventory sync and human fallback).
 */
export default function TelephoneOrderingVisual() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-line bg-[#101C30] p-6 text-[#F5F7FA] shadow-raised sm:p-8">
      <div className="flex items-center justify-between border-b border-[#34445C] pb-4">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-[6px] bg-[#0F62FE] text-white">
            <PhoneCall className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">Voice Ordering Assistant</p>
            <p className="font-mono text-[11px] text-[#8D9DB3]">App-Free Telephone Channel · Proposed</p>
          </div>
        </div>
        <span className="rounded bg-[#78A9FF]/15 px-2.5 py-0.5 font-mono text-[10px] uppercase text-[#78A9FF]">
          Conceptual Interface
        </span>
      </div>

      {/* Subtle static acoustic waveform bars */}
      <div className="my-6 flex h-12 items-center justify-center gap-1.5" aria-hidden="true">
        {[24, 42, 68, 92, 56, 84, 100, 72, 48, 88, 64, 38, 76, 52, 30, 60, 44, 22].map((h, i) => (
          <span
            key={i}
            className="w-1.5 rounded-full bg-[#78A9FF]/75"
            style={{ height: `${Math.round(h * 0.44)}px` }}
          />
        ))}
      </div>

      {/* Structured order confirmation card */}
      <div className="space-y-3 rounded-[8px] border border-[#34445C] bg-[#152238] p-4 text-xs">
        <div className="flex items-center justify-between text-[#B8C4D4]">
          <span className="font-mono text-[10px] uppercase text-[#78A9FF]">Live Backend Verification</span>
          <span className="inline-flex items-center gap-1 text-[#42BE65]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Menu &amp; Inventory Synced
          </span>
        </div>
        <div className="space-y-1.5 border-t border-[#34445C] pt-3 text-[#F5F7FA]">
          <p className="font-medium">1. Multilingual voice request parsed &amp; confirmed aloud</p>
          <p className="text-[#B8C4D4]">2. Transparent item total &amp; delivery/pickup details read back</p>
          <p className="text-[#B8C4D4]">3. Secure SMS payment link or eligible COD confirmed</p>
          <p className="text-[#B8C4D4]">4. Order transmitted to restaurant with human support fallback</p>
        </div>
      </div>

      <p className="mt-4 flex items-center gap-1.5 font-mono text-[11px] text-[#8D9DB3]">
        <ShieldCheck className="h-3.5 w-3.5 text-[#78A9FF]" />
        Consent &amp; call disclosure required before order confirmation
      </p>
    </div>
  );
}
