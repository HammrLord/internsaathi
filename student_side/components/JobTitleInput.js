
import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, Search } from 'lucide-react';

const COMMON_ROLES = [
    // Tech
    "React Intern", "Frontend Intern", "Backend Intern", "Full Stack Intern",
    "Node.js Intern", "Python Intern", "Java Intern", "C++ Intern",
    "Data Science Intern", "Machine Learning Intern", "AI Engineer Intern",
    "DevOps Intern", "Cloud Computing Intern", "Cybersecurity Intern",
    "Mobile App Intern (Android)", "iOS Developer Intern", "Flutter Intern",
    "UI/UX Design Intern", "Product Design Intern", "Game Developer Intern",
    "Blockchain Intern", "QA / Testing Intern",

    // Product & Management
    "Product Management Intern", "Project Management Intern", "Business Analyst Intern",
    "Operations Intern", "Strategy Intern", "HR Intern", "Talent Acquisition Intern",

    // Marketing & Growth
    "Digital Marketing Intern", "Social Media Intern", "Content Writing Intern",
    "SEO Intern", "Growth Hacking Intern", "Public Relations Intern",
    "Sales Intern", "Business Development Intern", "Brand Management Intern",

    // Design & Creative
    "Graphic Design Intern", "Video Editing Intern", "Motion Graphics Intern",
    "Fashion Design Intern", "Interior Design Intern",

    // Finance & Legal
    "Finance Intern", "Accounting Intern", "Legal Intern", "Policy Research Intern"
];

const JobTitleInput = ({ value, onChange, placeholder = "e.g. React Intern" }) => {
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
        onChange(val);

        if (val.length > 0) {
            const filtered = COMMON_ROLES.filter(role =>
                role.toLowerCase().includes(val.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 6)); // Show top 6 matches
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const selectRole = (role) => {
        setQuery(role);
        onChange(role); // Propagate standardized value
        setShowSuggestions(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <div className="relative">
                <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => query && setShowSuggestions(true)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900"
                    placeholder={placeholder}
                    required
                />
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-60 overflow-y-auto">
                    {suggestions.map((role, index) => (
                        <div
                            key={index}
                            onClick={() => selectRole(role)}
                            className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center gap-2 border-b border-gray-50 last:border-0"
                        >
                            <Search size={14} className="text-gray-400" />
                            <span className="text-gray-700 text-sm font-medium">
                                {/* Highlight matching part logic could go here, keeping simple for now */}
                                {role}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobTitleInput;
