import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from './styles/GlobalStyles';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Home from './components/pages/public/Home';
import Team from './components/pages/public/Team';
import Project from './components/pages/public/Project';
import Login from './components/pages/auth/Login';
import Register from './components/pages/auth/Register';
import EnhancedDashboard from './components/pages/dashboard/EnhancedDashboard';
import ForgotPassword from './components/pages/auth/ForgotPassword';

import DoctorProfile from './components/pages/profiles/DoctorProfile';
import PatientProfile from './components/pages/profiles/PatientProfile';
import NotFound from './components/pages/public/NotFound';

// Common Components
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <GlobalStyles />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="team" element={<Team />} />
              <Route path="project" element={<Project />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
            </Route>
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <EnhancedDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor-profile"
              element={
                <ProtectedRoute allowedUserTypes={['doctor', 'provider', 'admin']}>
                  <DoctorProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient-profile"
              element={
                <ProtectedRoute allowedUserTypes={['patient', 'admin']}>
                  <PatientProfile />
                </ProtectedRoute>
              }
            />



            {/* 404 Not Found Route - Must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
