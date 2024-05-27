import React, { createContext, isValidElement, useContext } from 'react';
import reactStringReplace from 'react-string-replace';
import { useLocalStorage } from '../hooks/useLocalStorage';
import translations from '../locales';

/**
* @typedef TranslationContext
* @type {object}
    * @property {string} language
    * @property {React.Dispatch<React.SetStateAction<string>>} changeLanguage
    * @property {string[]} languages,
    * @property {(key: string) => null} t
*/

/** @type {TranslationContext} */
const initial = {
    language: 'en',
    changeLanguage: () => null,
    languages: [],
    t: () => null
}
const TranslationContext = createContext(initial)

export function useTranslations() {
    return useContext(TranslationContext)
}

export function TranslationProvider({ children }) {
    const [language, changeLanguage] = useLocalStorage('language', 'en');
    const languages = Object.keys(translations);
    document.t = translations;

    const t = (string, targetLang = language, ...variables) => {
        if (typeof string !== "string") return string;
        if (targetLang === null) {
            targetLang = language;
        }

        let translation = translations[targetLang]?.[string.toLowerCase()];

        // Fall back to english if translation is missing
        if (!translation) {
            translation = translations['en']?.[string.toLowerCase()];
        }

        // Fall back to original string if translation is missing
        if (!translation) {
            translation = string;
        }

        if (!variables.length) return translation;

        variables.forEach((text, index) => {
            if (!isValidElement(text)) {
                translation = translation.replace(`$${index}`, text);
            } else {
                // Text is react component
                translation = reactStringReplace(translation, `$${index}`, match => text);
            }
        })
        return translation
    };

    return (
        <TranslationContext.Provider value={{ language, changeLanguage, languages, t }}>
            {children}
        </TranslationContext.Provider>
    )
}
