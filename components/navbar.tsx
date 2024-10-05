'use client';

import { useAuthStore } from '@/store/authStore';
import { FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b shadow-md">
      <Link className="flex items-center justify-center" href="/">
        <FileText className="h-6 w-6 mr-2" />
        <span className="font-bold">CollabDocs</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        {user ? (
          <div className="flex gap-4 items-center">
            <span>
              {user.name} ({user.email})
            </span>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        ) : (
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/#features"
          >
            Features
          </Link>
        )}
      </nav>
    </header>
  );
}
