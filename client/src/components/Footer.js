
import React from 'react';
import { FaHospital, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.column}>
          <h3 style={styles.title}><FaHospital /> MediManager</h3>
          <p style={styles.text}>Revolutionizing healthcare management for a better tomorrow.</p>
        </div>
        <div style={styles.column}>
          <h4 style={styles.subtitle}>Quick Links</h4>
          <ul style={styles.list}>
            <li><a href="/about" style={styles.link}>About Us</a></li>
            <li><a href="/services" style={styles.link}>Our Services</a></li>
            <li><a href="/careers" style={styles.link}>Careers</a></li>
            <li><a href="/contact" style={styles.link}>Contact Us</a></li>
          </ul>
        </div>
        <div style={styles.column}>
          <h4 style={styles.subtitle}>Contact</h4>
          <p style={styles.text}><FaPhone /> (123) 456-7890</p>
          <p style={styles.text}><FaEnvelope /> info@medimanager.com</p>
          <p style={styles.text}>123 Healthcare Ave, Medical City, MC 12345</p>
        </div>
        <div style={styles.column}>
          <h4 style={styles.subtitle}>Follow Us</h4>
          <div style={styles.socialIcons}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={styles.icon}><FaFacebook /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={styles.icon}><FaTwitter /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={styles.icon}><FaLinkedin /></a>
          </div>
        </div>
      </div>
      <div style={styles.bottomBar}>
        <p style={styles.copyright}>© 2023 MediManager. All rights reserved.</p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: 'black',
    color: '#ecf0f1',
    padding: '40px 0 0',
    fontFamily: 'Arial, sans-serif',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  column: {
    flex: '1 1 250px',
    margin: '0 10px 20px',
  },
  title: {
    fontSize: '24px',
    marginBottom: '15px',
  },
  subtitle: {
    fontSize: '18px',
    marginBottom: '10px',
  },
  text: {
    marginBottom: '10px',
    lineHeight: '1.5',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  link: {
    color: '#ecf0f1',
    textDecoration: 'none',
    lineHeight: '1.8',
    transition: 'color 0.3s ease',
  },
  socialIcons: {
    display: 'flex',
    gap: '15px',
  },
  icon: {
    color: '#ecf0f1',
    fontSize: '24px',
    transition: 'color 0.3s ease',
  },
  bottomBar: {
    borderTop: '1px solid #34495e',
    marginTop: '20px',
    padding: '20px 0',
    textAlign: 'center',
  },
  copyright: {
    fontSize: '14px',
  },
};

export default Footer;
