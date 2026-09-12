import Dexie, { type EntityTable } from 'dexie';

/**
 * Dexie (IndexedDB) schema — easy rise (ইজি রাইজ).
 * Client-side storage for the UI phase.
 * Backend phase will replace most of this with server-side data.
 */

export interface Client {
  id?: number;
  name: string;
  source: string;
  marketplace: string;
  createdAt: string;
}

export interface Job {
  id?: number;
  clientId: number;
  title: string;
  status: 'prospect' | 'applied' | 'active' | 'delivered' | 'awaiting_payment' | 'closed';
  deadline: string;
  agreedPaisa: number;
  currency: string;
  concepts: number;
  revisions: number;
  createdAt: string;
}

export interface ScopeItem {
  id?: number;
  jobId: number;
  date: string;
  description: string;
  hours: number;
  createdAt: string;
}

export interface Proposal {
  id?: number;
  jobId: number;
  sentAt: string;
  marketplace: string;
  jobType: string;
  quotedPaisa: number;
  outcome: 'sent' | 'replied' | 'won' | 'lost';
}

export interface IncomeEntry {
  id?: number;
  jobId: number;
  date: string;
  currency: string;
  amountPaisa: number;
  rate: number;
  channel: string;
  createdAt: string;
}

export interface Document {
  id?: number;
  purpose: string;
  name: string;
  status: 'missing' | 'expired' | 'valid';
  expiryDate: string;
  note: string;
  createdAt: string;
}

export interface Niche {
  id?: number;
  name: string;
  profilesFound: number;
  jobsPosted7d: number;
  rateMin: number;
  rateMax: number;
  skill: number;
  score: number;
  band: string;
  createdAt: string;
}

export interface ChecklistItem {
  itemId: string;
  done: boolean;
  updatedAt: string;
}

export interface Plan {
  id?: number;
  niche: string;
  hours: number;
  experience: string;
  english: string;
  deadline: string;
  createdAt: string;
}

export interface Review {
  id?: number;
  headline: string;
  overview: string;
  samples: string;
  result: string;
  createdAt: string;
}

export interface Setting {
  key: string;
  value: string;
}

export interface ReminderLog {
  id?: number;
  jobId: number;
  step: string;
  sentAt: string;
}

const db = new Dexie('easy-rise') as Dexie & {
  clients: EntityTable<Client, 'id'>;
  jobs: EntityTable<Job, 'id'>;
  scopeItems: EntityTable<ScopeItem, 'id'>;
  proposals: EntityTable<Proposal, 'id'>;
  income: EntityTable<IncomeEntry, 'id'>;
  documents: EntityTable<Document, 'id'>;
  niches: EntityTable<Niche, 'id'>;
  checklist: EntityTable<ChecklistItem, 'itemId'>;
  plans: EntityTable<Plan, 'id'>;
  reviews: EntityTable<Review, 'id'>;
  settings: EntityTable<Setting, 'key'>;
  reminderLog: EntityTable<ReminderLog, 'id'>;
};

db.version(1).stores({
  clients: '++id, name, source, marketplace, createdAt',
  jobs: '++id, clientId, status, deadline, agreedPaisa, currency, createdAt',
  scopeItems: '++id, jobId, date, description, hours, createdAt',
  proposals: '++id, jobId, sentAt, marketplace, jobType, quotedPaisa, outcome',
  income: '++id, jobId, date, currency, amountPaisa, rate, channel, createdAt',
  documents: '++id, purpose, name, status, expiryDate, note, createdAt',
  niches: '++id, name, profilesFound, jobsPosted7d, rateMin, rateMax, skill, score, band, createdAt',
  checklist: 'itemId, done, updatedAt',
  plans: '++id, niche, hours, experience, english, deadline, createdAt',
  reviews: '++id, headline, overview, samples, result, createdAt',
  settings: 'key, value',
  reminderLog: '++id, jobId, step, sentAt',
});

export { db };
export type DB = typeof db;
