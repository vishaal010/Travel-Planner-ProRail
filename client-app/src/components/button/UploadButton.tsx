import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UploadButton({ onFilesUploaded }) {
    const [inputList, setInputList] = useState<(File | string)[]>(['']);
    const navigate = useNavigate();
    const [fileNames, setFileNames] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState(''); // Error state
    const [inputKeys, setInputKeys] = useState<string[]>(['']);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newInputList = [...inputList];
        const newFileNames = [...fileNames];
        const newInputKeys = [...inputKeys];

        if (event.target.files?.length) {
            newInputList[index] = event.target.files[0];
            newFileNames[index] = event.target.files[0].name;
            newInputKeys[index] = Math.random().toString();
            setErrorMessage('');
        } else {
            setErrorMessage('Please select a file.');
        }

        setInputList(newInputList);
        setFileNames(newFileNames);
        setInputKeys(newInputKeys);
    };

    const handleFileDelete = (index: number) => {
        const newInputList = [...inputList];
        const newFileNames = [...fileNames];
        const newInputKeys = [...inputKeys];

        newInputList[index] = '';
        newFileNames[index] = '';
        newInputKeys[index] = Math.random().toString();

        setInputList(newInputList);
        setFileNames(newFileNames);
        setInputKeys(newInputKeys);
    };

    const handleSubmit = async () => {
        const filesToUpload = inputList.filter(file => file instanceof File) as File[];
        if (filesToUpload.length) {
            const formData = new FormData();
            filesToUpload.forEach(file => {
                formData.append('files', file, file.name);
            });

            try {
                const response = await fetch('http://localhost:5000/api/graaf/upload', {
                    method: 'POST',
                    body: formData,
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
            setErrorMessage('Geen bestand geselecteerd!');
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
            setFileNames([...fileNames, '']);
            setInputKeys([...inputKeys, Math.random().toString()]);
        }
    };

    return (
        <>
            <button onClick={toggleModal} className="btn btn-primary">Upload Dienstregelingen</button>
            <dialog id="uploadModal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Upload hier je Dienstregeling</h3>
                    <p className="mb-8 font-roboto italic">
                        Bestandsformaat = <span className="font-bold">.txtpb</span>
                    </p>
                    {errorMessage && ( // Alert for error message
                        <div role="alert" className="flex items-center bg-red-200 text-red-800 p-3 rounded-md mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 mr-2" fill="none"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span>{errorMessage}</span>
                        </div>
                    )}
                    {inputList.map((_, index) => (
                        <React.Fragment key={index}>
                            <h2 className='font-roboto font-bold mb-4'>DienstregelingModel {index + 1}</h2>
                            {fileNames[index] && fileNames[index].length > 0 && (
                                <p className='font-roboto mb-4'>Geselecteerd bestand:
                                    <span className="font-bold"> {fileNames[index]}</span>
                                    <button onClick={() => handleFileDelete(index)} className="ml-2 text-red-600">Delete</button>
                                </p>
                            )}
                            {!fileNames[index] && (
                                <div key={inputKeys[index]}>
                                    <input
                                        type="file"
                                        accept=".txtpb"
                                        onChange={(e) => handleFileChange(e, index)}
                                        className="file-input file-input-ghost file-input-primary w-full max-w-xs mb-2"
                                    />
                                </div>
                            )}
                            {index < inputList.length - 1 && <hr className="my-4" />}
                        </React.Fragment>
                    ))}
                    {inputList.length < 2 && (
                        <button onClick={addInput} className="btn btn-primary btn-square absolute right-2 top-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                 className="feather feather-plus w-6 h-6">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                    )}
                    <div className="modal-action">
                        <button onClick={handleSubmit} className="btn btn-primary">Bekijk adviezen</button>
                        <button onClick={toggleModal} className="btn">Sluiten</button>
                    </div>
                </div>
            </dialog>
        </>
    );
}
