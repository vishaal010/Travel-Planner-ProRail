import React from 'react';

// Properties for the ButtonWithHover component
type ButtonWithHoverProps = {
    text: string; 
    additionalClasses?: string; 
    bgColor: string; 
    hoverBgColor: string;
    textColor: string; 
    imgSrc?: string; 
    onClick?: () => void; 
};

// Functional component for a button with hover effect
const ButtonWithHover: React.FC<ButtonWithHoverProps> = ({
                                                             text,
                                                             additionalClasses = '',
                                                             bgColor,
                                                             hoverBgColor,
                                                             textColor,
                                                             imgSrc,
                                                             onClick,
                                                         }) => {
    return (
        <button
            onClick={onClick}
            className={`mt-4 group relative h-11 w-40 overflow-hidden text-lg shadow flex items-center justify-center rounded ${bgColor} ${additionalClasses} transition-colors duration-250 ease-in-out`}
        >
            {/* Text span with a higher z-index to ensure it stays above the background */}
            <span className={`relative z-10 ${textColor}`}>{text}</span>
            {/* Image icon, if provided, placed to the right of the text */}
            {imgSrc && <img src={imgSrc} className="ml-2 h-6 w-6 z-10" alt="Button icon" />}
            {/* Background div for hover effect, with lower z-index */}
            <div
                className={`absolute inset-0 w-0 transition-all duration-250 ease-out group-hover:w-full ${hoverBgColor} z-0`}
            ></div>
        </button>
    );
};

export default ButtonWithHover;
