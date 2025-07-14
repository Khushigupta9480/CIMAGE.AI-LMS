// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MagicLoginVerify from './pages/MagicLoginVerify';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-token" element={<MagicLoginVerify />} />

        {/* Role-based Protected Routes */}
        <Route
          path="/student/dashboard"
          element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>}
        />
        <Route
          path="/teacher/dashboard"
          element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>}
        />
        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}
        />

        {/* Optional: Default route redirect to login */}
        <Route path="*" element={<Login />} />

        <Route
          path="/student/dashboard"
          element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>}
        />

        <Route
  path="/admin/dashboard"
  element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}
/>


      </Routes>
    </Router>
  );
}

export default App;
