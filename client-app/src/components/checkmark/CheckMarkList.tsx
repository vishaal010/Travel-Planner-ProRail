export default function CheckmarkList() {
    const items = [
        { text: 'Vergelijk dienstregelingsmodellen Met de modellen van DONS', checked: true },
        { text: 'Complexe Algoritmes Voor optimale resultaten', checked: true },
        { text: 'Gebruiksvriendelijke interface Ontworpen voor eenvoudig gebruik', checked: true },
        // Add more items here
    ];

    return (
        <div className="bg-white p-4 shadow-md rounded-lg flex items-center max-w-6xl mx-auto">
            {items.map((item, index) => (
                <div key={index} className="flex items-center mr-4">
          <span className={`mr-2 ${item.checked ? 'text-green-500' : 'text-gray-500'}`}>
            {item.checked ? (
                <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path
                        d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"/>
                </svg>
            ) : (
                // Replace with 'X' mark or other icon if unchecked
                <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M10 10l-5 5m0-5l5 5m5-5l-5-5m5 5H5"/>
                </svg>
            )}
          </span>
                    <span className="text-gray-700">{item.text}</span>
                </div>
            ))}
        </div>
    );
}
