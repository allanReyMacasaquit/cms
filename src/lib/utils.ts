import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formattedPrice = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'CAD',
});
