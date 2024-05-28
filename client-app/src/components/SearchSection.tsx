import React, { ChangeEvent, useState } from 'react';
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['-', 'e', '.', '+'].includes(e.key)) {
      e.preventDefault();
    }
  };
  
  const handleSearchClick = () => {
    const trimmedInputOne = inputOne.trim();
    const trimmedInputTwo = inputTwo.trim();
    const maxReisadviezen = parseInt(inputRA, 10);
    const bandBreedte = parseInt(inputBB, 10);

    // Check if the locations are filled
    if (!trimmedInputOne || !trimmedInputTwo) {
      setErrorMessage('Er is geen locatie ingevuld.');
      return;
    }

    // Check if the locations are the same
    if (trimmedInputOne.toLowerCase() === trimmedInputTwo.toLowerCase()) {
      setErrorMessage('Van en naar zijn hetzelfde.');
      return;
    }

    // Validate the numeric inputs
    if (maxReisadviezen <= 0 || maxReisadviezen > 50 || bandBreedte <= 0 || bandBreedte > 50) {
      setErrorMessage('Aantal Reisadviezen en Bandbreedte moeten tussen 1 en 50 zijn.');
      return;
    }

    // Clear the error message if all validations pass
    setErrorMessage('');

    // Initiate the search with validated data
    onSearchInitiated({ van: trimmedInputOne, naar: trimmedInputTwo, maxReisadviezen, bandBreedte, filter: filterOption });
  };

  async function clearCache() {
    try {
      const response = await fetch('http://localhost:5000/api/cache/clear', {
        method: 'POST'
      });

      if (response.ok) {
        window.location.href = "/"; // Redirect to homepage
      } else {
        alert("Failed to clear cache!");
      }
    } catch (error) {
      console.error("Error clearing cache:", error);
      alert("Error clearing cache!");
    }
  }

  const handleBandBreedteInput = (e: ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = e.target.value.replace(/[-e.+]/g, '');
    setInputBB(cleanedValue);
  };

  return (
      <div className="bg-red-950 p-3">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-roboto font-bold text-3xl text-center mb-2 text-white p-2">
            Plan je reis
          </h1>
          {errorMessage && (
              <div role="alert" className="flex items-center bg-red-200 text-red-800 p-3 rounded-md mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24">
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

          <div className="mt-6">
            <hr className="border-white" />
          </div>
          <div className="flex items-center mb-4 mt-2 cursor-pointer" onClick={toggleAdvancedOptions}>
            <h2 className="text-white text-lg font-roboto underline-effect mb-0">Geavanceerde Opties</h2>
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
                      onKeyDown={handleKeyDown}
                      placeholder="Type here"
                      className="input input-bordered input-error w-32"
                  />
                </div>

                <div className="flex items-center">
                  <label className="block font-roboto text-white mr-2">Bandbreedte:</label>
                  <TooltipComponent message="Hoeveel minuten het mag afwijken van het kortste reisadvies!" position="bottom">
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
                      onInput={handleBandBreedteInput}
                      id="InputBB"
                      value={inputBB}
                      onChange={(e) => setInputBB(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Bandbreedte"
                      className="input input-bordered input-error w-32"
                  />
                </div>
              </div>
          )}

          <div className="flex justify-between items-center">
            <ButtonWithHover
                onClick={clearCache}
                text="Ga Terug"
                bgColor="bg-white"
                hoverBgColor="bg-gray-300"
                textColor="text-black"
                // imgSrc="/assets/left.png"
            />

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
