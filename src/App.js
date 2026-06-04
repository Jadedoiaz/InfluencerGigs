import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import SignupForm from './components/SignupForm';
import Verify from './components/Verify';
import ProtectedRoute from './components/ProtectedRoute';
import Marketplace from './components/Marketplace';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/marketplace" element={<Marketplace />} />
        
        {/* Protected Routes */}
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Only Route */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/marketplace" replace />} />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/marketplace" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
