import React from 'react';

type TrainBlockProps = {
  train: string;
  duration: number; 
  maxDuration: number; 
  SerieNaam: string;
};

const TrainBlock: React.FC<TrainBlockProps> = ({ train, duration, maxDuration ,SerieNaam}) => {
  // Calculate the width percentage of each train block relative to maxDuration
  const widthPercent = (duration / maxDuration) * 100 + 50;

  return (
    <div
      className="bg-gray-300 rounded py-1 flex justify-center items-center"
      style={{ width: `${widthPercent}%`  }} // Use calculated width percentage
    >
      <span className="text-sm">{train} {SerieNaam}</span>
    </div>
  );
};

export default TrainBlock;
