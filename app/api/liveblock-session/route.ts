import { LIVEBLOCKS_CLIENT } from '@/lib/liveblocks';
import { NextRequest } from 'next/server';

function generateRandomHexColor() {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor.padStart(6, '0')}`;
}

export async function POST(request: NextRequest) {
  const { user, roomId, permissions } = await request.json();

  const allowedPermission: ('room:read' | 'room:write')[] = [];

  const session = LIVEBLOCKS_CLIENT.prepareSession(user.$id, {
    userInfo: {
      name: user.name,
      color: generateRandomHexColor(),
    },
  });

  if (permissions.read) {
    allowedPermission.push('room:read');
  }

  if (permissions.update) {
    allowedPermission.push('room:write');
  }

  session.allow(roomId!, allowedPermission);

  const { body, status } = await session.authorize();
  return new Response(body, { status });
}
