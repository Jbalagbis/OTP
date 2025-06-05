import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './SignUp.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [passwordType, setPasswordType] = useState('password');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  const handleSendOtp = async () => {
    if (!email) {
      Swal.fire('Warning', 'Please enter your email first', 'warning');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        Swal.fire('Success', 'OTP sent to your email', 'success');
      } else {
        Swal.fire('Error', data.message || 'Failed to send OTP', 'error');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      Swal.fire('Error', 'There was an error sending OTP', 'error');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !password || !otp) {
      Swal.fire('Warning', 'Please fill all fields', 'warning');
      return;
    }

    setLoading(true);

    try {
      const verifyResponse = await fetch('http://localhost:5000/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        Swal.fire('Error', verifyData.message || 'Invalid OTP', 'error');
        setLoading(false);
        return;
      }

      const registerResponse = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const registerData = await registerResponse.json();

      if (registerResponse.ok) {
        Swal.fire('Success', 'User registered successfully!', 'success');
      } else {
        Swal.fire('Error', registerData.message || 'Registration failed', 'error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Swal.fire('Error', 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-up-container">
      <form onSubmit={handleRegister} className="sign-up-form">
        <h2>Sign Up</h2><br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        <div className="password-wrapper">
          <input
            type={passwordType}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <span className="visibility-icon" onClick={togglePasswordVisibility}>
            <i className={`fas ${passwordType === 'password' ? 'fa-eye' : 'fa-eye-slash'}`}></i>
          </span>
        </div>

        <div className="otp-wrapper">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
          />
          <button
            type="button"
            className="otp-btn"
            onClick={handleSendOtp}
            title="Send OTP"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button><br /><br />

        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
