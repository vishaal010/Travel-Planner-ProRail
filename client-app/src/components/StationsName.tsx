import { useEffect, useState } from 'react';

export const StationsName = (filePath) => {
    const [stationNames, setStationNames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStationNames = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/graaf/station-names?filePath=${encodeURIComponent(filePath)}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setStationNames(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStationNames();
    }, [filePath]);

    return { stationNames, loading, error };
};

export default StationsName;
