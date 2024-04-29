import React, { useEffect, useState } from 'react';
import ModelCard from './ModelCard';

const CardContainer = ({ model }) => {
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
  }, []); // Effect runs every time 'model' changes

  const toggleShowDetails = (adviesIndex) => {
    console.log('Before toggle:', showDetailsArray);

    const updatedShowDetailsArray = showDetailsArray.map((detail, index) =>
        index === adviesIndex ? !detail : detail
    );

    console.log('After toggle:', updatedShowDetailsArray);

    setShowDetailsArray(updatedShowDetailsArray);
  };


  // Commented out JSON stringify as it's not needed for rendering
  // const indentedJson = JSON.stringify(modelData, null, 2);
  // console.log(indentedJson);

  return (
      <div className="flex flex-col rounded mx-auto w-full max-w-xl">
        <div className="bg-gray-850 p-1">
          {modelData && (
              <h2 className="text-center text-base font-[Roboto] font-extralight">
                Model: {modelData.ModelNaam}
              </h2>
          )}
        </div>
        <hr className="my-0" />
        {/* Temporarily disable ModelCard rendering */}
        {/* Access the first item of Data and then map over its Reisadviezen */}
        {
            modelData && modelData.Data && modelData.Data.map((advies, index) => (
                <ModelCard
                    key={index} // Consider using a more unique key if possible
                    reisAdvies={advies}
                    showDetails={showDetailsArray[index]}
                    onToggleShowDetails={() => toggleShowDetails(index)}
                />
            ))
        }
      </div>
  );


};

export default React.memo(CardContainer);
