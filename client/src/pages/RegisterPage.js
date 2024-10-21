import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import backgroundImage from '../images/mediback.jpg';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [userType, setUserType] = useState('Patient');
  const [staffId, setStaffId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await authService.register(name, email, password, userType, medicalHistory, phone);
      navigate('/login');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div style={styles.backgroundImage}>
    <div style={styles.container}>
      <div style={styles.registerBox}>
        <h1 style={styles.title}>MediManager</h1>
        <p style={styles.subtitle}>Create Your Account</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              placeholder="Enter your name"
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Enter your email"
            />
          </div>
          
          <div style={styles.inputGroup}>
          <label style={styles.label}>Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={styles.input}
              placeholder="Enter your mobile"
            />
          </div>

          {userType === 'Patient' && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Medical History</label>
              <input
                type="text"
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                style={styles.input}
                placeholder="Enter your Medical History"
              />
            </div>
          )}
          {userType === 'Staff' && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Staff ID</label>
              <input
                type="text"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                style={styles.input}
                placeholder="Enter your Staff ID"
              />
            </div>
          )}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              placeholder="Confirm your password"
            />
          </div>
          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>
        <p style={styles.loginLink}>
          Already have an account? <a href="/login" style={styles.link}>Login here</a>
        </p>
      </div>
    </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    
  },
  registerBox: {
    background: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    color: '#333',
    fontSize: '28px',
    textAlign: 'center',
    marginBottom: '10px',
  },
  backgroundImage: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',

  },
  subtitle: {
    color: '#666',
    fontSize: '16px',
    textAlign: 'center',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#333',
    fontSize: '14px',
  },
  input: {
    width: '95%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  button: {
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  error: {
    color: '#f44336',
    textAlign: 'center',
    marginBottom: '15px',
  },
  loginLink: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
    color: '#666',
  },
  link: {
    color: '#4CAF50',
    textDecoration: 'none',
  },
};

export default RegisterPage;