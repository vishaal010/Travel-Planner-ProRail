import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function UploadButton({ onFilesUploaded }) {
    const [inputList, setInputList] = useState<(File | string)[]>(['']);
    const navigate = useNavigate();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newInputList = [...inputList];
        if (event.target.files?.length) {
            newInputList[index] = event.target.files[0];
        }
        setInputList(newInputList);
    };

    const handleSubmit = async () => {
        // Explicitly state that inputList is an array of `File`
        const filesToUpload = inputList.filter(file => file instanceof File) as File[];

        if (filesToUpload.length) {
            const formData = new FormData();
            // Append each file to 'files' key, now explicitly recognized as File objects
            filesToUpload.forEach(file => {
                formData.append('files', file, file.name);
            });

            try {
                const response = await fetch('http://localhost:5000/api/graaf/upload', {
                    method: 'POST',
                    body: formData, // Pass the FormData with multiple files
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const result = await response.json();
                    console.log("Response from server:", result);
                    onFilesUploaded(filesToUpload);
                    navigate('/api/model');
                } else {
                    console.log('No JSON returned from server');
                }
            } catch (error) {
                console.error('There was a problem with the file upload operation:', error);
            }
        } else {
            console.error("No files selected for upload.");
        }
    };


    const toggleModal = () => {
        const modal = document.getElementById('uploadModal');
        if (modal instanceof HTMLDialogElement) {
            modal.open ? modal.close() : modal.showModal();
        }
    };

    const addInput = () => {
        if (inputList.length < 2) {
            setInputList([...inputList, '']);
        }
    };


    return (
        <>
            <button onClick={toggleModal} className="btn btn-primary">Upload Modellen</button>
            <dialog id="uploadModal" className="modal">
                <div className="modal-box">  
                    <h3 className="font-bold text-lg mb-8">Upload hier je Modellen</h3>
                    {inputList.map((_, index) => (
                        <React.Fragment key={index}>
                            <h2 className='font-roboto mb-4'>Bestand {index + 1}</h2>
                            <input
                                type="file"
                                accept=".txtpb"
                                onChange={(e) => handleFileChange(e, index)}
                                className="file-input file-input-ghost file-input-primary w-full max-w-xs mb-2"
                            />
                            {index < inputList.length - 1 && <hr className="my-4" />}
                        </React.Fragment>
                    ))}
                    {inputList.length < 2 && (
                        <button onClick={addInput} className="btn btn-primary btn-square absolute right-2 top-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus w-6 h-6">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                    )}
                    <div className="modal-action">
                    <button onClick={handleSubmit} className="btn btn-primary">Upload</button>
                        <button onClick={toggleModal} className="btn">Sluiten</button>
                    </div>
                </div>
            </dialog>
        </>
    );
}
