import { useState } from 'react'
import InputField from './inputfield/InputField.tsx'
import ButtonWithHover from './button/ButtonWithHover.tsx'

const SearchSection = ({ onSearchInitiated }) => {
  // State for input fields
  const [inputOne, setInputOne] = useState('')
  const [inputTwo, setInputTwo] = useState('')

  const handleSearchClick = () => {
    if (inputOne.trim() && inputTwo.trim()) {
      onSearchInitiated({ van: inputOne, naar: inputTwo });
    } else {
      alert('Please fill in both fields to initiate the search.');
    }
  };


  return (
      <div className="bg-red-950 p-3">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-roboto font-bold text-3xl text-center mb-2 text-white p-2">
            Plan je reis
          </h1>

          <InputField
              inputOne={inputOne}
              setInputOne={setInputOne}
              inputTwo={inputTwo}
              setInputTwo={setInputTwo}
          />
          <div className="flex justify-center md:justify-end">
            <ButtonWithHover
                onClick={handleSearchClick}
                disabled={!inputOne.trim() || !inputTwo.trim()}
                text="Plannen"
                bgColor="bg-white"
                hoverBgColor="bg-gray-300"
                textColor="text-black"
                imgSrc="/assets/search.png"
                className="ml-auto"
            />
          </div>
        </div>
      </div>
  )
};

export default SearchSection
