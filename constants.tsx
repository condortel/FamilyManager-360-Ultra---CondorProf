
import { FamilyMember, UserProfile } from './types';

export const FAMILY_PROFILES: Record<FamilyMember, UserProfile> = {
  [FamilyMember.PAPA]: {
    id: 'papa',
    name: FamilyMember.PAPA,
    color: '#1E3A8A',
    profile: 'Pratico, focalizzato su lavoro/finanza, report sintetici.'
  },
  [FamilyMember.MAMMA]: {
    id: 'mamma',
    name: FamilyMember.MAMMA,
    color: '#7C3AED',
    profile: 'Empatica, attenta a salute/relazioni, consigli emotivi.'
  },
  [FamilyMember.FIGLIO_GRANDE]: {
    id: 'figlio_grande',
    name: FamilyMember.FIGLIO_GRANDE,
    color: '#166534',
    profile: 'Adolescente, gamification, promemoria scolastici.'
  },
  [FamilyMember.FIGLIA]: {
    id: 'figlia',
    name: FamilyMember.FIGLIA,
    color: '#DB2777',
    profile: 'Bambina, tono giocoso, hobby/creatività.'
  },
  [FamilyMember.NONNI]: {
    id: 'nonni',
    name: FamilyMember.NONNI,
    color: '#92400E',
    profile: 'Anziani, promemoria salute, linguaggio semplice.'
  },
  [FamilyMember.TUTTI]: {
    id: 'tutti',
    name: FamilyMember.TUTTI,
    color: '#374151',
    profile: 'Eventi collettivi.'
  },
  [FamilyMember.OSPITI]: {
    id: 'ospiti',
    name: FamilyMember.OSPITI,
    color: '#EA580C',
    profile: 'Temporanei, privacy extra.'
  }
};

export const CATEGORIES = {
  INCOME: ['Lavoro', 'Extra', 'Regali Ricevuti', 'Vendite'],
  EXPENSE: [
    'Alimentari', 'Bollette', 'Trasporti', 'Salute', 'Scuola', 
    'Abbigliamento', 'Svago', 'Vacanze', 'Regali', 'Animali', 
    'Casa', 'Abbonamenti', 'Igiene', 'Sport', 'Tecnologia', 
    'Assicurazioni', 'Tasse', 'Donazioni', 'Eco'
  ]
};
