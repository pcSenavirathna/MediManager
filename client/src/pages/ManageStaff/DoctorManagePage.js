  import React, { useState, useEffect } from 'react';
  import doctorService from '../../services/doctorService';
  import backgroundImage from '../../images/mediback.jpg';

  const DoctorManagePage = () => {
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [doctorToDelete, setDoctorToDelete] = useState(null);
    const [formData, setFormData] = useState({ 
      name: '', 
      email: '', 
      phone: '', 
      speciality: '', 
      schedule: [{ day: '', startTime: '', endTime: '' }] 
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
      fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
      const data = await doctorService.getAllDoctors();
      setDoctors(data);
    };

    const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const filteredDoctors = searchTerm
  ? doctors.filter(doctor => {
      const searchLower = searchTerm.toLowerCase();
      return (
        doctor.doctorId.toLowerCase().includes(searchLower) ||
        doctor.name.toLowerCase().includes(searchLower) ||
        doctor.email.toLowerCase().includes(searchLower) ||
        doctor.phone.includes(searchTerm)
      );
    })
  : [];


    const handleScheduleChange = (index, field, value) => {
      const newSchedule = [...formData.schedule];
      newSchedule[index][field] = value;
      setFormData({ ...formData, schedule: newSchedule });
    };

    const addScheduleSlot = () => {
      setFormData({
        ...formData,
        schedule: [...formData.schedule, { day: '', startTime: '', endTime: '' }]
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (editingId) {
        await doctorService.updateDoctor(editingId, formData);
      } else {
        await doctorService.createDoctor(formData);
      }
      setFormData({ name: '', email: '', phone: '', speciality: '', schedule: [{ day: '', startTime: '', endTime: '' }] });
      setEditingId(null);
      fetchDoctors();
    };

    const handleEdit = (doctor) => {
      setFormData(doctor);
      setEditingId(doctor.doctorId);
    };

    const handleDelete = (id) => {
      setDoctorToDelete(id);
      setShowDeleteConfirm(true);
    };
    
    const confirmDelete = async () => {
      if (doctorToDelete) {
        await doctorService.deleteDoctor(doctorToDelete);
        fetchDoctors();
        setShowDeleteConfirm(false);
        setDoctorToDelete(null);
      }
    };

    return (
      <div style={styles.backgroundImage}>
      <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Manage Doctors</h1>
      
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name"
            required
          />
          <input
            style={styles.input}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
          <input
            style={styles.input}
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone"
            required
          />
          <input
            style={styles.input}
            type="text"
            name="speciality"
            value={formData.speciality}
            onChange={handleInputChange}
            placeholder="speciality"
            required
          />
          {formData.schedule.map((slot, index) => (
            <div key={index} style={styles.scheduleSlot}>
              <select
                style={styles.input}
                value={slot.day}
                onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                required
              >
                <option value="">Select Day</option>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <input
                style={styles.input}
                type="time"
                value={slot.startTime}
                onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                required
              />
              <input
                style={styles.input}
                type="time"
                value={slot.endTime}
                onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                required
              />
            </div>
          ))}
          <button type="button" onClick={addScheduleSlot} style={styles.button}>Add Schedule Slot</button>
          <button style={styles.button} type="submit">
            {editingId ? 'Update Doctor' : 'Add Doctor'}
          </button>
        </form>
        </div>
        <input
  style={styles.searchInput}
  type="text"
  placeholder="Search by ID, Name, Email, or Phone"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

{searchTerm && (
  <div style={styles.doctorList}>
    <h2 style={styles.subtitle}>Doctor List</h2>
    {filteredDoctors.map((doctor) => (
      <div key={doctor.doctorId} style={styles.doctorCard}>
        <h3>Doctor ID: {doctor.doctorId}</h3>
        <p>Name: {doctor.name}</p>
        <p>Email: {doctor.email}</p>
        <p>Phone: {doctor.phone}</p>
        <p>Speciality: {doctor.speciality}</p>
        <h4>Schedule:</h4>
        {doctor.schedule.map((slot, index) => (
          <p key={index}>{slot.day}: {slot.startTime} - {slot.endTime}</p>
        ))}
        <div style={styles.cardActions}>
          <button style={styles.editButton} onClick={() => handleEdit(doctor)}>Edit</button>
          <button style={styles.deleteButton} onClick={() => handleDelete(doctor.doctorId)}>Delete</button>
        </div>
      </div>
    ))}
  </div>
)}
{showDeleteConfirm && (
  <div style={styles.overlay}>
    <div style={styles.popup}>
      <p>Are you sure you want to delete this doctor?</p>
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
    title: {
      fontSize: '28px',
      marginBottom: '20px',
      color: '#2c3e50',
      textAlign: 'center',
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
      backgroundColor: '#ecf0f1',
      padding: '20px',
      borderRadius: '8px',
    },
    input: {
      margin: '10px 0',
      padding: '12px',
      fontSize: '16px',
      borderRadius: '4px',
      border: '1px solid #bdc3c7',
      transition: 'border 0.3s ease',
    },
    button: {
      backgroundColor: '#3498db',
      color: 'white',
      padding: '12px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    doctorList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px',
    },
    subtitle: {
      fontSize: '24px',
      marginBottom: '15px',
      gridColumn: '1 / -1',
      color: '#2c3e50',
    },
    doctorCard: {
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease',
    },
    cardActions: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '15px',
    },
    editButton: {
      backgroundColor: '#2ecc71',
      color: 'white',
      padding: '8px 12px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    deleteButton: {
      backgroundColor: '#e74c3c',
      color: 'white',
      padding: '8px 12px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    scheduleSlot: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px',
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

  export default DoctorManagePage;