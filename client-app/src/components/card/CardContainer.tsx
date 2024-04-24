import { useEffect, useState } from 'react'
// import ModelCard from './ModelCard'
import {} from '../../types'

const CardContainer = ({ model }) => {
  const [showDetailsArray, setShowDetailsArray] = useState([])

  useEffect(() => {
    if (model && Array.isArray(model.reisAdviezen)) {
      setShowDetailsArray(model.reisAdviezen.map(() => false))
    }
  }, [model])

  console.log(model)

  const toggleShowDetails = (adviesIndex) => {
    // Create a new array with the toggled detail visibility
    const updatedShowDetailsArray = showDetailsArray.map((detail, index) =>
      index === adviesIndex ? !detail : detail
    )
    setShowDetailsArray(updatedShowDetailsArray)
  }

  return (
    <div className="flex flex-col rounded mx-auto w-full max-w-xl">
      <div className="bg-gray-850 p-1">
        <h2 className="text-center text-base font-[Roboto] font-extralight">
          Model: {model.modelNaam}
        </h2>
      </div>
      <hr className="my-0" />
      {/*{model.reisAdviezen.map((advies, adviesIndex) => (*/}
      {/*  <ModelCard*/}
      {/*    key={`${model.modelId}-${advies.adviesId}`}*/}
      {/*    reisAdvies={advies}*/}
      {/*    showDetails={showDetailsArray[adviesIndex]}*/}
      {/*    onToggleShowDetails={() => toggleShowDetails(adviesIndex)}*/}
      {/*  />*/}
      {/*))}*/}
    </div>
  )
}

export default CardContainer
