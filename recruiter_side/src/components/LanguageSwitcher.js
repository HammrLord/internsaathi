'use client';

import { useEffect } from 'react';

export default function LanguageSwitcher() {
  useEffect(() => {
    // Check if script is already added
    if (document.getElementById('google-translate-script')) return;

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi,mr,ta,te,as,bn,gu,kn,ml,or,pa', // English, Hindi, Marathi, Tamil, Telugu, Assamese, Bengali, Gujarati, Kannada, Malayalam, Oriya, Punjabi
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };
  }, []);

  return (
    <div className="language-switcher">
      <div id="google_translate_element"></div>
      <style jsx global>{`
        .language-switcher {
          display: flex;
          align-items: center;
        }
        
        /* Hide Google Translate Top Bar */
        .goog-te-banner-frame.skiptranslate {
            display: none !important;
        } 
        body {
            top: 0px !important; 
        }

        /* Customize the dropdown */
        .goog-te-gadget-simple {
          background-color: transparent !important;
          border: none !important;
          padding: 0 !important;
          margin: 0 !important;
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
        }

        .goog-te-gadget-simple .goog-te-menu-value {
          color: white !important;
        }
        
        .goog-te-gadget-simple .goog-te-menu-value span {
          color: white !important;
          font-weight: 700 !important;
        }

        .goog-te-gadget-simple .goog-te-menu-value span {
          border-left: none !important;
        }
        
        .goog-te-gadget-icon {
            display: none !important;
        }
      `}</style>
    </div>
  );
}
