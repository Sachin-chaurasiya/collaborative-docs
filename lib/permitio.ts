import { Permit } from 'permitio';

export const PERMITIO_CLIENT = new Permit({
  token: process.env.NEXT_PUBLIC_PERMIT_API_KEY!,
  pdp: 'http://localhost:7766',
});
