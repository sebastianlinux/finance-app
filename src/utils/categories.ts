import { TransactionType } from '@/types';

// Category keys for translation
export const getCategoryKeys = (type: TransactionType): string[] => {
  if (type === 'income') {
    return ['salary', 'freelance', 'investment', 'other'];
  }
  
  return ['food', 'transport', 'shopping', 'bills', 'entertainment', 'health', 'education', 'other'];
};

export const getAllCategoryKeys = (): string[] => {
  return ['food', 'transport', 'shopping', 'bills', 'entertainment', 'health', 'education', 'salary', 'freelance', 'investment', 'other'];
};

// Map of translated values to keys (for backward compatibility)
// This helps migrate old data that was stored as translated strings
const categoryValueToKey: Record<string, string> = {
  // English
  'Food': 'food',
  'Transport': 'transport',
  'Shopping': 'shopping',
  'Bills': 'bills',
  'Entertainment': 'entertainment',
  'Health': 'health',
  'Education': 'education',
  'Salary': 'salary',
  'Freelance': 'freelance',
  'Investment': 'investment',
  'Other': 'other',
  // Spanish
  'Comida': 'food',
  'Transporte': 'transport',
  'Compras': 'shopping',
  'Facturas': 'bills',
  'Entretenimiento': 'entertainment',
  'Salud': 'health',
  'Educación': 'education',
  'Salario': 'salary',
  'Inversión': 'investment',
  'Otro': 'other',
  // Note: 'Freelance' is the same in both languages, so it's only in English section
};

/**
 * Normalizes a category value to a key.
 * If it's already a key, returns it. If it's a translated value, returns the corresponding key.
 */
export const normalizeCategoryToKey = (category: string): string => {
  // Check if it's already a key
  if (getAllCategoryKeys().includes(category)) {
    return category;
  }
  // Check if it's a translated value and return the key
  return categoryValueToKey[category] || category;
};
