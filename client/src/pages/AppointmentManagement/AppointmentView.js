import React, { useState, useEffect } from 'react';
import appointmentService from '../../services/appointmentService';
import backgroundImage from '../../images/mediback.jpg';

const AppointmentView = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const data = await appointmentService.getAllAppointments();
    setAppointments(data);
  };

  return (
    <div style={styles.backgroundImage}>
    <div style={styles.container}>
      <h1 style={styles.title}>All Appointments</h1>
      <div style={styles.appointmentList}>
        {appointments.map((appointment) => (
          <div key={appointment._id} style={styles.appointmentCard}>
            <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
            <p>Time: {new Date(appointment.time).toLocaleTimeString()}</p>
            <p>Doctor: {appointment.doctor}</p>
            <p>Patient: {appointment.patient}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '30px',
  },
  input: {
    margin: '10px 0',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  appointmentList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  subtitle: {
    fontSize: '20px',
    marginBottom: '15px',
    gridColumn: '1 / -1',
  },
  appointmentCard: {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  editButton: {
    backgroundColor: '#2196F3',
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  backgroundImage: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',

  }
};

export default AppointmentView;
