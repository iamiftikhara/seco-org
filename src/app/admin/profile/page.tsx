'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/user';

interface AdminSessionData {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions?: {
    users: {
      read: boolean;
      write: boolean;
      update: boolean;
      delete: boolean;
    };
  };
  lastActivity: string;
  language?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<AdminSessionData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const adminSession = sessionStorage.getItem('adminSession');
    if (!adminSession) {
      console.log("No admin session found, redirecting to login.");
      router.replace('/admin/login');
      return;
    }
    try {
      const sessionData = JSON.parse(adminSession);
      console.log("Admin session data (Profile Page):", sessionData);
      setUser(sessionData);
    } catch (error) {
      console.error("Error parsing admin session:", error);
      router.replace('/admin/login');
    }
  }, [router]);

  const handleEditProfile = () => {
    // (For now, just log a message. In a real scenario, you'd open a modal or navigate to an edit page.)
    console.log("Edit profile clicked for user:", user);
  };

  if (!user) {
    return <div>Loading…</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>User Profile</h1>
      <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '1rem' }}>
        <p><strong>User ID:</strong> {user.userId}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Role:</strong> {user.role ? user.role.toLowerCase().replace('_', ' ') : ''}</p>
        {user.permissions?.users && (
          <p><strong>Permissions (users):</strong> {Object.entries(user.permissions.users).filter(([_, v]) => v).map(([k]) => k).join(', ')}</p>
        )}
        <p><strong>Last Activity:</strong> {user.lastActivity}</p>
        {user.language && <p><strong>Language:</strong> {user.language}</p>}
      </div>
      <button
        onClick={handleEditProfile}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Edit Profile
      </button>
    </div>
  );
} 