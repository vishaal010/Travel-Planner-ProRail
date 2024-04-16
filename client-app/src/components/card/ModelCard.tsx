import { useEffect, useRef, useState } from 'react'
import TrainBlock from './trainblock/TrainBlock'
import StationDetails from './stationdetails/StationDetails'
import { ReisAdvies } from '../../types'
import TooltipComponent from './../tooltip/tooltip'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ModelCardProps {
  reisAdvies: ReisAdvies
  showDetails: boolean
  onToggleShowDetails: () => void
}

const ModelCard: React.FC<ModelCardProps> = ({
  reisAdvies,
  showDetails,
  onToggleShowDetails,
}) => {
  const maxDuration = Math.max(
    ...reisAdvies.segmenten.map((segment) => segment.segmentDuur)
  )
  const [isLoading, setIsLoading] = useState(true)
  const [intermediateVisibility, setIntermediateVisibility] = useState({})
  const detailsRef = useRef(null) // Add this line to create a ref for the details div

  const variants = {
    open: { opacity: 1, height: 'auto' },
    collapsed: { opacity: 0, height: 0 },
  }

  useEffect(() => {
    const initialVisibility = reisAdvies.segmenten.reduce((acc, segment) => {
      acc[segment.segmentId] = false
      return acc
    }, {})
    setIntermediateVisibility(initialVisibility)
  }, [reisAdvies.segmenten])

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

  const processStations = (stappen) => {
    return stappen.reduce((acc, currentStap) => {
      const lastStap = acc[acc.length - 1]
      if (lastStap && lastStap.stationNaam === currentStap.stationNaam) {
        if (currentStap.stapType === 'Aankomst') {
          acc[acc.length - 1] = currentStap
        }
      } else {
        acc.push(currentStap)
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
        <span>{reisAdvies.reisDuur}m</span> {/* Updated to travelDuration */}
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
          {reisAdvies.segmenten.map((segment, index) => (
            <TrainBlock
              key={index}
              train={segment.treinType}
              duration={segment.segmentDuur}
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
              <p className="tracking-wide">{reisAdvies.frequentie}/u</p>
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
              {reisAdvies.segmenten.length - 1 > 0
                ? `${reisAdvies.segmenten.length - 1} Overstap(pen)`
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
              <p className="tracking-wide">{reisAdvies.uurPatroon}</p>
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
        <div
          className="details-content"
          ref={detailsRef}
          style={{
            overflow: 'hidden',
            transition: 'max-height 0.5s ease-in-out',
          }}
        >
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={variants}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <hr className="my-2 border-gray-200" />

                {reisAdvies.segmenten.map(
                  (segment, segmentIndex, segmentArray) => {
                    const isLastSegment =
                      segmentIndex === segmentArray.length - 1

                    const uniqueStations = processStations(segment.stappen)

                    return (
                      <React.Fragment key={segment.segmentId}>
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
                              className="px-2 bg-white text-xs font-light text-gray-500"
                              style={{
                                marginLeft: '-16px',
                                lineHeight: '12px',
                              }}
                            >
                              5min
                            </span>
                            <div className="flex-grow border-t border-red-950 border-dotted"></div>
                          </div>
                        )}
                        <StationDetails
                          departureTime={segment.stappen[0].tijd}
                          arrivalTime={
                            segment.stappen[segment.stappen.length - 1].tijd
                          }
                          stations={uniqueStations}
                          showIntermediateStations={
                            intermediateVisibility[segment.segmentId]
                          }
                          toggleIntermediateStations={() =>
                            toggleIntermediateVisibility(segment.segmentId)
                          }
                          segmentId={segment.segmentId}
                        />
                      </React.Fragment>
                    )
                  }
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default ModelCard
