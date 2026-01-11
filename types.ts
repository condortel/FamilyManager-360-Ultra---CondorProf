
export enum FamilyMember {
  PAPA = 'Papà',
  MAMMA = 'Mamma',
  FIGLIO_GRANDE = 'Figlio grande',
  FIGLIA = 'Figlia',
  NONNI = 'Nonni',
  TUTTI = 'Tutti',
  OSPITI = 'Ospiti'
}

export interface UserProfile {
  id: string;
  name: FamilyMember;
  color: string;
  profile: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  subcategory?: string;
  payer: FamilyMember;
  description: string;
  type: 'INCOME' | 'EXPENSE';
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  participants: FamilyMember[];
  weatherForecast?: string;
}

export interface SmartNote {
  id: string;
  title: string;
  content: string;
  category: string;
  lastModified: string;
  linkedTransactionId?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
