'use client';

import { useAuthStore } from '@/store/authStore';

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      Welcome to the dashboard, {user?.name}!
    </div>
  );
}
