import { cookies } from 'next/headers';

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  
  // List of cookies to clear
  const cookiesToClear = [
    'jwt',
    'adminSession',
    'isAdminLoggedIn',
    'x-user-id',
    'x-user-role',
    'x-user-name'
  ];

  // Clear each cookie
  cookiesToClear.forEach(name => {
    cookieStore.set(name, '', {
      maxAge: 0,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  });
}
