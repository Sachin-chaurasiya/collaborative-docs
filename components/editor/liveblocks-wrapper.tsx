'use client';

import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from '@liveblocks/react/suspense';
import Loader from '../loader';
import { PermissionType } from '@/app/actions';
import { useAuthStore } from '@/store/authStore';

interface LiveblocksWrapperProps {
  children: React.ReactNode;
  roomId: string;
  permissions: Record<PermissionType, boolean>;
}

export default function LiveblocksWrapper({
  children,
  roomId,
  permissions,
}: Readonly<LiveblocksWrapperProps>) {
  const { user } = useAuthStore();

  return (
    <LiveblocksProvider
      authEndpoint={async (room) => {
        const response = await fetch('/api/liveblock-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: user,
            roomId: roomId,
            room,
            permissions,
          }),
        });

        return await response.json();
      }}
    >
      <RoomProvider
        id={roomId}
        initialPresence={{
          cursor: null,
        }}
      >
        <ClientSideSuspense fallback={<Loader />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
