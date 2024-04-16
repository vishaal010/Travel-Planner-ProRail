export enum StapType {
  Aankomst = 'Aankomst',
  Vertrek = 'Vertrek',
}

export interface Stap {
  stapType: StapType;
  stationNaam: string;
  tijd?: string; // Voor tussenstops
  spoor: string;
}

export interface Segment {
  segmentId: number; // Gebruik camelCase voor consistentie, segmentId wordt aanbevolen
  segmentDuur: number;
  treinType: string;
  treinId: string;
  serieNaam: string;
  stappen: Stap[];
}

export interface ReisAdvies {
  adviesId: number; // Voeg adviesId hier toe als het uniek is voor ReisAdvies
  reisDuur: number;
  uurPatroon: string;
  frequentie: number;
  aantalOverstappen: number;
  segmenten: Segment[];
}

export interface ModelMetReisAdviezen {
  modelNaam: string;
  modelId: number; // Identifier voor het model
  reisAdviezen: ReisAdvies[];
}
