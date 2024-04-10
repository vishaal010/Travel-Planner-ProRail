// App.tsx
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from "axios";
import { Activity } from "./test-data/activities/models/activity.ts";
import NavBar from "./components/layout/NavBar.tsx";
import HomePage from "./pages/HomePage.tsx"; // Import HomePage
import ModelPage from "./pages/ModelPage.tsx"; // Ensure ModelPage is imported
import Footer from "./components/layout/Footer.tsx";

function App() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]); // State to manage uploaded files

    useEffect(() => {
        axios.get<Activity[]>('http://localhost:5000/api/activities')
            .then(response => {
                setActivities(response.data);
            });
    }, []);

    // Handler to update the uploaded files
    const handleFilesUploaded = (files) => {
        console.log('Files received:', files);
        setUploadedFiles(files);
    };

    return (
        <BrowserRouter>
            <div className="bg-gray-750 flex flex-col min-h-screen">
                <NavBar />
                <main className="flex-grow">
                    <Routes>
                    <Route path="/" element={<HomePage activities={activities} onFilesUploaded={handleFilesUploaded} />} />
                    <Route path="/model" element={<ModelPage uploadedFiles={uploadedFiles} />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;