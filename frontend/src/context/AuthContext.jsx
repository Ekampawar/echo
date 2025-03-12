import { createContext, useContext, useState } from 'react';

// Creating the AuthContext to hold the authentication state
export const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component that wraps the app to provide context to the children
export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);  // Holds user data
  const [loading, setLoading] = useState(true);    // Tracks loading state

  return (
    <AuthContext.Provider value={{ user: userData, loading, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
