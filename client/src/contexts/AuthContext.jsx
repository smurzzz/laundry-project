import { createContext, useContext, useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { loginRequest, registerRequest, registerAdminRequest, googleAuthRequest } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('cw_token'));

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser({ id: decoded.id, email: decoded.email, role: decoded.role });
        } else {
          localStorage.removeItem('cw_token');
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        localStorage.removeItem('cw_token');
        setToken(null);
      }
    }
  }, [token]);

  const login = async (credentials) => {
    const data = await loginRequest(credentials);
    localStorage.setItem('cw_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const data = await registerRequest(payload);
    localStorage.setItem('cw_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const registerAdmin = async (payload) => {
    const data = await registerAdminRequest(payload);
    localStorage.setItem('cw_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const googleSignIn = async (tokenId) => {
    const data = await googleAuthRequest(tokenId);
    localStorage.setItem('cw_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('cw_token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, registerAdmin, googleSignIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

