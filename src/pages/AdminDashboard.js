import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:8000/admin-dashboard/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setData(res.data))
      .catch(err => {
        console.error('Error:', err);
        setError('Failed to load admin dashboard');
      });
  }, []);

  if (!data) return <div className="dashboard"><h2>Loading...</h2></div>;

  return (
    <div className="dashboard">
      <h1>CIMAGE.AI</h1>
      <h2>📊 Admin Dashboard</h2>

      {error && <div className="error">{error}</div>}



      <section>
        <h3>Platform Overview</h3>
        <p><strong>Total Users:</strong> {data.total_users}</p>
        <p><strong>Total Courses:</strong> {data.total_courses}</p>

      </section>

      <section>
        <h3>🏆 Top Enrolled Course</h3>
        {data.top_course && data.top_course.title ? (
          <div className="course-card">
            <strong>{data.top_course.title}</strong><br />
            <em>Instructor: {data.top_course.created_by}</em><br />
            <strong>Total Enrollments: {data.top_course.enrollments}</strong>
          </div>
        ) : (
          <p>No course data available.</p>
        )}
      </section>

      <section>
        <h3>👥 All Users</h3>
        <ul>
          {data.users.map(user => (
            <li key={user.id}>
              <strong>{user.username}</strong><br />
              📧 {user.email}<br />
              🧑 Role: {user.role}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>🌐 All Available Courses</h3>
        {data.courses.length === 0 ? (
          <p>No available courses.</p>
        ) : (
          <ul>
            {data.courses.map(course => (
              <li key={course.id}>
                <strong>{course.title}</strong><br />
                <small>{course.description}</small><br />
                <strong>Instructor:</strong><em> {course.created_by}</em><br />
                <strong>Uploaded:</strong> <em>{course.created_at}</em><br />
                <strong>Total Enrollments: {course.enrollments}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
