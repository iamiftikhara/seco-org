'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { theme } from '@/config/theme';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // Important for handling cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store the user data in session storage
      const sessionData = {
        userId: data.user.userId,
        username: data.user.username,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        role: data.user.role,
        permissions: data.user.permissions,
        lastActivity: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
      };

      // Store session data and trigger event
      sessionStorage.setItem('adminSession', JSON.stringify(sessionData));
      sessionStorage.setItem('isAdminLoggedIn', 'true');
      
      // Dispatch event after ensuring data is stored
      // window.dispatchEvent(new Event('adminSessionSet'));

      setTimeout(() => {
        // router.push('/admin/dashboard');
        window.location.href = '/admin/dashboard';
        console.log('Redirecting to /admin/dashboard'); // Debugging log for redirectio
      }, 100);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
      // Clear any existing session data on error
      sessionStorage.removeItem('adminSession');
      sessionStorage.removeItem('isAdminLoggedIn');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: theme.colors.background.accent }}
    >
      <div 
        className="w-full max-w-md p-8 rounded-lg shadow-lg"
        style={{ backgroundColor: theme.colors.background.primary }}
      >
        <div className="text-center mb-8">
          <h1 
            className="text-3xl font-bold"
            style={{ color: theme.colors.text.primary }}
          >
            {theme.organization.logoTitle.title.text}
          </h1>
          <p 
            className="mt-2"
            style={{ color: theme.colors.text.secondary }}
          >
            Admin Login
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div 
              className="p-3 rounded text-center mb-4"
              style={{ backgroundColor: `${theme.colors.status.error}20`, color: theme.colors.status.error }}
            >
              {error}
            </div>
          )}
          
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: theme.colors.text.primary }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded border focus:outline-none focus:ring-2"
              style={{ 
                borderColor: theme.colors.border.light,
                outlineOffset: theme.colors.primary
              }}
              required
            />
          </div>

          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: theme.colors.text.primary }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded border focus:outline-none focus:ring-2"
              style={{ 
                borderColor: theme.colors.border.light,
                outlineOffset: theme.colors.primary
              }}
              required
            />
          </div>

          
          <button
            type="submit"
            className="w-full py-2 rounded transition-colors duration-200"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.text.light,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}