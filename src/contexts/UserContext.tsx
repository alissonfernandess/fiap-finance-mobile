import {
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  firebaseAuth,
  firestore,
} from '@/services/firebase';

interface UserContextValue {
  firebaseUser: User | null;
  userName: string;
  isUserLoaded: boolean;
  isAuthenticated: boolean;

  registerUser: (
  name: string,
  phone: string,
  email: string,
  password: string,
) => Promise<void>;

  loginUser: (
    email: string,
    password: string,
  ) => Promise<void>;

  saveUserName: (name: string) => Promise<void>;
  clearUser: () => Promise<void>;
}

const UserContext =
  createContext<UserContextValue | undefined>(
    undefined,
  );

function getUserName(user: User | null) {
  if (!user) {
    return '';
  }

  if (user.displayName) {
    return user.displayName;
  }

  if (user.email) {
    return user.email.split('@')[0];
  }

  return 'Usuário';
}

export function UserProvider({
  children,
}: PropsWithChildren) {
  const [firebaseUser, setFirebaseUser] =
    useState<User | null>(null);

  const [userName, setUserName] =
    useState('');

  const [isUserLoaded, setIsUserLoaded] =
    useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      (user) => {
        setFirebaseUser(user);
        setUserName(getUserName(user));
        setIsUserLoaded(true);
      },
      (error) => {
        console.error(
          'Erro ao observar autenticação:',
          error,
        );

        setFirebaseUser(null);
        setUserName('');
        setIsUserLoaded(true);
      },
    );

    return unsubscribe;
  }, []);

  const value = useMemo<UserContextValue>(
    () => ({
      firebaseUser,
      userName,
      isUserLoaded,
      isAuthenticated: Boolean(firebaseUser),

      
      async registerUser(
        name,
        phone,
        email,
        password,
      ) {
        const formattedName = name.trim();
        const formattedPhone = phone.trim();
        const formattedEmail =
          email.trim().toLowerCase();

        const credential =
          await createUserWithEmailAndPassword(
            firebaseAuth,
            formattedEmail,
            password,
          );

        await updateProfile(credential.user, {
          displayName: formattedName,
        });

        await setDoc(
          doc(
            firestore,
            'users',
            credential.user.uid,
          ),
          {
            name: formattedName,
            phone: formattedPhone,
            email: formattedEmail,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
        );

        setFirebaseUser(credential.user);
        setUserName(formattedName);
      },

      async loginUser(email, password) {
        await signInWithEmailAndPassword(
          firebaseAuth,
          email.trim().toLowerCase(),
          password,
        );
      },

      async saveUserName(name) {
        const currentUser =
          firebaseAuth.currentUser;

        if (!currentUser) {
          throw new Error(
            'Nenhum usuário autenticado.',
          );
        }

        const formattedName = name.trim();

        await updateProfile(currentUser, {
          displayName: formattedName,
        });

        setUserName(formattedName);
      },

      async clearUser() {
        await signOut(firebaseAuth);
      },
    }),
    [
      firebaseUser,
      userName,
      isUserLoaded,
    ],
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