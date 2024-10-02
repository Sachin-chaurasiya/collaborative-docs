import { Client, Account, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '') // Your API Endpoint
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || ''); // Your project ID;

export const account = new Account(client);
export const databases = new Databases(client);

export const APPWRITE_CLIENT = {
  account,
  databases,
};
