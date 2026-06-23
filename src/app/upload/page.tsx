'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import PageHero from '@/components/ui/PageHero';
import Button from '@/components/ui/Button';
import { Upload, FileCheck, AlertCircle } from 'lucide-react';

export default function UploadPage() {
  const [f, setF] = useState<File | null>(null);
  const [l, setL] = useState(false);
  const [s, setS] = useState('');
  const [isError, setIsError] = useState(false);
  const sb = createClient();

  const handle = async () => {
    if (!f || !sb) return;
    setL(true);
    setS('');
    setIsError(false);

    try {
      const { data: { user } } = await sb.auth.getUser();
      if (!user) {
        setS('Please login to upload files.');
        setIsError(true);
        setL(false);
        return;
      }

      const path = `${user.id}/${Date.now()}_${f.name}`;
      const { _data, error } = await sb.storage.from('files').upload(path, f);

      if (error) {
        setS(error.message);
        setIsError(true);
      } else {
        const { data: { publicUrl } } = sb.storage.from('files').getPublicUrl(path);
        await sb.from('files').insert({ user_id: user.id, file_url: publicUrl });
        setS('File uploaded successfully! Our team will review it shortly.');
        setF(null);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (_err: any) {
      setS('An unexpected error occurred.');
      setIsError(true);
    } finally {
      setL(false);
    }
  };

  return (
    <>
      <PageHero
        tag="Secure Portal"
        title={<>Safe & Encrypted <span className="gradient-text">File Upload</span></>}
        subtitle="Securely share documents, assets, or project requirements with our engineering team."
      />

      <section className="py-20 bg-transparent">
        <div className="max-w-2xl mx-auto px-6">
          <div className="p-10 bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-md rounded-[40px] text-center shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[var(--accent-color)]/5 blur-3xl -ml-16 -mt-16"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-[var(--accent-color)]/10 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                <Upload className="w-8 h-8 text-[var(--accent-color)]" />
              </div>

              <div className="mb-8">
                <input
                  type="file"
                  id="file-upload"
                  onChange={(e) => setF(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label 
                  htmlFor="file-upload"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--glass-bg)] border-2 border-dashed border-[var(--glass-border)] rounded-2xl cursor-pointer hover:border-[var(--accent-color)] hover:bg-slate-500/5 transition-all text-[var(--text-secondary)] font-bold text-sm"
                >
                  {f ? (
                    <>
                      <FileCheck className="w-5 h-5 text-green-500" />
                      {f.name}
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Select File to Upload
                    </>
                  )}
                </label>
                <p className="mt-4 text-[11px] font-bold text-[var(--text-secondary)]/60 uppercase tracking-widest">
                  Maximum file size: 50MB (PDF, PNG, JPG, ZIP)
                </p>
              </div>

              <Button 
                onClick={handle} 
                disabled={l || !f} 
                className="w-full py-4 shadow-lg shadow-blue-600/10"
              >
                {l ? 'Encrypting & Uploading...' : 'Securely Upload Now'}
              </Button>

              {s && (
                <div className={`mt-8 p-4 rounded-2xl flex items-center justify-center gap-3 animate-in fade-in zoom-in-95 duration-300 ${isError ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                  {isError ? <AlertCircle className="w-5 h-5" /> : <FileCheck className="w-5 h-5" />}
                  <span className="text-sm font-bold">{s}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 text-center">
             <p className="text-[var(--text-secondary)] text-xs font-medium max-w-sm mx-auto">
               By uploading files, you agree to our terms. Everything shared via this portal is encrypted and stored in secure private buckets.
             </p>
          </div>
        </div>
      </section>
    </>
  );
}
