/**
 * Handles 403 Forbidden responses by clearing session storage and redirecting to login
 * @param response The API response to check
 * @returns true if handled as 403, false otherwise
 */
export async function handle403Response(response: Response): Promise<boolean> {
  if (response.status === 403) {
    const data = await response.json();
    
    // Clear session storage
    sessionStorage.clear();
    
    // If the response indicates we should redirect
      window.location.href = '/admin/login';

    
    return true;
  }
  
  return false;
} 