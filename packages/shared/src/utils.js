/**
 * @file utils.js
 * @description Shared utility functions
 * @keywords utils, helpers, utilities, functions, common
 * 
 * Search tags:
 * - format: formatting dates, numbers, strings
 * - validate: validation helpers
 * - parse: parsing data
 * - calculate: math operations
 */

// @keywords: date-format, format-date, display-date
export const formatDate = (date, format = 'short') => {
    if (!date) return '';
    const d = new Date(date);

    if (format === 'short') {
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    if (format === 'long') {
        return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }
    if (format === 'time') {
        return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    }
    return d.toISOString();
};

// @keywords: relative-time, time-ago, ago
export const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
        }
    }
    return 'just now';
};

// @keywords: truncate-text, shorten, ellipsis
export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};

// @keywords: capitalize, title-case, format-name
export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// @keywords: slugify, url-safe, slug
export const slugify = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
};

// @keywords: validate-email, email-check, email-regex
export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// @keywords: validate-phone, phone-check, indian-phone
export const isValidIndianPhone = (phone) => {
    const regex = /^(\+91)?[6-9]\d{9}$/;
    return regex.test(phone.replace(/\s/g, ''));
};

// @keywords: calculate-match, match-percentage, score
export const calculateMatchScore = (candidateSkills, requiredSkills) => {
    if (!requiredSkills || !candidateSkills) return 0;
    const matched = candidateSkills.filter(skill =>
        requiredSkills.some(req => req.toLowerCase() === skill.toLowerCase())
    );
    return Math.round((matched.length / requiredSkills.length) * 100);
};

// @keywords: format-currency, money, inr, rupees
export const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(amount);
};

// @keywords: format-number, lakhs, crores, indian-format
export const formatIndianNumber = (num) => {
    if (num >= 10000000) return (num / 10000000).toFixed(1) + ' Cr';
    if (num >= 100000) return (num / 100000).toFixed(1) + ' L';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};

// @keywords: debounce, throttle, performance
export const debounce = (func, wait = 300) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

// @keywords: generate-id, unique-id, uuid
export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// @keywords: parse-skills, skills-array, extract-skills
export const parseSkills = (skillsInput) => {
    if (Array.isArray(skillsInput)) return skillsInput;
    if (typeof skillsInput === 'string') {
        return skillsInput.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
};
