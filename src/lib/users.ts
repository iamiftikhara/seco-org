import { AdminUser } from '@/data/users';
import { adminUsers } from '@/data/users';
import { UserRole, UserStatus } from '@/types/user';
import bcrypt from 'bcrypt';

export async function createAdminUser(userData: Partial<AdminUser>): Promise<AdminUser> {
  // Generate unique ID
  const id = Date.now().toString();
  
  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password!, 10);

  // Create new user with default values
  const newUser: AdminUser = {
    id,
    username: userData.username!,
    password: hashedPassword,
    firstName: userData.firstName!,
    lastName: userData.lastName!,
    email: userData.email!,
    role: userData.role || UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    profile: {
      avatar: userData.profile?.avatar,
      preferences: {
        theme: 'light',
        twoFactorEnabled: false,
        emailFrequency: 'daily'
      },
      ...userData.profile
    },
    permissions: {
      users: {
        read: true,
        write: false,
        update: false,
        delete: false
      },
      ...userData.permissions
    },
    content: userData.content || [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Add to users array
  adminUsers.push(newUser);

  return newUser;
}

export async function findAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
  return adminUsers.find(user => user.username === username);
}

// Special version for middleware that excludes sensitive data
export async function findAdminUserByIdForMiddleware(id: string): Promise<Omit<AdminUser, 'password'> | undefined> {
  const user = adminUsers.find(user => user.id === id);
  if (!user) return undefined;

  // Create a safe user object without sensitive data
  const safeUser = {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    status: user.status,
    profile: user.profile,
    permissions: user.permissions,
    content: user.content,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };

  return safeUser;
}

export async function findAdminUserById(id: string): Promise<AdminUser | undefined> {
  return adminUsers.find(user => user.id === id);
}

export async function updateAdminUser(id: string, updates: Partial<AdminUser>): Promise<AdminUser | null> {
  const userIndex = adminUsers.findIndex(user => user.id === id);
  if (userIndex === -1) return null;

  const updatedUser = {
    ...adminUsers[userIndex],
    ...updates,
    updatedAt: new Date()
  };

  adminUsers[userIndex] = updatedUser;
  return updatedUser;
}

export async function deleteAdminUser(id: string): Promise<boolean> {
  const userIndex = adminUsers.findIndex(user => user.id === id);
  if (userIndex === -1) return false;

  adminUsers.splice(userIndex, 1);
  return true;
}


export async function validateAdminCredentials(username: string, password: string): Promise<{ user: AdminUser | null; error?: string; status?: UserStatus }> {
  try {
    const user = await findAdminUserByUsername(username);
    console.log('Found user:', !!user);
    
    if (!user) {
      console.log('User not found:', username);
      return { user: null, error: 'no-user' };
    }

    console.log('Stored password hash:', user.password);
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('Invalid password for user:', username);
      return { user: null, error: 'incorrect-pass' };
    }

    // Check if user status is active
    if (user.status !== UserStatus.ACTIVE) {
      console.log('User account is not active:', user.status);
      return { 
        user: null, 
        error: 'status', 
        status: user.status // Return the actual UserStatus enum value
      };
    }

    return { user };
  } catch (error) {
    console.error('Error validating credentials:', error);
    return { user: null, error: 'internal' };
  }
}