import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refresh_token');
            const storedUser = localStorage.getItem('user');

            if (token && refreshToken && storedUser) {
                try {
                    // Verify the token
                    await authAPI.verifyToken();
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    try {
                        // Try to refresh the token
                        const response = await authAPI.refreshToken();
                        localStorage.setItem('token', response.access);
                        setUser(JSON.parse(storedUser));
                    } catch (refreshError) {
                        // If refresh fails, clear all auth data
                        localStorage.removeItem('token');
                        localStorage.removeItem('refresh_token');
                        localStorage.removeItem('user');
                        setUser(null);
                    }
                }
            }
        };

        checkAuth();
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await authAPI.login(username, password);
            // The response should contain access and refresh tokens
            const { access, refresh } = response;

            // Store the tokens
            localStorage.setItem('token', access);
            localStorage.setItem('refresh_token', refresh);

            // Create a user object from the token payload
            const user: User = {
                id: response.user_id,
                username: username,
                email: response.email || '',
                role: response.role || 'user'
            };

            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
