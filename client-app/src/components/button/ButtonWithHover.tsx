type ButtonWithHoverProps = {
    text: string;
    additionalClasses?: string;
    bgColor: string;
    hoverBgColor: string;
    textColor: string;
    imgSrc?: string; // Optional image source prop
};

const ButtonWithHover: React.FC<ButtonWithHoverProps> = ({
    text, 
    additionalClasses = '',
    bgColor,
    hoverBgColor,
    textColor,
    imgSrc,// Use the image source prop
    onClick,
}) => {
    return (
        <button onClick={onClick}
                className={`mt-4 group relative h-11 w-40 overflow-hidden text-lg shadow flex items-center justify-center rounded ${bgColor} ${additionalClasses} transition-colors duration-250 ease-in-out`}>
            <span className={`relative z-10 ${textColor}`}>{text}</span>
            {imgSrc && <img src={imgSrc} className="ml-2 h-6 w-6 z-10"
                            alt="Button icon"/>} {/* Image on the right of the text, with z-index */}
            <div
                className={`absolute inset-0 w-0 transition-all duration-250 ease-out group-hover:w-full ${hoverBgColor} z-0`}></div>
            {/* Lower z-index for the overlay */}
        </button>


    );
};

export default ButtonWithHover;
