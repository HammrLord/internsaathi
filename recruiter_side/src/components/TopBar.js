'use client';

import { ChevronDown, Volume2, VolumeX } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useState, useEffect, useCallback } from 'react';

export default function TopBar() {
    const [isReading, setIsReading] = useState(false);

    const changeFontSize = (action) => {
        const html = document.documentElement;
        const currentSize = parseFloat(window.getComputedStyle(html, null).getPropertyValue('font-size'));

        if (action === 'increase') {
            html.style.fontSize = (currentSize + 2) + 'px';
        } else if (action === 'decrease') {
            html.style.fontSize = (currentSize - 2) + 'px';
        } else {
            html.style.fontSize = '16px';
        }
    };

    const speak = useCallback((text) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8; // Slightly faster than 0.7 for better flow

        // Multilingual Support
        const lang = document.documentElement.lang || 'en-US';
        utterance.lang = lang;

        // Try to find a matching voice
        const voices = window.speechSynthesis.getVoices();
        const matchingVoice = voices.find(voice => voice.lang.startsWith(lang));
        if (matchingVoice) {
            utterance.voice = matchingVoice;
        }

        window.speechSynthesis.speak(utterance);
    }, []);

    const handleHoverRead = useCallback((event) => {
        const target = event.target;
        // Read text content of the hovered element, avoiding huge blocks if possible
        // We prioritize aria-label, then alt text, then innerText
        const textToRead = target.getAttribute('aria-label') || target.alt || target.innerText;

        if (textToRead && textToRead.trim().length > 0) {
            // specific check to avoid reading the entire body or huge containers repeatedly
            // unless it's a leaf node or has specific text
            if (target.children.length === 0 || target.tagName === 'BUTTON' || target.tagName === 'A' || target.tagName === 'H1' || target.tagName === 'H2' || target.tagName === 'P') {
                speak(textToRead);
            }
        }
    }, [speak]);

    const toggleScreenReader = () => {
        if (isReading) {
            window.speechSynthesis.cancel();
            setIsReading(false);
            document.body.removeEventListener('mouseover', handleHoverRead);
        } else {
            const text = "Screen reader activated. Hover over elements to read them.";
            speak(text);
            setIsReading(true);
            document.body.addEventListener('mouseover', handleHoverRead);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
            document.body.removeEventListener('mouseover', handleHoverRead);
        };
    }, [handleHoverRead]);

    return (
        <div className="bg-black text-white text-xs py-1 px-4 md:px-8 flex items-center justify-between z-50 relative">
            <div className="flex items-center gap-2">
                <img
                    src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg"
                    alt="Indian Flag"
                    className="w-6 h-4 object-cover border border-gray-600"
                />
                <span className="font-bold text-sm">भारत सरकार / Government of India</span>
            </div>

            <div className="flex items-center gap-6">
                {/* Screen Reader */}
                {/* Screen Reader Toggle */}
                <div className="flex items-center gap-2">
                    <span className="hidden sm:inline font-medium">Screen Reader</span>
                    <button
                        onClick={toggleScreenReader}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isReading ? 'bg-green-500' : 'bg-gray-600'}`}
                        title={isReading ? "Turn Off Screen Reader" : "Turn On Screen Reader"}
                    >
                        <span className="sr-only">Enable Screen Reader</span>
                        <span
                            className={`${isReading ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        />
                    </button>
                    {isReading && <Volume2 size={16} className="text-green-400 animate-pulse" />}
                </div>

                {/* Font Size Controls */}
                <div className="flex items-center gap-3 border-l border-r border-gray-700 px-3">
                    <button onClick={() => changeFontSize('decrease')} className="hover:text-gray-300 font-bold text-[10px]">A-</button>
                    <button onClick={() => changeFontSize('reset')} className="hover:text-gray-300 font-bold text-xs">A</button>
                    <button onClick={() => changeFontSize('increase')} className="hover:text-gray-300 font-bold text-sm">A+</button>
                </div>

                {/* Language Switcher */}
                <div className="relative">
                    <div className="flex items-center gap-1 cursor-pointer">
                        <span className="font-bold text-sm">Select Language</span>
                        <ChevronDown size={14} />
                    </div>
                    <div className="absolute inset-0 opacity-0 overflow-hidden">
                        <LanguageSwitcher />
                    </div>
                </div>
            </div>
        </div>
    );
}
