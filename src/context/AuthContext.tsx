import { getCurrentAccount } from '@/lib/appwrite/api';
import { IContextType, IUser } from '@/types';
import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const INITIAL_USER = {
  id        : '',
  name      : '',
  username  : '',
  email     : '',
  imageUrl  : '',
  bio       : '',
}

export const INITIAL_AUTH = {
  user              : INITIAL_USER,
  isLoading         : false,
  isAuthenticated   : false,
  setUser           : () => {},
  setIsAuthenticated: () => {},
  checkAuthUser     : async () => false as boolean,
}

export const AuthContext = createContext<IContextType>(INITIAL_AUTH);

export const useUserContext = () => useContext(AuthContext);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if( 
      localStorage.getItem('cookieFallback') === '[]' ||
      localStorage.getItem('cookieFallback') === null 
    ) navigate('/sign-in');
    
    checkAuthUser();
  }, []);

  const checkAuthUser = async () => {
    try {
      
      const currentAccount = await getCurrentAccount();

      if (currentAccount) {
        setUser({
          id      : currentAccount.$id,
          name    : currentAccount.name,
          username: currentAccount.username,
          email   : currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio     : currentAccount.bio,
        });
        setIsAuthenticated(true);
        return true;
      }

      return false;

    } catch (error) {
      console.log('Error @checkAuthUser: ', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        setUser, 
        isLoading, 
        isAuthenticated, 
        setIsAuthenticated,  
        checkAuthUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;


