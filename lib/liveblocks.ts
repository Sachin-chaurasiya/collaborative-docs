import { Liveblocks } from '@liveblocks/node';

export const LIVEBLOCKS_CLIENT = new Liveblocks({
  secret: process.env.LIVE_BLOCKS_SECRET_KEY!,
});
