'use client';

import * as React from 'react';
import { Languages } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SWISS_LANGUAGES } from '@/lib/utils';

interface LanguageSelectorProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function LanguageSelector({
  variant = 'outline',
  size = 'icon',
  className,
}: LanguageSelectorProps) {
  const [currentLanguage, setCurrentLanguage] = React.useState('de-CH');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    // Get language from localStorage or browser
    const saved = localStorage?.getItem('swiss-rental-language');
    if (saved) {
      setCurrentLanguage(saved);
    } else {
      // Detect browser language and match to Swiss locale
      const browserLang = navigator.language;
      const matchedLang = SWISS_LANGUAGES.find((lang) =>
        browserLang.startsWith(lang.code.split('-')[0]),
      );
      if (matchedLang) {
        setCurrentLanguage(matchedLang.code);
      }
    }
  }, []);

  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    localStorage?.setItem('swiss-rental-language', languageCode);

    // Here you would typically trigger a language change in your i18n system
    // For now, we'll just store the preference
    console.log(`Language changed to: ${languageCode}`);
  };

  const currentLang = SWISS_LANGUAGES.find((lang) => lang.code === currentLanguage);
  const shortCode = currentLang?.code.split('-')[0].toUpperCase() || 'DE';

  if (!mounted) {
    return (
      <Button variant={variant} size={size} className={className}>
        <Languages className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className} aria-label="Select language">
          {size === 'icon' ? (
            <>
              <Languages className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Select language</span>
            </>
          ) : (
            <>
              <Languages className="mr-2 h-4 w-4" />
              <span>{shortCode}</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {SWISS_LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={currentLanguage === language.code ? 'bg-accent text-accent-foreground' : ''}
          >
            <span className="mr-3 font-mono text-xs">
              {language.code.split('-')[0].toUpperCase()}
            </span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Hook to get current language
 */
export function useLanguage() {
  const [language, setLanguage] = React.useState('de-CH');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const saved = localStorage?.getItem('swiss-rental-language');
    if (saved) {
      setLanguage(saved);
    }

    // Listen for language changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'swiss-rental-language' && e.newValue) {
        setLanguage(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage?.setItem('swiss-rental-language', newLanguage);
  };

  return {
    language,
    changeLanguage,
    mounted,
    currentLang: SWISS_LANGUAGES.find((lang) => lang.code === language),
  };
}

/**
 * Simple text component that renders based on current language
 */
interface TranslatedTextProps {
  translations: Record<string, string>;
  fallback?: string;
  className?: string;
}

export function TranslatedText({ translations, fallback = '', className }: TranslatedTextProps) {
  const { language, mounted } = useLanguage();

  if (!mounted) {
    return <span className={className}>{fallback}</span>;
  }

  const text = translations[language] || translations['de-CH'] || fallback;

  return <span className={className}>{text}</span>;
}
