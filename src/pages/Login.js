// src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordLogin = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/login-password/', {
        username: form.username,
        password: form.password,
      });

      localStorage.setItem('token', res.data.token);
      const payload = JSON.parse(atob(res.data.token.split('.')[1]));
      const role = payload.role;

      if (role === 'student') navigate('/student/dashboard');
      else if (role === 'teacher') navigate('/teacher/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Password login failed');
      setMessage('');
    }
  };

  const handleMagicLinkLogin = async () => {
    try {
      const res = await axios.post('http://localhost:8000/send-magic-link/', {
        email: form.email,
      });
      setMessage(res.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Magic link login failed');
      setMessage('');
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      {message && <div style={{ color: 'green' }}>{message}</div>}
      {error && <div className="error">{error}</div>}

      <form onSubmit={handlePasswordLogin}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">Login with Password</button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>or</div>

      <div style={{ marginTop: '10px' }}>
        <input
          type="email"
          name="email"
          placeholder="Enter Email for Magic Link"
          value={form.email}
          onChange={handleChange}
        />
        <button onClick={handleMagicLinkLogin}>Login via Magic Link</button>
      </div>
    </div>
  );
};

export default Login;
