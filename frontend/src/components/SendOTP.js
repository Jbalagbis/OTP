import React, { useState } from 'react';
import Swal from 'sweetalert2';

const SendOTP = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleSendOtp = async () => {
    const res = await fetch('http://localhost:5000/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) {
      setOtpSent(true);
      Swal.fire('OTP Sent!', data.message, 'success');
    } else {
      Swal.fire('Error', data.message, 'error');
    }
  };

  const handleVerifyOtp = async () => {
    const res = await fetch('http://localhost:5000/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (res.ok) {
      setOtpVerified(true);
      Swal.fire('Success!', 'OTP Verified', 'success');
    } else {
      Swal.fire('Invalid OTP', data.message, 'error');
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      return Swal.fire('Missing fields', 'Please enter email and password', 'warning');
    }

    const res = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      Swal.fire('Registered!', data.message, 'success');
    } else {
      Swal.fire('Error', data.message, 'error');
    }
  };

  return (
    <div>
      <h2>Register with Email OTP</h2>
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSendOtp}>Send OTP</button>

      {otpSent && !otpVerified && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </>
      )}

      {otpVerified && (
        <>
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleRegister}>Register</button>
        </>
      )}
    </div>
  );
};

export default SendOTP;
