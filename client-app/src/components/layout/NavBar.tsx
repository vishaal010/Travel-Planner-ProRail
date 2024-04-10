import { Link } from "react-router-dom";

export default function NavBar() {
    return (
        <nav className="bg-gray-750 p-4 flex justify-between items-center flex-wrap">
            <div className="flex items-center flex-shrink-0 text-black mr-6">
                {/* Wrap the image with Link */}
                <Link to="/">
                    <img src="/assets/Prorail_logo.png" alt="Logo" className="h-8 w-auto cursor-pointer" />
                </Link>
            </div>
            <div className="block lg:hidden">
                <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
                    {/* Icon for mobile menu */}
                </button>
            </div>
            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto hidden">
                <div className="text-sm lg:flex-grow">
                </div>
            </div>
        </nav>
    );
}