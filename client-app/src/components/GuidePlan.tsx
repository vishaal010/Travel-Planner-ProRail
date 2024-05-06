import { motion } from 'framer-motion'
import TrainAnimation from "./animation/TrainAnimation.tsx";

export default function GuidePlan() {
  const stepVariants = {
    offscreen: {
      y: 50,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        bounce: 0.4,
        duration: 2.5, // Adjust the duration here as well
      },
    },
  }

  const steps = [
    {
      id: 1,
      title:
        'Begin met het uploaden van 1 of meerdere dienstregelingmodellen in Graaf(txtpb)-formaat.',
      icon: 'assets/step1.png',
    },
    {
      id: 2,
      title:
        'Voer twee stations in en onze algoritmen berekenen de kortste en alternatieve routes.',
      icon: 'assets/step2.png',
    },
    {
      id: 3,
      title: 'Ontvang een lijst met reisadviezen met details over elke reisadvies ',
      icon: 'assets/step3.png',
    },
  ]

  return (
      <div className="bg-gray-750 p-12">
        <h2 className="text-2xl md:text-3xl text-blue-950 font-bold lg:text-4xl text-center mb-4 font-roboto">
          De Toekomst van Dienstregelingen Begint Nu
        </h2>
        <p className="text-center font-medium text-gray-600 mb-24 font-roboto max-w-md mx-auto">
          Visualiseer je reis moeiteloos met onze geavanceerde digitale reisplanner. Upload modellen en
            ontvang diverse reisadviezen om je modellen keurig te vergelijken.
          </p>
        {/*<TrainAnimation/>*/}
        <hr className="w-full"/>
        <div className="relative grid md:grid-cols-3 gap-4">
          {steps.map((step, index) => (
              <motion.div
                  key={step.id}
                  variants={stepVariants}
                  initial="offscreen"
                  whileInView="onscreen"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex flex-col items-center text-center p-4 rounded-lg relative z-10"
              >
                <img
                    src={step.icon}
                    alt={`Stap ${step.id}`}
                    className="w-40 h-40 object-contain"
                />
                <h3 className="text-lg font-semibold font-roboto mb-2">
                  Stap {step.id}
                </h3>
                <p className="font font-roboto">{step.title}</p>
              </motion.div>
          ))}
        </div>
      </div>
  );
}
