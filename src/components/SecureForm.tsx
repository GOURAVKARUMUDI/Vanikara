import React, { FormEvent, useState } from 'react';
import { validatePayload, sanitizeInput } from '../lib/security';
import { securityLogger } from '../utils/security-logger';

interface SecureFormProps {
  onSubmit: (data: Record<string, any>) => void;
  children: React.ReactNode;
  className?: string;
}

export const SecureForm = ({ onSubmit, children, className }: SecureFormProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const rawData: Record<string, any> = {};
    formData.forEach((val, key) => {
      rawData[key] = val;
    });

    const { isSafe, threats } = validatePayload(rawData);

    if (!isSafe) {
      securityLogger.log('XSS_ATTEMPT', 'Blocked submission of unsafe data', {
        payload: rawData,
        threats
      });
      setError('Unsafe content detected. Please check your inputs.');
      return;
    }

    const sanitizedData: Record<string, any> = {};
    Object.entries(rawData).forEach(([k, v]) => {
      sanitizedData[k] = typeof v === 'string' ? sanitizeInput(v) : v;
    });

    onSubmit(sanitizedData);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {error && (
        <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}
      {children}
    </form>
  );
};
