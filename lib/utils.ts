import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getTimeStamp = (createdAt: string | Date): string => {
  const now = new Date();
  const createdAtDate = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;

  if (!(createdAtDate instanceof Date) || isNaN(createdAtDate.getTime())) {
    console.error('Invalid date:', createdAt);
    return 'Invalid date';
  }

  const diff = now.getTime() - createdAtDate.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
}

export const formatLargeNumber = (num: number | undefined): string => {
  if (num === undefined || isNaN(num)) {
    return '0';
  }

  const absNum = Math.abs(num);

  if (absNum >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (absNum >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
}

export function formatJoinDate(date: Date | string): string {
  // Convert string to Date if necessary
  if (typeof date === 'string') {
    date = new Date(date);
  }

  // Check if the input is a valid Date object
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid Date object");
  }

  // Define options for formatting
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  // Format the date using the options
  return date.toLocaleDateString('en-US', options);
}
