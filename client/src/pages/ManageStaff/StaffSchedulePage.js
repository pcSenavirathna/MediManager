  import React, { useState, useEffect } from 'react';
  import scheduleService from '../../services/scheduleService';
  import staffService from '../../services/staffService';
  import backgroundImage from '../../images/mediback.jpg';

  const StaffSchedulePage = () => {
    const [schedules, setSchedules] = useState([]);
    const [staff, setStaff] = useState([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [scheduleToDelete, setScheduleToDelete] = useState(null);
    const [formData, setFormData] = useState({
      staffId: '',
      date: '',
      shiftStart: '',
      shiftEnd: '',
    });
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
      fetchSchedules();
      fetchStaff();
    }, []);

    const fetchSchedules = async () => {
      const data = await scheduleService.getAllSchedules();
      const validSchedules = data.filter(schedule => schedule && schedule.staffId);
      setSchedules(validSchedules);
      console.log(validSchedules);
    };

    const fetchStaff = async () => {
      const data = await staffService.getAllStaff();
      setStaff(data);
    };

    const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (editingId) {
        await scheduleService.updateSchedule(editingId, formData);
        setEditingId(null);
      } else {
        await scheduleService.createSchedule(formData);
      }
      setFormData({ staffId: '', date: '', shiftStart: '', shiftEnd: '' });
      fetchSchedules();
    };

    const handleDelete = (id) => {
      setScheduleToDelete(id);
      setShowDeleteConfirm(true);
    };
    
    const confirmDelete = async () => {
      if (scheduleToDelete) {
        await scheduleService.deleteSchedule(scheduleToDelete);
        fetchSchedules();
        setShowDeleteConfirm(false);
        setScheduleToDelete(null);
      }
    };

    const handleEdit = (schedule) => {
      setFormData({
        staffId: schedule.staffId._id,
        date: new Date(schedule.date).toISOString().split('T')[0],
        shiftStart: schedule.shiftStart,
        shiftEnd: schedule.shiftEnd,
      });
      setEditingId(schedule._id);
    };

    const filteredSchedules = searchTerm
  ? schedules.filter(schedule => {
      const staffMember = schedule.staffId;
      const searchLower = searchTerm.toLowerCase();
      return (
        staffMember.staffId.toLowerCase().includes(searchLower) ||
        staffMember.name.toLowerCase().includes(searchLower) ||
        staffMember.email.toLowerCase().includes(searchLower) ||
        staffMember.role.toLowerCase().includes(searchLower) ||
        staffMember.phone.includes(searchTerm)
      );
    })
  : [];

    return (
      <div style={styles.backgroundImage}>
      <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Staff Schedules</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <select
            style={styles.select}
            name="staffId"
            value={formData.staffId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Staff Member</option>
            {staff.map((member) => (
              <option key={member._id} value={member._id}>
                {member.staffId} : {member.name}
              </option>
            ))}
          </select>
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
            name="shiftStart"
            value={formData.shiftStart}
            onChange={handleInputChange}
            required
          />
          <input
            style={styles.input}
            type="time"
            name="shiftEnd"
            value={formData.shiftEnd}
            onChange={handleInputChange}
            required
          />
          <button style={styles.button} type="submit">
            {editingId ? 'Update Schedule' : 'Add Schedule'}
          </button>
        </form>
        </div>

        <input
          style={styles.searchInput}
          type="text"
          placeholder="Search By Id, Name, Email, Role, Or Phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

{searchTerm && (
  <div style={styles.scheduleList}>
    <h2 style={styles.subtitle}>Schedule List</h2>
    {filteredSchedules.map((schedule) => (
      schedule && schedule.staffId && (
        <div key={schedule._id} style={styles.scheduleCard}>
          <h3>Staff ID : {schedule.staffId.staffId}</h3>
          <p>Name : {schedule.staffId.name}</p>
          <p>Email : {schedule.staffId.email}</p>
          <p>Role : {schedule.staffId.role}</p>
          <p>Phone : {schedule.staffId.phone}</p>
          <p>Date: {new Date(schedule.date).toLocaleDateString()}</p>
          <p>Shift: {schedule.shiftStart} - {schedule.shiftEnd}</p>
          <div style={styles.cardActions}>
            <button style={styles.editButton} onClick={() => handleEdit(schedule)}>Edit</button>
            <button style={styles.deleteButton} onClick={() => handleDelete(schedule._id)}>Delete</button>
          </div>
        </div>
      )
    ))}
  </div>
)}

{showDeleteConfirm && (
  <div style={styles.overlay}>
    <div style={styles.popup}>
      <p>Are you sure you want to delete this schedule?</p>
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
    select: {
      margin: '10px 0',
      padding: '10px',
      fontSize: '16px',
      borderRadius: '4px',
      border: '1px solid #ddd',
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
    scheduleList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px',
    },
    subtitle: {
      fontSize: '24px',
      marginBottom: '15px',
      gridColumn: '1 / -1',
      color: '#2c3e50',
    },
    scheduleCard: {
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
  };

  export default StaffSchedulePage;