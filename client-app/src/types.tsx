// Enum for the type of step in the travel plan, either arrival or departure
export enum StapType {
  Aankomst = 'Aankomst',  // Arrival
  Vertrek = 'Vertrek',    // Departure
}

// Interface representing a step in the travel plan
export interface Stappen {
  stapType: StapType;    // Type of step (arrival or departure)
  Station: string;       // Station name
  Tijd?: string;         // Time (optional)
  Spoor: string;         // Track number
  Overstaptijd: string;  // Transfer time
  Wandeltijd: string;    // Walking time
}

// Interface representing a segment of the journey
export interface Segment {
  SegmentId: string;        // Unique identifier for the segment
  SegmentDuur: number;      // Duration of the segment
  TreinType: string;        // Type of train
  treinId: string;          // Train identifier
  serieNaam: string;        // Series name
  Bestemming: string;       // Destination name
  bestemmingAfkorting: string; // Destination abbreviation
  Stappen: Stappen[];       // Array of steps in the segment
}

// Interface representing travel advice
export interface ReisAdviezen {
  ReisDuur: number;           // Duration of the journey
  UurPatroon: string;         // Hourly pattern
  Frequentie: number;         // Frequency
  AantalOverstappen: number;  // Number of transfers
  reisadviesId: string;       // Unique identifier for the travel advice
  segmenten: Segment[];       // Array of segments in the travel advice
}

// Interface representing the model data
export interface ModelData {
  ModelId: string;            // Unique identifier for the model
  ModelNaam: string;          // Name of the model
  Data: ReisAdviezen[];       // Array of travel advices
}
