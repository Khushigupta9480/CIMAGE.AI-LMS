// src/pages/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    role: 'student',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/register/', form);
      setMessage(res.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      setMessage('');
    }
  };

  return (
    <div className="auth-form">
      <h2>Register</h2>
      {message && <div style={{ color: 'green' }}>{message}</div>}
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select name="role" onChange={handleChange} value={form.role}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
