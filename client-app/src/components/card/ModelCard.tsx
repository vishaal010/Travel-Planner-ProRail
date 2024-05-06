import { useEffect, useRef, useState } from 'react';
import TrainBlock from './trainblock/TrainBlock';
import StationDetails from './stationdetails/StationDetails';
import { ReisAdvies } from '../../types'; // Ensure you have this type defined
import TooltipComponent from './../tooltip/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

interface ModelCardProps {
  reisAdvies: ReisAdvies;
  showDetails: boolean;
  onToggleShowDetails: () => void;
}

const ModelCard: React.FC<ModelCardProps> = ({
                                               reisAdvies,
                                               showDetails,
                                               onToggleShowDetails,
                                             }) => {
  const seenDurations = new Set();
  const [isLoading, setIsLoading] = useState(true);
  const [intermediateVisibility, setIntermediateVisibility] = useState({});
  const detailsRef = useRef(null);
  let trainBlocks = [];
  // Log to check the structure of reisAdvies.segmenten
  useEffect(() => {
    if (!reisAdvies || !Array.isArray(reisAdvies.Reisadviezen)) {
      console.error("Reisadviezen data is missing or invalid");
      return;
    }

    // Iterate over Reisadviezen and then access Segmenten
    const initialVisibility = reisAdvies.Reisadviezen.reduce((acc, reisadviesItem) => {
      if (Array.isArray(reisadviesItem.Segmenten)) {
        reisadviesItem.Segmenten.forEach(segment => {
          acc[segment.StappenId] = false;
        });
      }
      return acc;
    }, {});

    setIntermediateVisibility(initialVisibility);
  }, [reisAdvies.Reisadviezen]);

  const maxSegmentDuur = Math.max(
      ...reisAdvies.Reisadviezen.flatMap(reisadvies =>
          reisadvies.Segmenten.map(segment => segment.SegmentDuur)
      )
  );

  console.log(maxSegmentDuur); // This will print the maximum segment duration to the console.

  
  

  // Function to toggle the visibility of intermediate stations
  const toggleIntermediateVisibility = (StappenId) => {
    setIntermediateVisibility((prevState) => ({
      ...prevState,
      [StappenId]: !prevState[StappenId],
    }));
  };
  //
  // Function to process station step details
  const processStations = (stappen) => {
    return stappen.reduce((acc, currentStap) => {
      const lastStap = acc[acc.length - 1];
      if (lastStap && lastStap.Station === currentStap.Station) {
        if (currentStap.StapType === 0) { // Assuming '0' is for 'Aankomst'
          acc[acc.length - 1] = currentStap;
        }
      } else {
        acc.push(currentStap);
      }
      return acc;
    }, []);
  };

  if (reisAdvies.Reisadviezen.length > 0) {
    const firstReisadvies = reisAdvies.Reisadviezen[0]; 
    firstReisadvies.Segmenten.forEach(segment => {
      const processedStations = processStations(segment.Stappen);
      console.log(processedStations); 
      segment.Stappen = processedStations;
    });

  }


  for (let reisadvies of reisAdvies.Reisadviezen) {
    for (let segment of reisadvies.Segmenten) {
      // Check if we have already rendered a TrainBlock for this duration
      if (!seenDurations.has(segment.SegmentDuur)) {
        seenDurations.add(segment.SegmentDuur); // Mark this duration as seen
        trainBlocks.push(
            <TrainBlock
                key={segment.SegmentId}
                train={segment.TreinType}
                SerieNaam={segment.SerieNaam}
                duration={segment.SegmentDuur}
                maxDuration={Math.max(maxSegmentDuur)}
            />
        );
      }
    }
  }
  //
  // if (isLoading) { // Skeleton loading when fetching data
  //   return (
  //       <div className="mb-2">
  //         <div className="skeleton h-32 w-full"></div>
  //       </div>
  //   );
  // }


  return (
    <div className="shadow-lg rounded-lg overflow-hidden border border-black bg-white mb-2">
      <div className="text-black p-2 flex justify-center items-center">
        <img src="/assets/clock.svg" className="w-4 h-6 mr-2" alt="Logo" />
            <span>{reisAdvies.ReisDuur}min</span> {/* Updated to travelDuration */}
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
          {trainBlocks}
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
              <p className="tracking-wide">{reisAdvies.Frequentie}/u</p>
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
              {reisAdvies.AantalOverstappen - 1} x
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
              <p className="tracking-wide">{reisAdvies.UurPatroon}</p>
              <TooltipComponent message="Minuut van het uur wanneer er een trein aankomt" position="right">
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
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                  {reisAdvies.Reisadviezen[0].Segmenten.map((segment, index) => {
                    const isLastSegment = index === reisAdvies.Reisadviezen[0].Segmenten.length - 1;
                    const uniqueStations = processStations(segment.Stappen);
                    console.log("tijd"+ segment.StappenId)
                    return (
                        <React.Fragment key={segment.SegmentId}>
                          {index !== 0 && (
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
                      5 min. overstap tijd
                    </span>
                                <div className="flex-grow border-t border-red-950 border-dotted"></div>
                              </div>
                          )}
                          <StationDetails
                              departureTime={segment.Stappen[0].Tijd}
                              arrivalTime={segment.Stappen[segment.Stappen.length - 1].Tijd}
                              stations={uniqueStations}
                              showIntermediateStations={intermediateVisibility[segment.StappenId]}
                              toggleIntermediateStations={() =>
                                  toggleIntermediateVisibility(segment.StappenId)
                              }   
                              segmentId={segment.SegmentId}
                              trainType={segment.TreinType}
                              destination={segment.Bestemming}
                              // departure={segment.stappen[0].Station} // Assuming this is the departure station
                          />
                        </React.Fragment>
                    );
                  })}
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default ModelCard
