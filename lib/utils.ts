import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import qs from "query-string";
import {BADGE_CRITERIA} from "@/constants";
import {BadgeCounts} from "@/types";

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
    console.log("Received date input:", date); // Log the input for debugging

    if (typeof date === 'string') {
        // Attempt to parse the date using the Date constructor
        date = new Date(date);
        console.log("Parsed date string to Date object:", date); // Log the parsed Date object
    }

    // Check if the date is a valid Date object
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        console.error('Invalid Date object:', date); // Enhanced error logging
        return 'Invalid date'; // Return a user-friendly message instead of throwing an error
    }

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    return date.toLocaleDateString('en-US', options);
}


interface FormUrlQueryParams {
    params: string;
    key: string;
    value: string;
}

export const formUrlQuery = ({
                                 params,
                                 key,
                                 value
                             }: FormUrlQueryParams) => {
    const currentUrl = qs.parse(params);

    currentUrl[key] = value;

    return qs.stringifyUrl({
            url: window.location.pathname,
            query: currentUrl
        },
        {skipNull: true}
    )
}

interface RemoveKeyFromQueryParams {
    params: string;
    keysToRemove: string[];
}

export const removeKeyFromQuery = ({
                                       params,
                                       keysToRemove
                                   }: RemoveKeyFromQueryParams) => {
    const currentUrl = qs.parse(params);

    keysToRemove.forEach(key => {
        delete currentUrl[key];
    })

    return qs.stringifyUrl({
            url: window.location.pathname,
            query: currentUrl
        },
        {skipNull: true}
    )
}


interface BadgeParam {
    criteria: {
        type: keyof typeof BADGE_CRITERIA;
        count: number;
    }[]
}

export const assignBadges = (params: BadgeParam) => {
    const badgeCounts: BadgeCounts = {
        GOLD: 0,
        SILVER: 0,
        BRONZE: 0,
    }

    const { criteria } = params;

    criteria.forEach((item) => {
        const { type, count } = item;
        const badgeLevels: any = BADGE_CRITERIA[type];

        Object.keys(badgeLevels).forEach((level: any) => {
            if(count >= badgeLevels[level]) {
                badgeCounts[level as keyof BadgeCounts] +=1 ;
            }
        })
    })

    return badgeCounts;
}