import React from 'react';

type TrainBlockProps = {
  train: string;
  duration: number; // Duration in minutes
  maxDuration: number; // Maximum duration among all trains and transfers
};

const TrainBlock: React.FC<TrainBlockProps> = ({ train, duration, maxDuration }) => {
  // Calculate the width percentage of each train block relative to maxDuration
  const widthPercent = (duration / maxDuration) * 100;

  return (
    <div
      className="bg-gray-300 rounded py-1 flex justify-center items-center"
      style={{ width: `${widthPercent}%` }} // Use calculated width percentage
    >
      <span>{train}</span>
    </div>
  );
};

export default TrainBlock;
