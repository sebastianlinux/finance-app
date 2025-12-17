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
