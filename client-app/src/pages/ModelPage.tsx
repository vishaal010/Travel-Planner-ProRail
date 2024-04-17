import { useEffect, useState } from 'react'
// import SearchSection from '../components/SearchSection'
// import CardContainer from '../components/card/CardContainer.tsx'
// import { Player } from '@lottiefiles/react-lottie-player'

export default function ModelPage({ uploadedFiles }) {
  const [showToast, setShowToast] = useState(false)
  const [showLottie, setShowLottie] = useState(true)
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Fetch the model data from the backend

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/reisplanner/adviezen');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result)
        setData(result);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  // const handleSearchInitiated = () => {
  //   setShowLottie(false)
  // }

  return (
      <div>
        <h1>Reisadviezen</h1>
        {/*<ul>*/}
        {/*  {data.map((advies, index) => (*/}
        {/*      <li key={index}>{advies}</li>*/}
        {/*  ))}*/}
        {/*</ul>*/}
      </div>
  );
}
