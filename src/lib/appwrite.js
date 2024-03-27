// 6600317cbe6290ab06ae
import { Client, Account, Databases, Storage } from 'appwrite';

export const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('6600317cbe6290ab06ae')


export const storage = new Storage(client);
export const databases = new Databases(client);
export const account = new Account(client);
export { ID }  from 'appwrite';