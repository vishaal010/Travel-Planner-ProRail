import { useEffect, useState } from 'react'
import TrainBlock from './trainblock/TrainBlock'
import StationDetails from './stationdetails/StationDetails'
import { TravelAdvice } from '../../types'
import TooltipComponent from './../tooltip/tooltip'
import React from 'react'

interface ModelCardProps {
  travelAdvice: TravelAdvice
  showDetails: boolean
  onToggleShowDetails: () => void
}

const ModelCard: React.FC<ModelCardProps> = ({
  travelAdvice,
  showDetails,
  onToggleShowDetails,
}) => {
  // Combine the main train and the transfers into a single array
  const maxDuration = Math.max(
    ...travelAdvice.segments.map((segment) => segment.duration)
  )
  const [isLoading, setIsLoading] = useState(true)
  const [intermediateVisibility, setIntermediateVisibility] = useState({})

  // Initialize the intermediate visibility state based on the segments
  useEffect(() => {
    const initialVisibility = travelAdvice.segments.reduce((acc, segment) => {
      acc[segment.segment_id] = false // Start with all intermediate stations hidden
      return acc
    }, {})
    setIntermediateVisibility(initialVisibility)
  }, [travelAdvice.segments])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  const toggleIntermediateVisibility = (segmentId) => {
    setIntermediateVisibility((prevState) => ({
      ...prevState,
      [segmentId]: !prevState[segmentId],
    }))
  }

  const processStations = (steps) => {
    return steps.reduce((acc, currentStep) => {
      const lastStep = acc[acc.length - 1]
      if (lastStep && lastStep.stationName === currentStep.stationName) {
        if (currentStep.stepType === 'Arrival') {
          acc[acc.length - 1] = currentStep
        }
      } else {
        acc.push(currentStep)
      }
      return acc
    }, [])
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="mb-2">
        <div className="skeleton h-32 w-full"></div>
      </div>
    )
  }

  return (
    <div className="shadow-lg rounded-lg overflow-hidden border border-black bg-white mb-2">
      <div className="text-black p-2 flex justify-center items-center">
        <img src="/assets/clock.svg" className="w-4 h-6 mr-2" alt="Logo" />
        <span>{travelAdvice.travelDuration}m</span>{' '}
        {/* Updated to travelDuration */}
        <TooltipComponent message="Reistijd!" position="right">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="w-4 h-4 text-red-850 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </TooltipComponent>
      </div>

      <div className="p-4">
        <div className="flex space-x-2 items-center">
          {travelAdvice.segments.map((segment, index) => (
            <TrainBlock
              key={index}
              train={segment.trainType}
              duration={segment.duration}
              maxDuration={maxDuration}
            />
          ))}
        </div>

        <hr className="my-2 border-gray-200" />

        <div className="mt-2">
          <ul className="list-none m-0 p-0">
            <li className="text-black flex items-center mb-1">
              <img
                src="/assets/train.svg"
                className="w-6 h-4 mr-2"
                alt="Train frequency"
              />
              <p className="tracking-wide">{travelAdvice.frequency}/u</p>
              <TooltipComponent
                message="Aantal treinen per uur!"
                position="top"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-red-850 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </TooltipComponent>
            </li>
            <li className="text-black flex items-center mb-1">
              <img
                src="/assets/transfer.svg"
                className="w-6 h-5 mr-2"
                alt="Transfer Icon"
              />
              {travelAdvice.segments.length - 1 > 0
                ? `${travelAdvice.segments.length - 1} Overstap(pen)`
                : 'Directe verbinding'}
              <TooltipComponent message="Aantal Overstappen" position="top">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-red-850 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </TooltipComponent>
            </li>
            <li className="text-black flex items-center">
              <img
                src="/assets/hour_division.svg"
                className="w-6 h-4 mr-2"
                alt="Hour Division Icon"
              />
              <p className="tracking-wide">{travelAdvice.timePattern}</p>
              <TooltipComponent message="Uurverdeling" position="right">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-red-850 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </TooltipComponent>
            </li>
          </ul>
        </div>
        <div
          className="text-red-950 mt-4 cursor-pointer flex justify-end items-center"
          onClick={onToggleShowDetails}
        >
          <span className="tracking-wide">Details</span>
          <img
            src="/assets/arrow_up.svg"
            alt="Toggle Details"
            className={`ml-2 transition-transform duration-500 ${
              showDetails ? 'rotate-180' : ''
            }`}
            style={{ width: '16px', height: '16px' }}
          />
        </div>
        {showDetails && (
          <>
            <hr className="my-2 border-gray-200" />

            {travelAdvice.segments.map(
              (segment, segmentIndex, segmentArray) => {
                const isLastSegment = segmentIndex === segmentArray.length - 1

                const uniqueStations = processStations(segment.steps)

                return (
                  <React.Fragment key={segment.segment_id}>
                    {segmentIndex !== 0 && (
                      <div className="relative my-4 flex items-center justify-center">
                        <div className="flex-grow border-t border-red-950 border-dotted"></div>
                        <img
                          src="/assets/man_walking.svg"
                          alt="Icon"
                          className="mx-2"
                          style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: 'white',
                          }}
                        />
                        <span
                          className="px-2 bg-white text-xs font-light text-gray-500" // adjust the styling as needed
                          style={{
                            marginLeft: '-16px', // Adjust this value to move text closer to the icon
                            lineHeight: '12px', // to vertically center text with the icon
                          }}
                        >
                          {/* Your text here */}
                          5min
                        </span>
                        <div className="flex-grow border-t border-red-950 border-dotted"></div>
                      </div>
                    )}

                    <StationDetails
                      departureTime={
                        uniqueStations.find(
                          (step) => step.stepType === 'Departure'
                        )?.time || ''
                      }
                      arrivalTime={
                        uniqueStations.find(
                          (step) => step.stepType === 'Arrival'
                        )?.time || ''
                      }
                      stations={uniqueStations}
                      showIntermediateStations={
                        intermediateVisibility[segment.segment_id]
                      }
                      toggleIntermediateStations={() =>
                        toggleIntermediateVisibility(segment.segment_id)
                      }
                      segmentId={segment.segment_id}
                    />
                  </React.Fragment>
                )
              }
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ModelCard
