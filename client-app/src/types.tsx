export enum StapType {
  Aankomst = 'Aankomst',
  Vertrek = 'Vertrek',
}

export interface Stappen {
  stapType: StapType;
  Station: string;
  Tijd?: string; 
  Spoor: string;
  Overstaptijd:string;
}

export interface Segment {
  SegmentId: string;
  SegmentDuur: number;
  TreinType: string;
  treinId: string;
  serieNaam: string;
  Bestemming: string; 
  bestemmingAfkorting: string; 
  Stappen: Stappen[];
}

export interface ReisAdviezen {
  ReisDuur: number;
  UurPatroon: string;
  Frequentie: number;
  AantalOverstappen: number;
  reisadviesId: string; 
  segmenten: Segment[];
}

export interface ModelData {
  ModelId: string;
  ModelNaam: string;
  Data: ReisAdviezen[];
}
