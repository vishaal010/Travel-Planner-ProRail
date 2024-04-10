import { useState } from 'react'
import ModelCard from './ModelCard'
import { TravelAdvice } from '../../types'

const CardContainer = () => {
  const cardTrainData: TravelAdvice[] = [
    {
      id: 1,
      travelDuration: 90,
      timePattern: '10|20|10|20',
      frequency: 2,
      numberOfTransfers: 1,
      segments: [
        {
          segment_id: 1,
          duration: 15,
          trainType: 'Intercity',
          trainId: 'IC1234',
          seriesName: 'A120',
          steps: [
            {
              stepType: 'Departure',
              stationName: 'Rotterdam Central',
              time: '10|30|40|00m',
              track: '5',
            },
            {
              stepType: 'Arrival',
              stationName: 'Rotterdam Alexander',
              time: '13|34|45|04m',
              track: '2',
            },
            {
              stepType: 'Departure',
              stationName: 'Rotterdam Alexander',
              time: '14|36|46|05m',
              track: '1',
            },
            {
              stepType: 'Arrival',
              stationName: 'Gouda',
              time: '17|40|50|08m',
              track: '1',
            },
            {
              stepType: 'Departure',
              stationName: 'Gouda',
              time: '18|41|51|09m',
              track: '1',
            },
            {
              stepType: 'Arrival',
              stationName: 'Utrecht Central',
              time: '20|44|55|12m',
              track: '1',
            },
          ],
        },
        {
          segment_id: 2,
          duration: 25,
          trainType: 'Intercity',
          trainId: 'IC1234',
          seriesName: 'A120',
          steps: [
            {
              step_id: 1,
              stepType: 'Departure',
              stationName: 'Rotterdam Central',
              time: '18|41|51|',
              track: '5',
            },
            {
              stepType: 'Arrival',
              stationName: 'Rotterdam Alexander',
              time: '18|41|51|',
              track: '2',
            },
            {
              stepType: 'Departure',
              stationName: 'Rotterdam Alexander',
              time: '18|41|51|',
              track: '1',
            },
            {
              stepType: 'Arrival',
              stationName: 'Gouda',
              time: '18|41|51|',
              track: '1',
            },
            {
              stepType: 'Departure',
              stationName: 'Gouda',
              time: '18|41|51|',
              track: '1',
            },
            {
              stepType: 'Arrival',
              stationName: 'Utrecht Central',
              time: '18|41|51|',
              track: '1',
            },
          ],
        },
      ],
    },
  ]
  const [showDetailsArray, setShowDetailsArray] = useState<boolean[]>(
    cardTrainData.map(() => false)
  )

  const toggleShowDetails = (index: number) => {
    const newShowDetailsArray = [...showDetailsArray]
    newShowDetailsArray[index] = !newShowDetailsArray[index]
    setShowDetailsArray(newShowDetailsArray)
  }

  return (
    <div className="flex flex-col rounded mx-auto w-full max-w-xl">
      <div className="bg-gray-850 p-1">
        <h2 className="text-center text-base font-[Roboto] font-extralight">
          Model
        </h2>
      </div>
      <hr className="my-0" />
      {cardTrainData.map((travelAdvice, index) => (
        <ModelCard
          key={index}
          travelAdvice={travelAdvice}
          showDetails={showDetailsArray[index]}
          onToggleShowDetails={() => toggleShowDetails(index)}
        />
      ))}
    </div>
  )
}

export default CardContainer
