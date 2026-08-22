'use client';

import { createClient } from '@/utils/supabase/client';
import Button from '@/components/ui/Button';

export function Logout() {
  const sb = createClient();

  const handle = async () => {
    try {
      await sb.auth.signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  return (
    <Button onClick={handle} variant="secondary" size="sm">
      Logout
    </Button>
  );
}
