import { useTranslation } from 'react-i18next';
import { normalizeCategoryToKey } from './categories';

/**
 * Hook to translate category keys to current language
 */
export const useTranslateCategory = () => {
  const { t } = useTranslation();
  
  return (category: string): string => {
    const key = normalizeCategoryToKey(category);
    return t(`categories.${key}`);
  };
};

/**
 * Function version (for use outside React components)
 */
export const translateCategory = (category: string, t: (key: string) => string): string => {
  const key = normalizeCategoryToKey(category);
  return t(`categories.${key}`);
};
