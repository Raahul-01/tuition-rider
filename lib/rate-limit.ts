// Constants for rate limiting
const DEFAULT_MAX_ATTEMPTS = 5;
const DEFAULT_WINDOW_MINUTES = 15;

interface RateLimitData {
  attempts: number;
  resetTime: number;
}

// Get current rate limit data
const getRateLimitData = (key: string): RateLimitData => {
  const data = localStorage.getItem(`rateLimit:${key}`);
  return data ? JSON.parse(data) : { attempts: 0, resetTime: Date.now() };
};

// Save rate limit data
const saveRateLimitData = (key: string, data: RateLimitData): void => {
  try {
    localStorage.setItem(`rateLimit:${key}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving rate limit data:', error);
  }
};

/**
 * Simple rate limiting implementation using localStorage
 * @param key - Unique key for the rate limit
 * @param maxAttempts - Maximum number of attempts allowed
 * @param windowMs - Time window in milliseconds
 * @returns boolean - True if rate limited, false otherwise
 */
export const rateLimit = async (
  key: string,
  maxAttempts: number,
  windowMs: number
): Promise<boolean> => {
  const isLimited = checkRateLimit(key, maxAttempts);
  if (!isLimited) {
    incrementFailedAttempts(key, windowMs / (60 * 1000));
  }
  return isLimited;
};

/**
 * Check if rate limit is exceeded
 * @param key - Unique key for the rate limit
 * @param maxAttempts - Maximum number of attempts allowed
 * @returns boolean - True if not rate limited, false if rate limited
 */
export const checkRateLimit = (key: string, maxAttempts = DEFAULT_MAX_ATTEMPTS): boolean => {
  const data = getRateLimitData(key);
  if (Date.now() > data.resetTime) {
    return false;
  }
  return data.attempts >= maxAttempts;
};

/**
 * Increment failed attempts
 * @param key - Unique key for the rate limit
 * @param windowMinutes - Time window in minutes
 */
export const incrementFailedAttempts = (key: string, windowMinutes = DEFAULT_WINDOW_MINUTES): void => {
  const data = getRateLimitData(key);
  const newData = {
    attempts: data.attempts + 1,
    resetTime: data.resetTime || Date.now() + windowMinutes * 60 * 1000
  };
  saveRateLimitData(key, newData);
};

/**
 * Reset rate limiting for a key
 * @param key - Unique key for the rate limit
 */
export const resetRateLimit = (key: string): void => {
  localStorage.removeItem(`rateLimit:${key}`);
};

/**
 * Get remaining attempts for a rate limit
 * @param key - Unique key for the rate limit
 * @param maxAttempts - Maximum number of attempts allowed
 * @returns number - Number of attempts remaining
 */
export const getRemainingAttempts = (key: string, maxAttempts: number): number => {
  try {
    const data = getRateLimitData(key);
    if (data.resetTime < Date.now()) {
      return maxAttempts;
    }
    return Math.max(0, maxAttempts - data.attempts);
  } catch (error) {
    console.error('Error getting remaining attempts:', error);
    return maxAttempts;
  }
};

/**
 * Get time remaining in rate limit window
 * @param key - Unique key for the rate limit
 * @returns number - Time remaining in milliseconds
 */
export const getTimeRemaining = (key: string): number => {
  try {
    const data = getRateLimitData(key);
    return Math.max(0, data.resetTime - Date.now());
  } catch (error) {
    console.error('Error getting time remaining:', error);
    return 0;
  }
}; 