'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { GoogleLogin } from '../auth/GoogleLogin';
import { Logout } from '../auth/Logout';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  const [u, setU] = useState<any>(null);
  const sb = createClient();

  useEffect(() => {
    const { data: { subscription } } = sb.auth.onAuthStateChange((_: any, s: any) => {
      setU(s?.user || null);
    });
    return () => subscription.unsubscribe();
  }, [sb]);

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-transparent border-b border-white/10">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/10 border border-white/10 shadow-sm">
          <Image src="/logo.png" alt="Vanikara Logo" className="w-6 h-auto group-hover:scale-105 transition-transform" width={24} height={24} priority />
        </div>
        <span className="font-display font-black text-sm tracking-widest text-white">
          VANIKARA
        </span>
      </Link>
      <div className="flex items-center gap-4">
        {u ? (
          <>
            <span className="text-white/70 text-sm hidden md:inline">{u.email}</span>
            <Link href="/dashboard" className="text-white text-sm hover:underline">Dashboard</Link>
            <Logout />
          </>
        ) : (
          <GoogleLogin />
        )}
      </div>
    </nav>
  );
}
