import React from 'react';

type TrainBlockProps = {
  train: string;      
  duration: number;    
  maxDuration: number;
  SerieNaam: string; 
};

// TrainBlock component
const TrainBlock: React.FC<TrainBlockProps> = ({ train, duration, maxDuration, SerieNaam }) => {
  // Calculate the width percentage based on the duration and maxDuration
  const widthPercent = (duration / maxDuration) * 100 + 50;

  return (
      <div
          className="bg-gray-300 rounded py-1 flex justify-center items-center"
          style={{ width: `${widthPercent}%` }} // Set the width of the block dynamically
      >
        <span className="text-sm">{train} {SerieNaam}</span> {/* Display train name and series name */}
      </div>
  );
};

export default TrainBlock;
