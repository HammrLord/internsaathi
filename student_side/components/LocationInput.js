
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search } from 'lucide-react';

const INDIAN_CITIES = [
    "Mumbai, Maharashtra", "Delhi, Delhi", "Bangalore, Karnataka", "Hyderabad, Telangana",
    "Ahmedabad, Gujarat", "Chennai, Tamil Nadu", "Kolkata, West Bengal", "Surat, Gujarat",
    "Pune, Maharashtra", "Jaipur, Rajasthan", "Lucknow, Uttar Pradesh", "Kanpur, Uttar Pradesh",
    "Nagpur, Maharashtra", "Indore, Madhya Pradesh", "Thane, Maharashtra", "Bhopal, Madhya Pradesh",
    "Visakhapatnam, Andhra Pradesh", "Pimpri-Chinchwad, Maharashtra", "Patna, Bihar", "Vadodara, Gujarat",
    "Ghaziabad, Uttar Pradesh", "Ludhiana, Punjab", "Agra, Uttar Pradesh", "Nashik, Maharashtra",
    "Faridabad, Haryana", "Meerut, Uttar Pradesh", "Rajkot, Gujarat", "Kalyan-Dombivli, Maharashtra",
    "Vasai-Virar, Maharashtra", "Varanasi, Uttar Pradesh", "Srinagar, Jammu and Kashmir",
    "Aurangabad, Maharashtra", "Dhanbad, Jharkhand", "Amritsar, Punjab", "Navi Mumbai, Maharashtra",
    "Allahabad, Uttar Pradesh", "Ranchi, Jharkhand", "Howrah, West Bengal", "Coimbatore, Tamil Nadu",
    "Jabalpur, Madhya Pradesh", "Gwalior, Madhya Pradesh", "Vijayawada, Andhra Pradesh",
    "Jodhpur, Rajasthan", "Madurai, Tamil Nadu", "Raipur, Chhattisgarh", "Kota, Rajasthan",
    "Guwahati, Assam", "Chandigarh, Chandigarh", "Solapur, Maharashtra", "Hubballi-Dharwad, Karnataka",
    "Bareilly, Uttar Pradesh", "Moradabad, Uttar Pradesh", "Mysore, Karnataka", "Gurgaon, Haryana",
    "Aligarh, Uttar Pradesh", "Jalandhar, Punjab", "Tiruchirappalli, Tamil Nadu", "Bhubaneswar, Odisha",
    "Salem, Tamil Nadu", "Mira-Bhayandar, Maharashtra", "Warangal, Telangana", "Thiruvananthapuram, Kerala",
    "Bhiwandi, Maharashtra", "Saharanpur, Uttar Pradesh", "Gorakhpur, Uttar Pradesh", "Guntur, Andhra Pradesh",
    "Bikaner, Rajasthan", "Amravati, Maharashtra", "Noida, Uttar Pradesh", "Jamshedpur, Jharkhand",
    "Bhilai, Chhattisgarh", "Cuttack, Odisha", "Firozabad, Uttar Pradesh", "Kochi, Kerala",
    "Bhavnagar, Gujarat", "Dehradun, Uttarakhand", "Durgapur, West Bengal", "Asansol, West Bengal",
    "Nanded, Maharashtra", "Kolhapur, Maharashtra", "Ajmer, Rajasthan", "Gulbarga, Karnataka",
    "Jamnagar, Gujarat", "Ujjain, Madhya Pradesh", "Loni, Uttar Pradesh", "Siliguri, West Bengal",
    "Jhansi, Uttar Pradesh", "Ulhasnagar, Maharashtra", "Nellore, Andhra Pradesh", "Jammu, J&K"
];

const LocationInput = ({ value, onChange, placeholder = "Search location...", required = false }) => {
    const [query, setQuery] = useState(value || '');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        setQuery(value || '');
    }, [value]);

    useEffect(() => {
        // Click outside to close
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleInputChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        onChange(val); // Propagate change immediately (as free text)

        if (val.length > 0) {
            const filtered = INDIAN_CITIES.filter(city =>
                city.toLowerCase().includes(val.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 5));
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const selectCity = (city) => {
        setQuery(city);
        onChange(city);
        setShowSuggestions(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <div className="relative">
                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => query && setShowSuggestions(true)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900"
                    placeholder={placeholder}
                    required={required}
                />
                {/* Simulate Google Maps icon on the right if user types */}
                {query && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg" alt="Maps" className="w-5 h-5 opacity-50" />
                    </div>
                )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    {suggestions.map((city, index) => (
                        <div
                            key={index}
                            onClick={() => selectCity(city)}
                            className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-50 last:border-0"
                        >
                            <div className="bg-gray-100 p-1.5 rounded-full text-gray-500">
                                <MapPin size={14} />
                            </div>
                            <span className="text-gray-700 text-sm font-medium">{city}</span>
                        </div>
                    ))}
                    <div className="px-3 py-1.5 bg-gray-50 text-[10px] text-gray-400 text-right">
                        Powered by InternSaathi Maps
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationInput;
