import { useEffect, useState } from 'react'
import SearchSection from '../components/SearchSection'
import CardContainer from '../components/card/CardContainer.tsx'
import { Player } from '@lottiefiles/react-lottie-player'

export default function ModelPage({ uploadedFiles }) {
  const [showToast, setShowToast] = useState(false)
  const [showLottie, setShowLottie] = useState(true)
  const [modelData, setModelData] = useState(null)
  const [van, setVan] = useState('');
  const [naar, setNaar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // @ts-ignore
  const handleSearchInitiated = (data) => {
    setShowLottie(false)
    setVan(data.van);
    setNaar(data.naar);
  }
  
  useEffect(() => {
    const fetchData = async () => {
      if (!van || !naar) return;  // Check if van and naar are set
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/reisplanner/adviezen?van=${encodeURIComponent(van)}&naar=${encodeURIComponent(naar)}`);
        console.log(response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setModelData(result);
        console.log(result)
      } catch (error) {
        // @ts-ignore
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [van, naar]);



  const displayToast = () => {
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      displayToast()
    }
  }, [uploadedFiles])



  // @ts-ignore
  // @ts-ignore
  return (
    <div className="min-h-screen bg-gray-100">
      <SearchSection onSearchInitiated={handleSearchInitiated} />

      {showLottie && (
        <div className="text-center mx-auto mb-12">
          <h1 className="font-normal font-roboto-light mt-12 text-2xl md:text-3xl lg:text-3xl">
            Gelukt!
          </h1>
          <p className="font-extralight mt-2">
            Kies een begin en eindstation en laad u modellen nu in
          </p>
          <div style={{ position: 'relative' }}>
            <Player
              autoplay
              loop
              src="https://lottie.host/83e828c5-5884-4d36-8bdb-7d2fcabe85be/vSfO0F6Irf.json"
              className="w-96 h-96 absolute top-[-100px] left-0 right-0"
            />
          </div>
        </div>
      )}

      {!showLottie && (
          <div className="flex flex-col md:flex-row justify-around w-full px-4 lg:px-12 mt-7 mb-8 gap-4">
            {modelData && modelData.map((model, index) => (
                <CardContainer
                    key={`model-${index}`}
                    model={model}
                    className="mb-4 md:mb-0 md:mx-2"
                />
            ))}
          </div>
      )}
      {showToast && (
        <div className="toast">
          <div className="alert alert-info bg-primary">
            <span className="text-white">Model is geupload!</span>
          </div>
        </div>
      )}
    </div>
  )
}
