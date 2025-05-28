'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole, UserStatus } from '@/types/user';
import { theme } from '@/config/theme';
import {handle403Response} from "@/app/admin/errors/error403";

interface UserProfile {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  permissions?: {
    users: {
      read: boolean;
      write: boolean;
      update: boolean;
      delete: boolean;
    };
  };
  profile: {
    avatar?: string;
    preferences: {
      theme: string;
      twoFactorEnabled: boolean;
      emailFrequency: string;
    };
  };
  status: UserStatus;
  lastActivity: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/admin/profile', {
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.replace('/admin/login');
          return;
        }
        else if (response.status === 403) {
          const shouldRedirect = await handle403Response();
          if (shouldRedirect) {
            window.location.href = '/admin/login';
          }
          return;
        }
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    // TODO: Implement edit profile functionality
    console.log("Edit profile clicked for user:", user);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg" style={{ color: theme.colors.text.secondary }}>
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-500">
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg" style={{ color: theme.colors.text.secondary }}>
          No user data found
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: theme.colors.text.primary }}>
          Profile
        </h1>
        <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4" style={{ color: theme.colors.text.primary }}>
            Personal Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium" style={{ color: theme.colors.text.secondary }}>Full Name</label>
              <p className="mt-1">{user.firstName} {user.lastName}</p>
            </div>
            <div>
              <label className="text-sm font-medium" style={{ color: theme.colors.text.secondary }}>Email</label>
              <p className="mt-1">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium" style={{ color: theme.colors.text.secondary }}>Username</label>
              <p className="mt-1">{user.username}</p>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4" style={{ color: theme.colors.text.primary }}>
            Account Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium" style={{ color: theme.colors.text.secondary }}>Role</label>
              <p className="mt-1 capitalize">{user.role.toLowerCase().replace('_', ' ')}</p>
            </div>
            <div>
              <label className="text-sm font-medium" style={{ color: theme.colors.text.secondary }}>Account Status</label>
              <p className="mt-1 capitalize">{user.status.toLowerCase()}</p>
            </div>
            <div>
              <label className="text-sm font-medium" style={{ color: theme.colors.text.secondary }}>Last Activity</label>
              <p className="mt-1">{new Date(user.lastActivity).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4" style={{ color: theme.colors.text.primary }}>
            Preferences
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium" style={{ color: theme.colors.text.secondary }}>Theme</label>
              <p className="mt-1 capitalize">{user.profile.preferences.theme}</p>
            </div>
            <div>
              <label className="text-sm font-medium" style={{ color: theme.colors.text.secondary }}>Two-Factor Authentication</label>
              <p className="mt-1">{user.profile.preferences.twoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
            </div>
            <div>
              <label className="text-sm font-medium" style={{ color: theme.colors.text.secondary }}>Email Frequency</label>
              <p className="mt-1 capitalize">{user.profile.preferences.emailFrequency}</p>
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4" style={{ color: theme.colors.text.primary }}>
            Permissions
          </h2>
          <div className="space-y-4">
            {user.permissions?.users && (
              <div>
                <label className="text-sm font-medium" style={{ color: theme.colors.text.secondary }}>User Management</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(user.permissions.users).map(([permission, enabled]) => (
                    enabled && (
                      <span
                        key={permission}
                        className="px-2 py-1 text-xs rounded-full"
                        style={{ 
                          backgroundColor: theme.colors.background.highlight,
                          color: theme.colors.text.primary
                        }}
                      >
                        {permission}
                      </span>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleEditProfile}
          className="px-4 py-2 rounded transition-colors duration-200"
          style={{
            backgroundColor: theme.colors.primary,
            color: 'white',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.primaryHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.primary;
          }}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
} 