import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Format a number as Dutch currency display
 */
export function formatPrice(price: number): string {
  return `€${price.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Parse Dutch currency string to number
 */
export function parsePrice(priceString: string): number {
  const cleanPrice = priceString.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(cleanPrice) || 0;
}

/**
 * Format number with Dutch thousands separator
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('nl-NL');
}

/**
 * Parse Dutch number string to integer
 */
export function parseNumber(numString: string): number {
  const cleanNum = numString.replace(/[^\d]/g, '');
  return parseInt(cleanNum) || 0;
}