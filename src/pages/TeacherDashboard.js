import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const TeacherDashboard = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [uploadedCourses, setUploadedCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState({ username: '', email: '' });
  const [video, setVideo] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState('');
  const fileInputRef = useRef();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ username: payload.username, email: payload.email });
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }

    fetchDashboard();
  }, [token]);

  const fetchDashboard = async () => {
    try {
      const res1 = await axios.get('http://localhost:8000/teacher-dashboard/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUploadedCourses(res1.data.uploaded_courses);

      const res2 = await axios.get('http://localhost:8000/courses/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllCourses(res2.data.courses);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);

    if (video) {
      formData.append('video', video);
    } else if (youtubeLink) {
      formData.append('youtube_link', youtubeLink);
    }

    try {
      const res = await axios.post('http://localhost:8000/upload-course/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage(res.data.message);
      setError('');
      setTitle('');
      setDescription('');
      setVideo(null);
      setYoutubeLink('');
      fileInputRef.current.value = null; // reset file input
      fetchDashboard();
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
      setMessage('');
    }
  };

  const renderVideo = (course) => {
    if (course.youtube_link) {
      return (
        <iframe
          width="100%"
          height="200"
          src={course.youtube_link}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video"
          style={{ marginTop: '1rem' }}
        ></iframe>
      );
    } else if (course.video_id) {
      return (
        <video width="100%" height="200" controls poster="/static/video-placeholder.png">
          <source src={course.video_url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

      );
    } else {
      return <p>No video available</p>;
    }
  };

  return (
    <div className="dashboard">
      <h1>CIMAGE.AI</h1>
      <h2>👩‍🏫 Teacher Dashboard</h2>

      {user.username && (
        <p className="user_email" style={{ fontStyle: 'italic', marginBottom: '1rem' }}>
          Logged in as: <strong>{user.username}</strong><br />
          <strong>{user.email}</strong>
        </p>
      )}

      <section>
        <h3>📚 Upload New Course</h3>
        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleUpload}>
          <input
            type="text"
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Course Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label>Upload Video:</label>
          <input
            type="file"
            accept="video/*"
            ref={fileInputRef}
            onChange={(e) => setVideo(e.target.files[0])}
          />

          <label>Or paste YouTube Embed Link:</label>
          <input
            type="text"
            placeholder="https://www.youtube.com/embed/VIDEO_ID"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
          />

          <button type="submit">Upload Course</button>
        </form>
      </section>

      <section>
        <h3>🎓 Your Uploaded Courses</h3>
        {uploadedCourses.length === 0 ? (
          <p>No uploaded courses yet.</p>
        ) : (
          <ul>
            {uploadedCourses.map(course => (
              <li key={course.id}>
                <strong>{course.title}</strong><br />
                <small>{course.description}</small><br />
                <em>Uploaded: {course.created_at}</em><br />
                <strong>Total Enrollments: {course.enrollments}</strong><br />
                {renderVideo(course)}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>🌐 All Available Courses</h3>
        {allCourses.length === 0 ? (
          <p>No available courses.</p>
        ) : (
          <ul>
            {allCourses.map(course => (
              <li key={course.id}>
                <strong>{course.title}</strong><br />
                <small>{course.description}</small><br />
                <em>Uploaded: {course.created_at}</em><br />
                <strong>By: {course.created_by}</strong><br />
                <strong>Total Enrollments: {course.enrollments}</strong><br />
                {renderVideo(course)}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default TeacherDashboard;
