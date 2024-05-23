import {useEffect, useState} from "react";
import Select from 'react-select';


const InputField = ({ inputOne, setInputOne, inputTwo, setInputTwo }) => {
    const [stationOptions, setStationOptions] = useState([]);

  const swapValues = () => {
    const temp = inputOne
    setInputOne(inputTwo)
    setInputTwo(temp)
  }

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: '48px', // default height is 38px
            boxShadow: state.isFocused ? '0 0 0 1px #aaa' : null,
            borderColor: state.isFocused ? '#aaa' : '#ccc',
            '&:hover': {
                borderColor: state.isFocused ? '#aaa' : '#ccc',
            },
            padding: '2px',

        }),
        valueContainer: (provided, state) => ({
            ...provided,
            padding: '0 8px',
        }),
        input: (provided, state) => ({
            ...provided,
            margin: '0px',
        }),
        indicatorSeparator: state => ({
            display: 'none',
        }),
        indicatorsContainer: (provided, state) => ({
            ...provided,
            height: '48px',
        }),
        menu: (provided, state) => ({
            ...provided,
            zIndex: 20,
        }),
    };


    useEffect(() => {
        const fetchStationNames = () => {
            fetch('http://localhost:5000/api/graaf/station-names', {
                headers: {
                    'Cache-Control': 'no-cache' // This tells the browser not to cache the response
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    const stationOptions = extractOptions(data);
                    setStationOptions(stationOptions);
                })
                .catch(error => {
                    console.error("Failed to fetch station names:", error);
                });
        };

        fetchStationNames();
    }, []);


    const extractOptions = (data) => {
        const uniqueOptions = new Map();
        for (const filePath in data) {
            if (Array.isArray(data[filePath])) {
                data[filePath].forEach(station => {
                    if (!uniqueOptions.has(station.key)) {
                        uniqueOptions.set(station.key, { value: station.key, label: station.value });
                    }
                });
            }
        }
        return Array.from(uniqueOptions.values()).sort((a, b) => a.label.localeCompare(b.label));
    };

    


  return (
      <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full">
          {/* Input field for "Van" */}
          <div className="w-full md:w-1/2">
              <label htmlFor="inputOne" className="block text-white text-sm mb-2">
                  Van
              </label>
              <Select
                  id="inputOne"
                  options={stationOptions}
                  value={stationOptions.find(option => option.value === inputOne)}
                  onChange={option => setInputOne(option ? option.value : '')}
                  placeholder="Selecteer een station"
                  styles={customStyles}
              />
          </div>
          {/* Swap button */}
          <button
              onClick={swapValues}
              className="flex md:self-center items-center justify-center p-1" // Add padding as needed
          >
              {/* Left arrow */}
              <img
                  src="/assets/arrow_bothways.svg"
                  alt="Arrow bothways"
                  className="w-12 h-12 mt-6"
              />
          </button>
          {/* Input field for "Naar" */}
          <div className="w-full md:w-1/2">
              <label htmlFor="inputTwo" className="block text-white text-sm mb-2">
                  Naar
              </label>
              <Select
                  id="inputTwo"
                  options={stationOptions}
                  value={stationOptions.find(option => option.value === inputTwo)}
                  onChange={option => setInputTwo(option ? option.value : '')}
                  placeholder="Selecteer een station"
                  styles={customStyles}
              />
          </div>
          
      </div>
  )
}

export default InputField
