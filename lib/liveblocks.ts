import { Liveblocks } from '@liveblocks/node';

export const LIVEBLOCKS_CLIENT = new Liveblocks({
  secret: process.env.NEXT_PUBLIC_LIVE_BLOCKS_SECRET_KEY!,
});
