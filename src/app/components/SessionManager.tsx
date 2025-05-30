'use client';

import { useEffect } from 'react';
import Cookies from 'js-cookie';

export default function SessionManager() {
  useEffect(() => {
    // Check if session_id exists
    const sessionId = Cookies.get('session_id');
    
    if (!sessionId) {
      // Generate a new session ID if none exists
      const newSessionId = Math.random().toString(36).substring(2, 15);
      // Set cookie with 30 days expiry
      Cookies.set('session_id', newSessionId, { expires: 30 });
    }
  }, []);

  return null; // This component doesn't render anything
}