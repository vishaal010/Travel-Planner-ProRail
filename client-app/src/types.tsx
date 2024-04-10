export interface Step {
  stepType: string
  stationName: string
  time?: string // For intermediate stops
  track: string
}

export interface Segment {
  segment_id: number // Make sure to use camelCase for consistency, segmentId is preferred
  duration: number
  trainType: string
  trainId: string
  seriesName: string
  steps: Step[]
}

export interface TravelAdvice {
  adviceId: number // Add adviceId here if it's unique per TravelAdvice
  travelDuration: number
  timePattern: string
  frequency: number
  numberOfTransfers: number
  segments: Segment[]
}

export interface ModelWithTravelAdvices {
  modelId: number // Identifier for the model
  travelAdvices: TravelAdvice[]
}
