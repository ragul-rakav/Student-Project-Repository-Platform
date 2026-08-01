import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';

import Shell from './components/layout/Shell';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { Toast } from './components/common/Toast';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import IdeasPage from './pages/IdeasPage';
import CollaborationPage from './pages/CollaborationPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ReviewsPage from './pages/ReviewsPage';
import GuidesPage from './pages/GuidesPage';
import ProfilePage from './pages/ProfilePage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminCenterPage from './pages/AdminCenterPage';
import NotFoundPage from './pages/NotFoundPage';

function ToastWrapper() {
  const { toast } = useApp();
  return <Toast message={toast} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Shell>
                    <DashboardPage />
                  </Shell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Shell>
                    <ProjectsPage />
                  </Shell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ideas"
              element={
                <ProtectedRoute>
                  <Shell>
                    <IdeasPage />
                  </Shell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/collaboration"
              element={
                <ProtectedRoute>
                  <Shell>
                    <CollaborationPage />
                  </Shell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Shell>
                    <LeaderboardPage />
                  </Shell>
                </ProtectedRoute>
              }
            />

            {/* Role-Specific Protected Routes */}
            <Route
              path="/reviews"
              element={
                <ProtectedRoute allowedRoles={['Faculty', 'Administrator']}>
                  <Shell>
                    <ReviewsPage />
                  </Shell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/guides"
              element={
                <ProtectedRoute allowedRoles={['Faculty', 'Administrator']}>
                  <Shell>
                    <GuidesPage />
                  </Shell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['Student', 'Faculty', 'Administrator']}>
                  <Shell>
                    <ProfilePage />
                  </Shell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute allowedRoles={['Administrator']}>
                  <Shell>
                    <AnalyticsPage />
                  </Shell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['Administrator']}>
                  <Shell>
                    <AdminCenterPage />
                  </Shell>
                </ProtectedRoute>
              }
            />

            {/* 404 Catch All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <ToastWrapper />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}
