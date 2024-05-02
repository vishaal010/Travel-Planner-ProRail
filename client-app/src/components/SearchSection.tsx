import React, { useState } from 'react';
import InputField from './inputfield/InputField.tsx';
import ButtonWithHover from './button/ButtonWithHover.tsx';
import TooltipComponent from "./tooltip/tooltip.tsx";

const SearchSection = ({ onSearchInitiated }) => {
  const [inputOne, setInputOne] = useState('');
  const [inputTwo, setInputTwo] = useState('');
  const [inputRA, setInputRA] = useState('5'); // Default value
  const [inputBB, setInputBB] = useState('15'); // Default value

  const [errorMessage, setErrorMessage] = useState('');
  const [filterOption, setFilterOption] = useState('default');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const toggleAdvancedOptions = () => {
    setShowAdvancedOptions(prevState => !prevState);
  };

  const handleSearchClick = () => {
    const trimmedInputOne = inputOne.trim();
    const trimmedInputTwo = inputTwo.trim();

    if (!trimmedInputOne || !trimmedInputTwo) {
      setErrorMessage('Er is geen locatie ingevuld.');
      return;
    }

    if (trimmedInputOne.toLowerCase() === trimmedInputTwo.toLowerCase()) {
      setErrorMessage('Van en naar zijn hetzelfde.');
      return;
    }

    setErrorMessage('');
    // Use the updated state values for inputRA and inputBB
    onSearchInitiated({ van: trimmedInputOne, naar: trimmedInputTwo, maxReisadviezen: inputRA, bandBreedte: inputBB, filter: filterOption });
  };

  return (
      <div className="bg-red-950 p-3">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-roboto font-bold text-3xl text-center mb-2 text-white p-2">
            Plan je reis
          </h1>
          {errorMessage && (
              <div role="alert" className="flex items-center bg-red-200 text-red-800 p-3 rounded-md mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 mr-2" fill="none"
                     viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
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

          <div className="mt-6">
            <hr className="border-white"/>
          </div>
          <div className="flex items-center mb-4 mt-2 cursor-pointer" onClick={toggleAdvancedOptions}>
            <h2 className="text-white text-lg font-roboto underline-effect mb-0">Geadvanceerde Opties</h2>
            <img
                src="/assets/white_arrow.svg"
                className={`ml-2 w-4 h-4 transform transition-transform duration-300 ${showAdvancedOptions ? 'rotate-180' : ''}`}
                alt="toggle arrow"
            />
          </div>
          {showAdvancedOptions && (
              <div className="flex flex-wrap gap-4 my-4">
                <div className="flex items-center">
                  <label className="block font-roboto text-white mr-2">Aantal Reisadviezen:</label>
                  <input
                      type="number"
                      id="InputRA"
                      value={inputRA}
                      onChange={(e) => setInputRA(e.target.value)}
                      placeholder="Type here"
                      className="input input-bordered input-error w-32"
                  />
                </div>

                <div className="flex items-center">
                  <label className="block font-roboto text-white mr-2">Bandbreedte:</label>
                  <TooltipComponent message="Hoeveel minuten het mag afwijken van het korste reisdvies!" position="bottom">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="w-4 h-4 text-white stroke-current"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </TooltipComponent>
                  <input
                      type="number"
                      id="InputBB"
                      value={inputBB}
                      onChange={(e) => setInputBB(e.target.value)}
                      placeholder="Bandbreedte"
                      className="input input-bordered input-error w-32"
                  />
                </div>
              </div>
          )}


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
