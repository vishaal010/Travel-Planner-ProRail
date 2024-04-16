const InputField = ({ inputOne, setInputOne, inputTwo, setInputTwo }) => {
  // Removed local useState as you should use state passed from parent

  const swapValues = () => {
    const temp = inputOne
    setInputOne(inputTwo)
    setInputTwo(temp)
  }

  return (
    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full">
      {/* Input field for "Van" */}
      <div className="w-full md:w-1/2">
        <label htmlFor="inputOne" className="block text-white text-sm mb-2">
          Van
        </label>
        <input
          id="inputOne"
          type="text"
          value={inputOne}
          onChange={(e) => setInputOne(e.target.value)}
          placeholder="Rotterdam Centraal"
          className="p-2 input-secondary w-full h-12 border-2 border-gray-200 rounded"
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
        <input
          id="inputTwo"
          type="text"
          value={inputTwo}
          onChange={(e) => setInputTwo(e.target.value)}
          placeholder="Utrecht Centraal"
          className="p-2 w-full input-secondary h-12 border-2 border-gray-200 rounded"
        />
      </div>
    </div>
  )
}

export default InputField
