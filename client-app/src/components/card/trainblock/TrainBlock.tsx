import React from 'react';

type TrainBlockProps = {
  train: string;
  duration: number; 
  maxDuration: number; 
  SerieNaam: string;
};

const TrainBlock: React.FC<TrainBlockProps> = ({ train, duration, maxDuration ,SerieNaam}) => {
  const widthPercent = (duration / maxDuration) * 100 + 50;

  return (
    <div
      className="bg-gray-300 rounded py-1 flex justify-center items-center"
      style={{ width: `${widthPercent}%`  }} 
    >
      <span className="text-sm">{train} {SerieNaam}</span>
    </div>
  );
};

export default TrainBlock;
