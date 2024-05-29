import UploadButton from '../button/UploadButton'

// The HomeHero component is a functional React component that accepts a prop 'onFilesUploaded'
// This prop is expected to be a function that handles file uploads
// @ts-ignore
export default function HomeHero({ onFilesUploaded }) {
  return (
      // A div element that serves as the main container for the hero section
      // It has a background image and some responsive height styling
      <div
          className="relative w-full bg-cover bg-center min-h-[350px] lg:min-h-[400px] xl:min-h-[350px]"
          style={{ backgroundImage: "url('/assets/prorail_background.png')" }}
      >
        {/* An overlay div to add a semi-transparent red layer over the background image */}
        <div className="absolute inset-0 bg-red-500 opacity-50"></div>

        {/* A div to position the content in the center of the hero section */}
        <div
            className="absolute top-0 left-0 right-0 flex flex-col items-center justify-center"
            style={{ height: '350px' }}
        >
          {/* The main heading for the hero section */}
          <h1 className="text-lg sm:text-4xl md:text-4xl lg:text-5xl xl:text-4xl font-bold text-white mb-6">
            Reisplanner
          </h1>

          {/* UploadButton component to handle file uploads, passing the onFilesUploaded prop */}
          <UploadButton onFilesUploaded={onFilesUploaded} />
        </div>
      </div>
  )
}
