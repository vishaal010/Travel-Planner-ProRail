import { useState } from 'react';
import InputField from './inputfield/InputField.tsx';
import ButtonWithHover from './button/ButtonWithHover.tsx';

const SearchSection = ({ onSearchInitiated }) => {
  const [inputOne, setInputOne] = useState('');
  const [inputTwo, setInputTwo] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearchClick = () => {
    const trimmedInputOne = inputOne.trim();
    const trimmedInputTwo = inputTwo.trim();

    // Check if any input field is empty
    if (!trimmedInputOne || !trimmedInputTwo) {
      setErrorMessage('Er is geen locatie ingevuld.');
      return;
    }

    // Check if the input fields contain the same value
    if (trimmedInputOne.toLowerCase() === trimmedInputTwo.toLowerCase()) {
      setErrorMessage('Van en naar zijn hetzelfde.');
      return;
    }

    // Clear the error message if validations pass
    setErrorMessage('');

    // Initiate search if validations pass
    onSearchInitiated({ van: trimmedInputOne, naar: trimmedInputTwo });
  };

  return (
      <div className="bg-red-950 p-3">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-roboto font-bold text-3xl text-center mb-2 text-white p-2">
            Plan je reis
          </h1>
          {errorMessage && (
              <div role="alert" className="alert alert-warning">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errorMessage}</span>
              </div>
          )}
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
  );
};

export default SearchSection;
