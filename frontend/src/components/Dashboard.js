import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser({
        name: storedUser.name || 'Jane Doe',
        email: storedUser.email || 'jane.doe@example.com',
      });
    } else {
      setUser({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h4>BS INFOMATION TECHNOLOGY</h4>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header><br/><br/><br/>
      <section className="dashboard-content">
        <div className="card">
          <h2>BSIT-3QL Class Schedule</h2>
          <ul className="schedule-list">
            <li><strong>Monday:</strong> Reading in Philippine History | Dance</li><br/>
            <li><strong>Tuesday:</strong> Fil 2 | NSTP | Science, Technology and Society</li><br/>
            <li><strong>Wednesday:</strong> Statistics and Probability</li><br/>
            <li><strong>Thursday:</strong> Discrete Structure | Application Development</li><br/>
            <li><strong>Friday:</strong> Human Computer Interaction</li><br/>
            <li><strong>Saturday:</strong> Information Management</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
