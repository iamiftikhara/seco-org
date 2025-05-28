'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import PageLoader from '../components/PageLoader';
import PageError from '../components/PageError'; // Import the new PageError component

type LoadingContextType = {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isError: boolean;
  setError: (error: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setIsLoading: () => void 0,
  isError: false,
  setError: () => void 0
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setError] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if the current route is an admin route
    if (pathname.startsWith('/admin')) {
      setIsLoading(false);
      setError(false);
    } else {
      setIsLoading(true);
      setError(false);
      // Removed the setTimeout here. The loading state will now only be set to false
      // by components that consume the useLoading hook, like the Navbar.
    }
  }, [pathname]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, isError, setError }}>
      {isLoading && <PageLoader />}
      {isError && <PageError />}
      {!isError && children}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => useContext(LoadingContext);