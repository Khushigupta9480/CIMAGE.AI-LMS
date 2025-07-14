import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const StudentDashboard = () => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState({ username: '', email: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    decodeToken();
    fetchCourses();
    fetchMyCourses();
  }, [token]);

  const decodeToken = () => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ username: payload.username, email: payload.email });
    } catch (err) {
      console.error('Invalid token:', err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:8000/courses/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailableCourses(res.data.courses);
    } catch (err) {
      console.error('Error fetching available courses:', err);
      setError('Failed to load available courses');
    }
  };

  const fetchMyCourses = async () => {
    try {
      const res = await axios.get('http://localhost:8000/my-courses/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyCourses(res.data.courses || []);
    } catch (err) {
      console.error('Error fetching my courses:', err);
      setError('Failed to load your courses');
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      const res = await axios.post('http://localhost:8000/enroll/', { course_id: courseId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message);
      setError('');
      fetchMyCourses();
    } catch (err) {
      setMessage('');
      setError(err.response?.data?.error || 'Enrollment failed');
    }
  };

  return (
    <div className="dashboard">
      <h1>CIMAGE.AI</h1>
      <h2>🎓 Student Dashboard</h2>

      {user.username && (
        <p className="user_email" style={{ fontStyle: 'italic', marginBottom: '1rem' }}>
          Logged in as: <strong>{user.username}</strong><br />
          <strong>{user.email}</strong>
        </p>
      )}

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <section>
        <h3>📘 My Enrolled Courses</h3>
        {myCourses.length === 0 ? (
          <p>No enrolled courses yet.</p>
        ) : (
          <div className="course-grid">
            {myCourses.map(course => (
              <div className="course-card" key={course.id}>
                <strong>{course.title}</strong><br />
                <small>{course.description}</small><br />
                <em>Instructor: {course.created_by}</em><br />
                <small>Enrolled on: {course.enrolled_at}</small><br />

                {course.youtube_link ? (
                  <div style={{ marginTop: '1rem' }}>
                    <iframe
                      width="100%"
                      height="200"
                      src={course.youtube_link}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="YouTube video"
                    ></iframe>
                  </div>
                ) : course.video_url ? (
                  <div style={{ marginTop: '1rem' }}>
                    <video width="100%" height="200" controls poster="/static/video-placeholder.png">
                      <source src={course.video_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <p>No video available</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3>🌐 All Available Courses</h3>
        {availableCourses.length === 0 ? (
          <p>No available courses at the moment.</p>
        ) : (
          <div className="course-grid">
            {availableCourses.map(course => (
              <div className="course-card" key={course.id}>
                <strong>{course.title}</strong><br />
                <small>{course.description}</small><br />
                <em>Instructor: {course.created_by}</em><br />
                <em>Uploaded: {course.created_at}</em><br />
                <strong>Total Enrollments: {course.enrollments}</strong><br />

                {course.youtube_link ? (
                  <div style={{ marginTop: '1rem' }}>
                    <iframe
                      width="100%"
                      height="200"
                      src={course.youtube_link}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="YouTube video"
                    ></iframe>
                  </div>
                ) : course.video_url ? (
                  <div style={{ marginTop: '1rem' }}>
                    <video width="100%" height="200" controls poster="/static/video-placeholder.png">
                      <source src={course.video_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <p>No video available</p>
                )}

                <button onClick={() => handleEnroll(course.id)} style={{ marginTop: '0.5rem' }}>
                  Enroll
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default StudentDashboard;
