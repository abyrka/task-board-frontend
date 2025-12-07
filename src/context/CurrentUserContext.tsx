import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface CurrentUserContextType {
  currentUser: { _id: string; name: string; email: string } | null;
  setCurrentUser: (user: { _id: string; name: string; email: string } | null) => void;
}

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

export const CurrentUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<{ _id: string; name: string; email: string } | null>(null);

  // Load from cookies on mount
  useEffect(() => {
    const savedUser = Cookies.get('currentUser');
    if (savedUser) {
      try {
        setCurrentUserState(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
  }, []);

  const setCurrentUser = (user: { _id: string; name: string; email: string } | null) => {
    setCurrentUserState(user);
    if (user) {
      Cookies.set('currentUser', JSON.stringify(user), { expires: 7 });
    } else {
      Cookies.remove('currentUser');
    }
  };

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext);
  if (context === undefined) {
    throw new Error('useCurrentUser must be used within CurrentUserProvider');
  }
  return context;
};
