'use client';

import { useAuthStore } from '@/store/authStore';
import { LoaderIcon } from 'lucide-react';
import { redirect, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <section className="h-screen flex justify-center items-center">
        <LoaderIcon className="w-8 h-8 animate-spin" />
      </section>
    );
  }

  if (!user && pathname.startsWith('/dashboard')) {
    redirect('/login');
  }

  return children;
}
