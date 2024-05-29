import { SetStateAction, useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from "./components/layout/NavBar.tsx";
import HomePage from "./pages/HomePage.tsx";
import ModelPage from "./pages/ModelPage.tsx";
import Footer from "./components/layout/Footer.tsx";

function App() {
    // State to store the uploaded files
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    // Handler to update the uploaded files
    const handleFilesUploaded = (files: SetStateAction<File[]>) => {
        console.log('Files received:', files);
        setUploadedFiles(files);
    };

    return (
        // BrowserRouter to enable routing in the application
        <BrowserRouter>
            {/* Main container with a background color and flex styling */}
            <div className="bg-gray-750 flex flex-col min-h-screen">
                {/* Navigation bar component */}
                <NavBar />
                {/* Main content area with flexible growth */}
                <main className="flex-grow">
                    {/* Routes for different pages */}
                    <Routes>
                        {/* Route for the HomePage, passing the file upload handler as a prop */}
                        <Route path="/" element={<HomePage onFilesUploaded={handleFilesUploaded} />} />
                        {/* Route for the ModelPage, passing the uploaded files as a prop */}
                        <Route path="/api/model" element={<ModelPage uploadedFiles={uploadedFiles} />} />
                    </Routes>
                </main>
                {/* Footer component */}
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
