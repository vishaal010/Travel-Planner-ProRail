import { useEffect, useState } from 'react'
import SearchSection from '../components/SearchSection'
import CardContainer from '../components/card/CardContainer.tsx'
import { Player } from '@lottiefiles/react-lottie-player'

export default function ModelPage({ uploadedFiles }) {
  const [showToast, setShowToast] = useState(false)
  const [showLottie, setShowLottie] = useState(true)

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

  const handleSearchInitiated = () => {
    setShowLottie(false)
  }

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
        <div className="flex justify-around w-full px-4 lg:px-12 mt-7 mb-8">
          {uploadedFiles.map((file, index) => (
            <CardContainer key={index} file={file} />
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
