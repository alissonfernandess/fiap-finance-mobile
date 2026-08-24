import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

const USER_STORAGE_KEY =
  '@finance-mobile:user-name';

interface UserContextValue {
  userName: string;
  isUserLoaded: boolean;
  saveUserName: (name: string) => Promise<void>;
  clearUser: () => Promise<void>;
}

const UserContext =
  createContext<UserContextValue | undefined>(
    undefined,
  );

export function UserProvider({
  children,
}: PropsWithChildren) {
  const [userName, setUserName] = useState('');
  const [isUserLoaded, setIsUserLoaded] =
    useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const storedName = await AsyncStorage.getItem(
          USER_STORAGE_KEY,
        );

        if (storedName) {
          setUserName(storedName);
        }
      } catch (error) {
        console.error(
          'Erro ao carregar usuário:',
          error,
        );
      } finally {
        setIsUserLoaded(true);
      }
    }

    loadUser();
  }, []);

  const value = useMemo<UserContextValue>(
    () => ({
      userName,
      isUserLoaded,

      async saveUserName(name) {
        const formattedName = name.trim();

        await AsyncStorage.setItem(
          USER_STORAGE_KEY,
          formattedName,
        );

        setUserName(formattedName);
      },

      async clearUser() {
        await AsyncStorage.removeItem(
          USER_STORAGE_KEY,
        );

        setUserName('');
      },
    }),
    [userName, isUserLoaded],
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      'useUser deve ser usado dentro de UserProvider',
    );
  }

  return context;
}