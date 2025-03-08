export function checkRateLimit(key: string, maxAttempts?: number): boolean;
export function incrementFailedAttempts(key: string, windowMinutes?: number): void;
export function resetRateLimit(key: string): void;
export function rateLimit(key: string, maxAttempts: number, windowMs: number): Promise<boolean>; 