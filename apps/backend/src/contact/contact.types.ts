import { LinkPrecedence } from './constants';
import type { Contact } from './contact.entity';

export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export interface ContactLink {
  linkedId?: Contact;
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
