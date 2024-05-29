import UploadButton from '../button/UploadButton'

// @ts-ignore
export default function HomeHero({ onFilesUploaded }) {
  // const handleButtonClick = () => {
  //     // Button click logic
  // };

  return (
    <div
      className="relative w-full bg-cover bg-center min-h-[350px] lg:min-h-[400px] xl:min-h-[350px]"
      style={{ backgroundImage: "url('/assets/prorail_background.png')" }}
    >
      <div className="absolute inset-0 bg-red-500 opacity-50"></div>
      <div
        className="absolute top-0 left-0 right-0 flex flex-col items-center justify-center"
        style={{ height: '350px' }}
      >
        <h1 className="text-lg sm:text-4xl md:text-4xl lg:text-5xl xl:text-4xl font-bold text-white mb-6">
          Reisplanner
        </h1>
        <UploadButton onFilesUploaded={onFilesUploaded} />
      </div>
    </div>
  )
}
