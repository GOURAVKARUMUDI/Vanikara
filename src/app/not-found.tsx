import Image from 'next/image';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 py-12 bg-transparent relative z-10">
      <div className="max-w-md w-full p-8 rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl shadow-xl space-y-6">
        
        {/* Logo Container */}
        <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center bg-white/10 border border-[var(--glass-border)] shadow-sm">
          <Image src="/logo.png" alt="VANIKARA Logo" className="w-10 h-auto" width={40} height={40} />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-5xl font-display font-black text-[var(--accent-color)] tracking-tight">
            404
          </h1>
          <h2 className="text-lg font-display font-bold text-[var(--text-primary)] uppercase tracking-widest">
            Page Not Found
          </h2>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm mx-auto">
            The page you are looking for does not exist, has been archived, or moved to a different workspace route.
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <Button href="/" variant="primary" size="md" magnetic>
            Return to Core
          </Button>
        </div>
      </div>
    </div>
  );
}
