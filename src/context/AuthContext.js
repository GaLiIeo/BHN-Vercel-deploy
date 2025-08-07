import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

// Demo users for testing
const demoUsers = [
    {
        id: '123',
        email: 'patient@example.com',
        token: 'password123',
        directorName: 'John Doe',
        fullName: 'John Doe',
        userType: 'patient',
        healthcareDomain: 'General'
    },
    {
        id: '456',
        email: 'doctor@example.com',
        token: 'password123',
        directorName: 'Dr. Sarah Johnson',
        fullName: 'Sarah Johnson',
        userType: 'provider',
        healthcareDomain: 'Pediatrics'
    }
];

// Provider component
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if user is already logged in on component mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setCurrentUser(user);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    // Login function
    const login = async (email, token, directorName) => {
        try {
            // Check if email and token match a demo user
            const user = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (!user) {
                return {
                    success: false,
                    error: 'User not found. Use demo credentials: doctor@example.com / password123'
                };
            }

            if (user.token !== token) {
                return {
                    success: false,
                    error: 'Invalid token. Use demo credentials: doctor@example.com / password123'
                };
            }

            // In a real app, we would also validate the director name
            // For demo purposes, we'll just check if it's not empty
            if (!directorName) {
                return {
                    success: false,
                    error: 'Director name is required'
                };
            }

            // Remove token before storing in state or localStorage
            const { token: _, ...userWithoutToken } = user;

            // Store user in localStorage
            localStorage.setItem('user', JSON.stringify(userWithoutToken));

            // Update state
            setCurrentUser(userWithoutToken);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to login'
            };
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            // In a real app, you would make an API call here
            // For demo purposes, we'll simulate a successful registration

            // Check if email already exists
            const existingUser = demoUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
            if (existingUser) {
                return {
                    success: false,
                    error: 'Email already in use. Try logging in instead.'
                };
            }

            const newUser = {
                id: Date.now().toString(),
                ...userData,
                userType: userData.userType || 'patient'
            };

            // Remove password before storing in state or localStorage
            const { token: _, ...userWithoutPassword } = newUser;

            // Store user in localStorage
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));

            // Update state
            setCurrentUser(userWithoutPassword);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to register'
            };
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('user');
        setCurrentUser(null);
        setIsAuthenticated(false);
    };

    // Reset password function
    const resetPassword = async (email) => {
        try {
            // Check if email exists
            const user = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (!user) {
                return {
                    success: false,
                    error: 'Email not found. Use demo email: patient@example.com'
                };
            }

            // In a real app, you would send a password reset email
            return {
                success: true,
                message: 'Password reset email sent'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to reset password'
            };
        }
    };

    // Update profile function
    const updateProfile = async (userData) => {
        try {
            // In a real app, you would make an API call here
            // For demo purposes, we'll simulate a successful profile update
            const updatedUser = {
                ...currentUser,
                ...userData
            };

            // Store updated user in localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Update state
            setCurrentUser(updatedUser);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to update profile'
            };
        }
    };

    const value = {
        currentUser,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        resetPassword,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext; 