export enum StapType {
  Aankomst = 'Aankomst',
  Vertrek = 'Vertrek',
}

export interface Stappen {
  stapType: StapType;
  Station: string;
  Tijd?: string; // Optional for intermediate stops
  Spoor: string;
}

export interface Segment {
  SegmentId: string;
  SegmentDuur: number;
  TreinType: string;
  treinId: string;
  serieNaam: string;
  Bestemming: string; // Assuming this is a property based on your JSON
  bestemmingAfkorting: string; // Assuming this is a property based on your JSON
  Stappen: Stappen[];
}

export interface ReisAdviezen {
  ReisDuur: number;
  UurPatroon: string;
  Frequentie: number;
  AantalOverstappen: number;
  reisadviesId: string; // Make sure the ID field name matches your JSON
  segmenten: Segment[];
}

export interface ModelData {
  ModelId: string;
  ModelNaam: string;
  Data: ReisAdviezen[]; // This should match the key in your JSON that contains the array of ReisAdvies
}
