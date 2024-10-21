import React, { useState, useEffect } from 'react';
import appointmentService from '../../services/appointmentService';
import { useNavigate } from 'react-router-dom';
import patientService from '../../services/patientService';
import backgroundImage from '../../images/mediback.jpg';

const MakeAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ date: '', time: '', doctor: '', patient: '', reason: '' });
  const [editingId, setEditingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [user, setUser] = useState('');
  const [patient, setPatient] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUser(user);
      fetchPatient(user.email);
    }
    fetchAppointments();
  }, [navigate]);

  const fetchPatient = async (email) => {
    const patient = await patientService.getPatientByEmail(email);
    setPatient(patient);
  };
  const fetchAppointments = async () => {
    const data = await appointmentService.getAllAppointments();
    setAppointments(data);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const appointmentData = {
      ...formData,
      date: new Date(formData.date).toISOString(),
      time: new Date(`1970-01-01T${formData.time}`).toISOString()
    };
    if (editingId) {
      await appointmentService.updateAppointment(editingId, appointmentData);
    } else {
      await appointmentService.createAppointment(appointmentData);
    }
    setFormData({ date: '', time: '', doctor: '', patient: '' });
    setEditingId(null);
    fetchAppointments();
  };
  const handleEdit = (appointment) => {
    setFormData(appointment);
    setEditingId(appointment._id);
  };
  const filteredAppointments = searchTerm
  ? appointments.filter(appointment => {
      const searchLower = searchTerm.toLowerCase();
      return (
        new Date(appointment.date).toLocaleDateString().toLowerCase().includes(searchLower) ||
        new Date(appointment.time).toLocaleTimeString().toLowerCase().includes(searchLower) ||
        appointment.doctor.toLowerCase().includes(searchLower) ||
        appointment.patient.toLowerCase().includes(searchLower)
      );
    })
  : [];

  const handleDelete = (id) => {
    setAppointmentToDelete(id);
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    if (appointmentToDelete) {
      await appointmentService.deleteAppointment(appointmentToDelete);
      fetchAppointments();
      setShowDeleteConfirm(false);
      setAppointmentToDelete(null);
    }
  };

  return (
    <div style={styles.backgroundImage}>
    <div style={styles.container}>
    <div style={styles.formContainer}>
      <h1 style={styles.title}>Manage Appointments</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          required
        />
        <input
          style={styles.input}
          type="time"
          name="time"
          value={formData.time}
          onChange={handleInputChange}
          required
        />
        <input
          style={styles.input}
          type="text"
          name="doctor"
          value={formData.doctor}
          onChange={handleInputChange}
          placeholder="Doctor"
          required
        />
        <input
          style={styles.input}
          type="text"
          name="patient"
          value={patient.name}
          onChange={handleInputChange}
          placeholder="Patient"
          required
          disabled
        />
        <input
          style={styles.input}
          type="text"
          name="reason"
          value={formData.reason}
          onChange={handleInputChange}
          placeholder="Reason"
          required
          disabled
        />
        <button style={styles.button} type="submit">
          {editingId ? 'Update Appointment' : 'Add Appointment'}
        </button>
      </form>
      </div>
      <input
  style={styles.searchInput}
  type="text"
  placeholder="Search by date, time, doctor, or patient"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
{searchTerm && (
  <div style={styles.appointmentList}>
    <h2 style={styles.subtitle}>Appointment List</h2>
    {filteredAppointments.map((appointment) => (
      <div key={appointment._id} style={styles.appointmentCard}>
        <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
        <p>Time: {new Date(appointment.time).toLocaleTimeString()}</p>
        <p>Doctor: {appointment.doctor}</p>
        <p>Patient: {appointment.patient}</p>
        <div style={styles.cardActions}>
          <button style={styles.editButton} onClick={() => handleEdit(appointment)}>Edit</button>
          <button style={styles.deleteButton} onClick={() => handleDelete(appointment._id)}>Delete</button>
        </div>
      </div>
    ))}
  </div>
)}
{showDeleteConfirm && (
  <div style={styles.overlay}>
    <div style={styles.popup}>
      <p>Are you sure you want to delete this appointment?</p>
      <div style={styles.popupButtons}>
        <button style={styles.confirmButton} onClick={confirmDelete}>Yes</button>
        <button style={styles.cancelButton} onClick={() => setShowDeleteConfirm(false)}>No</button>
      </div>
    </div>
  </div>
)}
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
  searchInput: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    marginBottom: '20px',
    borderRadius: '8px',
    border: '2px solid #ddd',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  popupButtons: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  confirmButton: {
    backgroundColor: '#f44336',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  cancelButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
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

  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '30px',
  }
};

export default MakeAppointment;
