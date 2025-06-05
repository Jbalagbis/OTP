import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordType, setPasswordType] = useState('password');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter both email and password.',
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem(
          'user',
          JSON.stringify({
            name: data.name || 'Jane Doe',
            email: email,
          })
        );

        Swal.fire({
          icon: 'success',
          title: 'Login successful',
          text: 'Welcome back!',
        }).then(() => {
          navigate('/dashboard');
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login failed',
          text: data.message || 'Invalid Email or Password',
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error during login.',
      });
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  return (
    <div className="auth-container">
      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="auth-form fade-in">
          <h2>Login</h2><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <div className="password-container">
            <input
              type={passwordType}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <span className="eye-icon" onClick={togglePasswordVisibility}>
              <i className={`fas ${passwordType === 'password' ? 'fa-eye' : 'fa-eye-slash'}`}></i>
            </span>
          </div>

          <button type="submit">Login</button><br />
          <p>
            Don't have an account? <a href="/signup">Register</a>
          </p>
        </form>
      )}
    </div>
  );
};

export default Login;
