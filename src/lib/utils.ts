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

export function formatDate(dateString: string): string {
  const inputDate = new Date(dateString);
  const currentDate = new Date();

  const diffMs = currentDate.getTime() - inputDate.getTime();

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    return `today`;
  } else if (diffDays < 30) {
    return `${diffDays} days ago`;
  } else {
    const diffMonths =
      currentDate.getMonth() -
      inputDate.getMonth() +
      12 * (currentDate.getFullYear() - inputDate.getFullYear());

    if (diffMonths < 12) {
      return `${diffMonths} months ago`;
    } else {
      const diffYears = Math.floor(diffMonths / 12);
      return `${diffYears} years ago`;
    }
  }
}

export function formatDateToVerboseString(date: Date): string {
  const day = date.getDate();
  let daySuffix = 'th';
  if (day === 1 || day === 21 || day === 31) {
    daySuffix = 'st';
  } else if (day === 2 || day === 22) {
    daySuffix = 'nd';
  } else if (day === 3 || day === 23) {
    daySuffix = 'rd';
  }
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  // Check if the year is the current year
  const currentYear = new Date().getFullYear();
  const yearSuffix = year !== currentYear ? ` ${year}` : '';

  return `${day}${daySuffix} ${month}${yearSuffix}`;
}
