import { useEffect, useState } from 'react';
import SearchSection from '../components/SearchSection';
import CardContainer from '../components/card/CardContainer.tsx';
import { Player } from '@lottiefiles/react-lottie-player';

export default function ModelPage({ uploadedFiles }) {
  const [showToast, setShowToast] = useState(false);
  const [showLottie, setShowLottie] = useState(true);
  const [modelData, setModelData] = useState(null);
  const [van, setVan] = useState('');
  const [naar, setNaar] = useState('');
  const [maxReisadviezen, setMaxReisadviezen] = useState('5'); // Default value
  const [bandBreedte, setBandBreedte] = useState('15'); // Default value
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearchInitiated = (data) => {
    setShowLottie(false);
    setVan(data.van);
    setNaar(data.naar);
    setMaxReisadviezen(data.maxReisadviezen); // Extract the value from data
    setBandBreedte(data.bandBreedte); // Extract the value from data
  };

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      displayToast();
    }
  }, [uploadedFiles]);

  useEffect(() => {
    const fetchData = async () => {
      if (!van || !naar) return;
      setLoading(true); // Start loading
      try {
        const response = await fetch(`http://localhost:5000/api/graaf/adviezen?van=${encodeURIComponent(van)}&naar=${encodeURIComponent(naar)}&MaxReisadviezen=${encodeURIComponent(maxReisadviezen)}&Bandbreedte=${encodeURIComponent(bandBreedte)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.data && typeof result.data === 'string') {
          setModelData(JSON.parse(result.data));
        } else {
          setModelData(result);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData();
  }, [van, naar, maxReisadviezen, bandBreedte]);

  const displayToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 6000);
  };

  if (loading) {
    return (
        <div className="mb-2">
          <SearchSection onSearchInitiated={handleSearchInitiated} />
          <div className="flex justify-center items-start pt-20 min-h-screen">
            <div className="flex items-center space-x-2">
              <span className="loading loading-spinner loading-lg"></span>
              <p className="font-roboto text-lg">Loading...</p>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-100">
        <SearchSection onSearchInitiated={handleSearchInitiated} />

        {showLottie && (
            <div className="text-center mx-auto mb-12">
              <h1 className="font-normal font-roboto-light mt-12 text-2xl md:text-3xl lg:text-3xl">
                Modellen zijn ingeladen!
              </h1>
              <p className="font-extralight mt-2">
                Om te <strong> Starten </strong> kiest u een <strong> Begin </strong> en <strong> Eindstation </strong>
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
                      key={`model-${model.ModelId}`} // It's better to use ModelId if available
                      model={model}
                      isLoading={undefined}
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
  );
}
