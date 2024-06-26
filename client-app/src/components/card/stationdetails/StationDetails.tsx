import React, { useState, useRef, useEffect, createRef } from 'react';

type Station = {
  Station: string;
  Spoor: string;
  details?: string;
  Tijd?: string;
  hasIntermediateStations?: boolean;
  stapType: string;
  tijd: string;
};

type StationDetailsProps = {
  vertrekTijd: string;
  aankomstTijd: string;
  stations: Station[];
  showIntermediateStations: boolean;
  toggleIntermediateStations: (segmentId: number) => void;
  segmentId: number;
  trainType: string;
  destination: string;
  departure: string;
};

const StationDetails: React.FC<StationDetailsProps> = ({
                                                         stations,
                                                         showIntermediateStations,
                                                         toggleIntermediateStations,
                                                         segmentId,
                                                         trainType,
                                                         destination,
                                                         departure,
                                                       }) => {
  // Refs to keep track of the station elements
  const stationRefs = useRef(stations.map(() => createRef<HTMLLIElement>()));
  // State to store the top offset values of station elements
  const [stationTimesTop, setStationTimesTop] = useState<number[]>([]);

  // Update the top offset values when stations or the visibility of intermediate stations changes
  useEffect(() => {
    setStationTimesTop(
        stationRefs.current.map((ref) => ref.current?.offsetTop ?? 0)
    );
  }, [stations, showIntermediateStations]);

  // Determine which stations to display based on whether intermediate stations should be shown
  const displayedStations = showIntermediateStations
      ? stations
      : [stations[0], stations[stations.length - 1]];

  return (
      <ol className="relative pl-[100px]">
        <div className="absolute left-[85.1px] top-[20px] w-0.5 bg-gray-950 bottom-[25px]"></div>
        <div className="absolute left-0">
          {displayedStations.map((station, index, array) => {
            // Calculate the middle position between two stations
            const middlePosition =
                index < array.length - 1
                    ? `calc((${stationTimesTop[index]}px + ${
                        stationTimesTop[index + 1]
                    }px) / 2)`
                    : null;

            // Left side of the station details
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
                {station.Tijd}
              </span>
                  {/* Only render the text for all but the last station */}
                  {index < array.length - 1 && middlePosition && (
                      <span
                          className="text-xs font-roboto-light text-red-950"
                          style={{
                            position: 'absolute',
                            top: middlePosition,
                            left: '20px',
                            transform: 'translateY(50%)',
                          }}
                      >
                  {/* Placeholder for additional information */}
                </span>
                  )}
                </React.Fragment>
            );
          })}
        </div>

        {displayedStations.map((station, index) => (
            <li
                ref={stationRefs.current[index]}
                key={`${segmentId}-${index}`}
                className={`relative ${index !== 0 ? 'mt-4' : 'mt-2'}`}
            >
              <div
                  className={`absolute w-3 h-3 bg-red-950 rounded-full -left-5 mt-2.5`}
              ></div>
              <div className="flex justify-between items-center pt-1">
                <div>
                  <p className="text-base font-semibold text-gray-900">
                    {station.Station}
                  </p>
                  {/* Change display based on index */}
                  <p className="text-xs text-gray-500">
                    {index === 0
                        ? 'Vertrek' // Departure
                        : index === displayedStations.length - 1
                            ? 'Aankomst' // Arrival
                            : ''}
                  </p>
                </div>
                <div className="text-xs">Spoor {station.Spoor}</div>
              </div>
              {index === 0 && (
                  <>
                    <hr className="border-t border-gray-300 my-4" />
                    <div className="flex justify-between items-center">
                      {/* Train info */}
                      <div>
                        <p className="text-xs font-roboto-light text-gray-500">
                          {trainType}
                        </p>
                        <p className="text-xs font-roboto-light text-gray-500">
                          Richting {destination}
                        </p>
                        <p className="text-xs font-roboto-light text-gray-500">
                          {departure}
                        </p>
                      </div>
                      {/* Toggle button for intermediate stations */}
                      <div
                          className="text-red-600 mt-4 cursor-pointer flex justify-end items-center"
                          onClick={() => toggleIntermediateStations(segmentId)}
                      >
                        <img
                            src="/assets/arrow_down.svg"
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
  );
};

export default StationDetails;
