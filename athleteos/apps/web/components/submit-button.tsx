'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function SubmitButton({ children = 'Salvar Alterações' }: { children?: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="bg-emerald-600 hover:bg-emerald-500 text-white border-0 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
    >
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
