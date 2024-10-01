import { Permit } from 'permitio';

export const PERMITIO_CLIENT = new Permit({
  token: process.env.PERMIT_API_KEY!,
  pdp: 'http://localhost:7766',
});
