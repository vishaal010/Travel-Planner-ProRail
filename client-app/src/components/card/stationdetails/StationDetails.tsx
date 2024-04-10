import React, { useState, useRef, useEffect, createRef } from 'react'

type Station = {
  stationName: string
  track: string
  details?: string
  travelTime?: string
  hasIntermediateStations?: boolean
  stepType: string
  time: string
}

type StationDetailsProps = {
  departureTime: string
  arrivalTime: string
  stations: Station[]
  showIntermediateStations: boolean
  toggleIntermediateStations: (segmentId: number) => void
  segmentId: number
}

const StationDetails: React.FC<StationDetailsProps> = ({
  departureTime,
  arrivalTime,
  stations,
  showIntermediateStations,
  toggleIntermediateStations,
  segmentId,
}) => {
  const stationRefs = useRef(stations.map(() => createRef<HTMLLIElement>()))
  const [stationTimesTop, setStationTimesTop] = useState<number[]>([])

  useEffect(() => {
    setStationTimesTop(
      stationRefs.current.map((ref) => ref.current?.offsetTop ?? 0)
    )
  }, [stations, showIntermediateStations])

  const displayedStations = showIntermediateStations
    ? stations
    : [stations[0], stations[stations.length - 1]]

  return (
    // <ol className="relative pl-28">
    // <div className="absolute left-[96.9px] top-[20px] w-0.5 bg-gray-950 bottom-[25px]"></div>
    <ol className="relative pl-[100px]">
      <div className="absolute left-[85.1px] top-[20px] w-0.5 bg-gray-950 bottom-[25px]"></div>
      <div className="absolute left-0">
        {displayedStations.map((station, index, array) => {
          // Calculate the position for the text to be placed in the middle between the times
          const middlePosition =
            index < array.length - 1
              ? `calc((${stationTimesTop[index]}px + ${
                  stationTimesTop[index + 1]
                }px) / 2)`
              : null

          return (
            <React.Fragment key={index}>
              <span
                className="text-xs font-roboto-light text-gray-500"
                style={{
                  position: 'absolute',
                  top: `calc(${stationTimesTop[index]}px + 8px)`,
                  left: '0',
                }}
              >
                {station.time}
              </span>
              {/* Only render the text for all but the last station */}
              {index < array.length - 1 && (
                <span
                  className="text-xs font-roboto-light text-red-950"
                  style={{
                    position: 'absolute',
                    top: middlePosition,
                    left: '20px',
                    transform: 'translateY(50%)', // Center vertically
                  }}
                >
                  {/* Replace 'In-Between' with your actual text */}
                  10+
                </span>
              )}
            </React.Fragment>
          )
        })}
      </div>
      {displayedStations.map((station, index) => (
        <li
          ref={stationRefs.current[index]}
          key={`${segmentId}-${index}`}
          className={`relative ${index !== 0 ? 'mt-4' : 'mt-2'}`}
        >
          {' '}
          <div
            className={`absolute w-3 h-3 bg-red-950 rounded-full -left-5 mt-2.5`}
          ></div>
          <div className="flex justify-between items-center pt-1">
            <div>
              <p className="text-base font-semibold text-gray-900">
                {station.stationName}
              </p>
              <p className=" text-xs text-gray-500">{station.stepType}</p>
            </div>
            <div className="text-xs">Spoor {station.track}</div>
          </div>
          {index === 0 && (
            <>
              <hr className="border-t border-gray-300 my-4" />
              <div className="flex justify-between items-center">
                {/* Train info */}
                <div>
                  <p className="text-xs font-roboto-light text-gray-500">
                    NS Sprinter
                  </p>
                  <p className="text-xs font-roboto-light text-gray-500">
                    Richting Dordrecht
                  </p>
                  <p className="text-xs font-roboto-light text-gray-500">
                    Vertrek
                  </p>
                </div>
                <div
                  className="text-red-600 mt-4 cursor-pointer flex justify-end items-center"
                  onClick={toggleIntermediateStations}
                >
                  <img
                    src="/assets/arrow_up.svg"
                    alt="Toggle Details"
                    className={`ml-2 transition-transform duration-500 ${
                      showIntermediateStations ? 'rotate-180' : ''
                    }`}
                    style={{ width: '16px', height: '16px' }}
                  />
                </div>
              </div>
              <hr className="border-t border-gray-300 my-4" />
            </>
          )}
        </li>
      ))}
    </ol>
  )
}
export default StationDetails
