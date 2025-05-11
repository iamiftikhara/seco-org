'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { theme } from '@/config/theme';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple check - replace with actual authentication
    if (username === 'admin' && password === 'admin123') {
      // Set a simple session flag
      sessionStorage.setItem('isAdminLoggedIn', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid credentials');
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
              color: theme.colors.text.light
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primaryHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary;
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}