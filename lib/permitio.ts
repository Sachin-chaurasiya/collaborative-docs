import { Permit } from 'permitio';

const pdpUrl = process.env.PDP_URL || 'http://localhost:7766';
const apiKey = process.env.NEXT_PUBLIC_PERMIT_API_KEY!;

export const PERMITIO_SDK = new Permit({
  token: apiKey,
  pdp: pdpUrl,
});
