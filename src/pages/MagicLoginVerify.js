import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MagicLoginVerify = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromUrl = new URLSearchParams(window.location.search).get('token');
    if (!tokenFromUrl) return;

    axios.get(`http://localhost:8000/verify-token/?token=${tokenFromUrl}`)
      .then(res => {
        const loginToken = res.data.token;
        localStorage.setItem('token', loginToken);
        const payload = JSON.parse(atob(loginToken.split('.')[1]));
        const role = payload.role;

        if (role === 'student') navigate('/student/dashboard');
        else if (role === 'teacher') navigate('/teacher/dashboard');
        else if (role === 'admin') navigate('/admin/dashboard');
      })
      .catch(err => {
        console.error('Magic link login failed:', err);
        navigate('/login');
      });
  }, [navigate]);

  return <p>Verifying token...</p>;
};

export default MagicLoginVerify;
