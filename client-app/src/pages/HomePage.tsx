import React, { useState } from 'react'
import GuidePlan from '../components/GuidePlan'
import HomeHero from '../components/heroes/HomeHero'
import { motion } from 'framer-motion'
import { Activity } from '../test-data/activities/models/activity'

interface HomePageProps {
  activities: Activity[]
  onFilesUploaded: (files: File[]) => void // Declare the type of the onFilesUploaded prop
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.2, // Make it faster by reducing time between staggered children
    },
  },
}

const childVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4, // Reduce the duration to make it faster
    },
  },
}

// HomePage component
// HomePage component
const   HomePage: React.FC<HomePageProps> = ({ activities, onFilesUploaded }) => {
  const [guidePlanVisible, setGuidePlanVisible] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  // Function to handle the completion of the HomeHero animation
  const onHeroAnimationComplete = () => {
    setGuidePlanVisible(true)
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div
        variants={childVariants}
        onAnimationComplete={onHeroAnimationComplete}
      >
        {/* Pass the function directly since it's defined in this component */}
        <HomeHero onFilesUploaded={onFilesUploaded} />
      </motion.div>
      {guidePlanVisible && <GuidePlan />}
    </motion.div>
  )
}

export default HomePage
