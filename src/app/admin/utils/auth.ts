'use client';

import { redirect } from 'next/navigation';

/**
 * Checks if code is running on client side
 */
const isClient = () => typeof window !== 'undefined';

/**
 * Gets the base URL for API calls
 */
const getApiUrl = (path: string): string => {
  if (isClient()) {
    return `${window.location.origin}${path}`;
  }
  // Server-side: use absolute URL with environment variables
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = process.env.VERCEL_URL || 'localhost:3000';
  return `${protocol}://${host}${path}`;
};

/**
 * Clears session storage if running on client side
 */
const clearSessionStorage = () => {
  if (isClient()) {
    sessionStorage.removeItem('adminSession');
    sessionStorage.removeItem('isAdminLoggedIn');
  }
};


/**
 * Handles the complete logout process including:
 * - Calling the logout API to clear cookies
 * - Clearing session storage (only on client side)
 * - Returns success status
 * 
 * @returns Promise<boolean> - Returns true if logout was successful
 */
export const handleLogout = async (): Promise<boolean> => {
  try {
    // Call logout API with full URL
    const response = await fetch(getApiUrl('/api/admin/logout'), {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    // Clear session storage (only on client side)
    clearSessionStorage();

    return true;
  } catch (error) {
    console.error('Logout error:', error);
    
    // Still clear session storage even if API fails (only on client side)
    clearSessionStorage();
    
    return false;
  }
}; 