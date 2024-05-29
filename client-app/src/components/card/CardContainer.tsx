import React, { useEffect, useState } from 'react';
import ModelCard from './ModelCard';

// @ts-ignore
const CardContainer = ({ model, isLoading }) => {
  const [modelData, setModelData] = useState(null);
  const [showDetailsArray, setShowDetailsArray] = useState([]);

  useEffect(() => {
    // Log to indicate the effect is running

    try {
      console.log('Received model:', model);
      const parsedModel = JSON.parse(model);
      console.log('Parsed model:', parsedModel);
      setModelData(parsedModel); // Save the parsed model in the state

      // Set up the initial show details state
      if (Array.isArray(parsedModel.Data)) {
        setShowDetailsArray(parsedModel.Data.map(() => false));
      }
      else {
        console.error("Failed");

      }
    } catch (error) {
      console.error("Error parsing model JSON:", error);
    }
  }, [model]); // Effect runs every time 'model' changes

  const toggleShowDetails = (adviesIndex) => {
    console.log('Before toggle:', showDetailsArray);

    const updatedShowDetailsArray = showDetailsArray.map((detail, index) =>
        index === adviesIndex ? !detail : detail
    );

    console.log('After toggle:', updatedShowDetailsArray);

    // @ts-ignore
    setShowDetailsArray(updatedShowDetailsArray);
  };
  
  return (
      <div className="flex flex-col rounded mx-auto w-full max-w-xl">
        <div className="bg-gray-850 p-1">
          {modelData && (
              <h2 className="text-center text-base font-[Roboto]">
                 {modelData.ModelNaam}
              </h2>
          )}
        </div>
        <hr className="my-0" />
        {
            modelData && modelData.Data && modelData.Data.map((advies, index) => (
                <ModelCard
                    key={index} // Consider using a more unique key if possible
                    reisAdvies={advies}
                    showDetails={showDetailsArray[index]}
                    onToggleShowDetails={() => toggleShowDetails(index)}
                    isLoading={isLoading}
                />
            ))
        }
      </div>
  );


};

export default React.memo(CardContainer);
