import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 30) + 70;
  const lightness = Math.floor(Math.random() * 15) + 80;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
