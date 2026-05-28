import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 NEW

  // INIT AUTH ON REFRESH
  useEffect(() => {

    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {

      setToken(storedToken);
      setUser(JSON.parse(storedUser));

    } else {

      setToken(null);
      setUser(null);
    }

    setLoading(false); // 👈 IMPORTANT

  }, []);

  const login = (userData, tokenData) => {

    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    setToken(tokenData);
  };

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      loading, // 👈 expose loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);