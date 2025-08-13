import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  sessionExpiry?: number; // Added for session management
}

interface GameStats {
  gameId: string;
  gameName: string;
  timesPlayed: number;
  lastPlayed?: Date;
  highScore?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  signup: (username: string, email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  userExists: (email: string) => boolean;
  gameStats: GameStats[];
  updateGameStats: (gameId: string, gameName: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [gameStats, setGameStats] = useState<GameStats[]>([]);
  const [userAccounts, setUserAccounts] = useState<{ [key: string]: User }>({});

  // Load user, stats, and accounts from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedStats = localStorage.getItem('gameStats');
    const savedAccounts = localStorage.getItem('userAccounts');
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        
        // Check if session has expired
        if (userData.sessionExpiry && Date.now() > userData.sessionExpiry) {
          localStorage.removeItem('user');
          setUser(null);
        } else {
          setUser(userData);
        }
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    
    if (savedStats) {
      try {
        const parsedStats = JSON.parse(savedStats);
        // Check if stats are corrupted (unusually high numbers)
        const totalGames = parsedStats.reduce((total: number, stat: GameStats) => total + stat.timesPlayed, 0);
        if (totalGames > 1000) {
          localStorage.removeItem('gameStats');
          setGameStats([]);
        } else {
          setGameStats(parsedStats);
        }
      } catch (error) {
        localStorage.removeItem('gameStats');
        setGameStats([]);
      }
    }

    if (savedAccounts) {
      try {
        const parsedAccounts = JSON.parse(savedAccounts);
        setUserAccounts(parsedAccounts);
      } catch (error) {
        localStorage.removeItem('userAccounts');
        setUserAccounts({});
      }
    }
  }, []);

  // Save user and stats to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('gameStats', JSON.stringify(gameStats));
  }, [gameStats]);

  useEffect(() => {
    localStorage.setItem('userAccounts', JSON.stringify(userAccounts));
  }, [userAccounts]);

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
    // Check if user exists and password matches
    const existingUser = userAccounts[email];
    
    if (!existingUser) {
      return false; // User doesn't exist
    }
    
    // In a real app, you would hash and compare passwords
    // For now, we'll use a simple check (you should implement proper password hashing)
    if (existingUser.password !== password) {
      return false; // Wrong password
    }
    
    // Create session for existing user
    const sessionDuration = rememberMe ? (7 * 24 * 60 * 60 * 1000) : (24 * 60 * 60 * 1000);
    const userWithSession: User = {
      ...existingUser,
      sessionExpiry: Date.now() + sessionDuration
    };
    
    setUser(userWithSession);
    return true;
  };

  const signup = async (username: string, email: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
    if (username && email && password) {
      // Check if user already exists
      if (userAccounts[email]) {
        return false; // User already exists
      }
      
      const sessionDuration = rememberMe ? (7 * 24 * 60 * 60 * 1000) : (24 * 60 * 60 * 1000);
      const newUser: User = {
        id: Date.now().toString(), // Generate unique ID
        username: username,
        email: email,
        password: password,
        sessionExpiry: Date.now() + sessionDuration
      };
      
      // Store user account
      setUserAccounts(prev => ({
        ...prev,
        [email]: newUser
      }));
      
      // Log in the new user
      setUser(newUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    // Keep user accounts and game stats, just clear the current session
  };

  const updateGameStats = (gameId: string, gameName: string) => {
    setGameStats(prevStats => {
      const existingGame = prevStats.find(stat => stat.gameId === gameId);
      
      if (existingGame) {
        return prevStats.map(stat => 
          stat.gameId === gameId 
            ? { ...stat, timesPlayed: stat.timesPlayed + 1, lastPlayed: new Date() }
            : stat
        );
      } else {
        return [...prevStats, {
          gameId,
          gameName,
          timesPlayed: 1,
          lastPlayed: new Date()
        }];
      }
    });
  };

  const userExists = (email: string) => {
    return !!userAccounts[email];
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    userExists,
    gameStats,
    updateGameStats,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
