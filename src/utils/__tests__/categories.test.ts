import { describe, it, expect } from 'vitest';
import {
  getCategoryKeys,
  getAllCategoryKeys,
  normalizeCategoryToKey,
} from '../categories';

describe('getCategoryKeys', () => {
  it('should return income categories for income type', () => {
    const categories = getCategoryKeys('income');
    expect(categories).toContain('salary');
    expect(categories).toContain('freelance');
    expect(categories).toContain('investment');
    expect(categories).toContain('other');
    expect(categories.length).toBe(4);
  });

  it('should return expense categories for expense type', () => {
    const categories = getCategoryKeys('expense');
    expect(categories).toContain('food');
    expect(categories).toContain('transport');
    expect(categories).toContain('shopping');
    expect(categories).toContain('bills');
    expect(categories).toContain('entertainment');
    expect(categories).toContain('health');
    expect(categories).toContain('education');
    expect(categories).toContain('other');
    expect(categories.length).toBe(8);
  });
});

describe('getAllCategoryKeys', () => {
  it('should return all category keys', () => {
    const allCategories = getAllCategoryKeys();
    expect(allCategories).toContain('food');
    expect(allCategories).toContain('salary');
    expect(allCategories).toContain('other');
    expect(allCategories.length).toBeGreaterThan(0);
  });

  it('should include both income and expense categories', () => {
    const allCategories = getAllCategoryKeys();
    const incomeCategories = ['salary', 'freelance', 'investment'];
    const expenseCategories = ['food', 'transport', 'shopping'];
    
    incomeCategories.forEach(cat => {
      expect(allCategories).toContain(cat);
    });
    
    expenseCategories.forEach(cat => {
      expect(allCategories).toContain(cat);
    });
  });
});

describe('normalizeCategoryToKey', () => {
  it('should return the key if already a key', () => {
    expect(normalizeCategoryToKey('food')).toBe('food');
    expect(normalizeCategoryToKey('salary')).toBe('salary');
    expect(normalizeCategoryToKey('other')).toBe('other');
  });

  it('should normalize English translated values to keys', () => {
    expect(normalizeCategoryToKey('Food')).toBe('food');
    expect(normalizeCategoryToKey('Transport')).toBe('transport');
    expect(normalizeCategoryToKey('Salary')).toBe('salary');
    expect(normalizeCategoryToKey('Other')).toBe('other');
  });

  it('should normalize Spanish translated values to keys', () => {
    expect(normalizeCategoryToKey('Comida')).toBe('food');
    expect(normalizeCategoryToKey('Transporte')).toBe('transport');
    expect(normalizeCategoryToKey('Salario')).toBe('salary');
    expect(normalizeCategoryToKey('Otro')).toBe('other');
  });

  it('should return original value if not found in mapping', () => {
    expect(normalizeCategoryToKey('unknown-category')).toBe('unknown-category');
  });
});
