import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaAddressCard, FaBed, FaUserMd, FaCalendarAlt, FaChartBar, FaCalendarCheck, FaListAlt } from 'react-icons/fa';


import axios from 'axios';
import { BiQrScan } from "react-icons/bi";


const HomePage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [userr, setUser] = useState(null);
  const [hasHealthCard, setHasHealthCard] = useState(false);
  const navigatee = useNavigate();
  const [isActive, setIsActive] = useState(false);
  //add the active class
  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };
  //clean up function to remove the active class
  const removeActive = () => {
    setIsActive(false)
  }
  useEffect(() => {
    const userr = JSON.parse(localStorage.getItem('user'));
    if (userr) {
      setUser(userr);
      checkHealthCard(userr.email);
    }
  }, [navigatee]);

  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);
  const checkHealthCard = async (email) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/healthCard/exists/${email}`);
      if (response.status === 200 && response.data.exists) {
        setHasHealthCard(true);
      } else {
        setHasHealthCard(false);
      }
    } catch (error) {
      console.error('Error checking health card:', error);
    }
  };
  return (
    <div style={styles.homePage}>
      <main style={styles.mainContent}>
        <h1 style={styles.title}>Welcome to MediManager</h1>
        <p style={styles.subtitle}>
          Revolutionizing healthcare management with cutting-edge technology
        </p>

        {user && user.userType === "Staff" && (
          <div style={styles.featureGrid}>
            <FeatureCard
              title="View Appointments"
              description="See all scheduled appointments"
              icon={<FaListAlt />}
              link="/appointmentview"
            />
            <FeatureCard
              title="Patient Discharge/Checkout"
              description="Check out patients"
              icon={<FaListAlt />}
              link="/discharge"
            />
            <FeatureCard
              title="Bed Arrange"
              description="See all bed arrangements"
              icon={<FaBed />}
              link="/bedshedule"
            />
            <FeatureCard
              title="QR Scanner"
              description="Scan QR codes"
              icon={<BiQrScan />}
              link="/scanningCard"
            />
          </div>
        )}
        {user && user.userType === "Patient" && (
          <div style={styles.featureGrid}>
            <FeatureCard
              title="Make Appointment"
              description="Schedule an appointment with a doctor"
              icon={<FaCalendarCheck />}
              link="/makeappoinment"
            />
            <FeatureCard
              title="View Pending Payments"
              description="See all pending payments"
              icon={<FaListAlt />}
              link="/payments"
            />
            <FeatureCard
              title={hasHealthCard ? "Access My Health Card" : "Get Health Card"}
              description={hasHealthCard ? "View your digital health card" : "Apply for a digital health card"}
              icon={<BiQrScan />}
              link={hasHealthCard ? "/accessCard" : "/digitleHeathCard"}
            />
          </div>
        )}

        {user && user.userType === "Doctor" && (
          <div style={styles.featureGrid}>
            <FeatureCard
              title="View Appointments"
              description="See all scheduled appointments"
              icon={<FaListAlt />}
              link="/appointmentview"
            />
            <FeatureCard
              title="QR Scanner"
              description="Scan QR codes"
              icon={<BiQrScan />}
              link="/scanningCard"
            />
          </div>
        )}

        {user && user.userType === "HSA" && (
          <div style={styles.featureGrid}>
            <FeatureCard
              title="Staff Management"
              description="Efficiently manage your medical staff with ease"
              icon={<FaUserMd />}
              link="/staff"
            />
            <FeatureCard
              title="Smart Scheduling"
              description="Optimize schedules for maximum efficiency"
              icon={<FaCalendarAlt />}
              link="/schedules"
            />
            <FeatureCard
              title="Insightful Analytics"
              description="Make data-driven decisions with powerful reports"
              icon={<FaChartBar />}
              link="/reports"
            />

            <FeatureCard
              title="Doctor Management"
              description="Schedule an appointment with a doctor"
              icon={<FaUserMd />}
              link="/doctorMange"
            />




          </div>
        )}

      </main>

    </div>
  );
};
const FeatureCard = ({ title, description, icon, link }) => (
  <Link to={link} style={styles.featureCard}>
    <div style={styles.icon}>{icon}</div>
    <h2 style={styles.cardTitle}>{title}</h2>
    <p style={styles.cardDescription}>{description}</p>
  </Link>
);

const styles = {
  homePage: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  },
  header: {
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '1rem 2rem',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#3498db',
  },
  navLinks: {
    display: 'flex',
    gap: '1rem',
  },
  navLink: {
    backgroundColor: '#3498db',
    color: '#ffffff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    textDecoration: 'none',
  },
  navButton: {
    backgroundColor: '#3498db',
    color: '#ffffff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    textDecoration: 'none',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  title: {
    fontSize: '3rem',
    color: '#2c3e50',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#34495e',
    maxWidth: '600px',
    marginBottom: '3rem',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    width: '100%',
    marginBottom: '3rem',
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '2rem',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
    textDecoration: 'none',
    color: 'inherit',
  },
  icon: {
    fontSize: '2.5rem',
    color: '#3498db',
    marginBottom: '1rem',
  },
  cardTitle: {
    fontSize: '1.25rem',
    marginBottom: '0.5rem',
  },
  cardDescription: {
    fontSize: '1rem',
    color: '#7f8c8d',
  },
  ctaContainer: {
    marginTop: '2rem',
  },
  ctaButton: {
    backgroundColor: '#2ecc71',
    color: '#ffffff',
    padding: '1rem 2rem',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    transition: 'background-color 0.3s ease',
  },
  footer: {
    backgroundColor: '#34495e',
    color: '#ecf0f1',
    textAlign: 'center',
    padding: '1rem',
  },
};

export default HomePage;