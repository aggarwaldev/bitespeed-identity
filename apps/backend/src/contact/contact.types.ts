import { LinkPrecedence } from './constants';

export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export interface ContactLink {
  linkedId?: number;
  linkPrecedence: LinkPrecedence;
}

export interface ContactResponse {
  contact: {
    primaryContatctId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
  };
}
