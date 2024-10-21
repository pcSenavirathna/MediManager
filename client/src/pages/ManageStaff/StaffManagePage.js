  import React, { useState, useEffect } from 'react';
  import staffService from '../../services/staffService';
  import backgroundImage from '../../images/mediback.jpg';

  const StaffManagePage = () => {
    const [staff, setStaff] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: '' });
    const [editingId, setEditingId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [staffToDelete, setStaffToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
      fetchStaff();
    }, []);

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
        await staffService.updateStaff(editingId, formData);
      } else {
        await staffService.createStaff(formData);
      }
      setFormData({ name: '', email: '', phone: '', role: '' });
      setEditingId(null);
      fetchStaff();
    };

    const handleEdit = (staffMember) => {
      setFormData(staffMember);
      setEditingId(staffMember._id);
    };

    const handleDelete = (id) => {
      setStaffToDelete(id);
      setShowDeleteConfirm(true);
    };
    
    const confirmDelete = async () => {
      if (staffToDelete) {
        await staffService.deleteStaff(staffToDelete);
        fetchStaff();
        setShowDeleteConfirm(false);
        setStaffToDelete(null);
      }
    };

    const filteredStaff = searchTerm
  ? staff.filter(staffMember => {
      const searchLower = searchTerm.toLowerCase();
      return (
        staffMember.name.toLowerCase().includes(searchLower) ||
        staffMember.email.toLowerCase().includes(searchLower) ||
        staffMember.role.toLowerCase().includes(searchLower) ||
        staffMember.phone.includes(searchTerm) ||
        staffMember.staffId.toLowerCase().includes(searchLower)
      );
    })
  : [];

    return (
      <div>
        <div style={styles.backgroundImage}>
        <div style={styles.container}>
        <div style={styles.formContainer}>
          <h1 style={styles.title}>Manage Staff</h1>
          
          
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
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="Role"
                required
              />
              <button style={styles.button} type="submit">
                {editingId ? 'Update Staff' : 'Add Staff'}
              </button>
            </form>
          </div>
          <input
          style={styles.searchInput}
          type="text"
          placeholder="Search by name, email, role, phone, or staff ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

{searchTerm && (
  <div style={styles.staffList}>
    <h2 style={styles.subtitle}>Staff List</h2>
    {filteredStaff.map((staffMember) => (
      <div key={staffMember._id} style={styles.staffCard}>
        <h3>Staff ID : {staffMember.staffId}</h3>
        <p>Name  : {staffMember.name}</p>
        <p>Email : {staffMember.email}</p>
        <p>Phone : {staffMember.phone}</p>
        <p>Role  : {staffMember.role}</p>
        <div style={styles.cardActions}>
          <button style={styles.editButton} onClick={() => handleEdit(staffMember)}>Edit</button>
          <button style={styles.deleteButton} onClick={() => handleDelete(staffMember._id)}>Delete</button>
        </div>
      </div>
    ))}
  </div>
)}
{showDeleteConfirm && (
  <div style={styles.overlay}>
    <div style={styles.popup}>
      <p>Are you sure you want to delete this staff member?</p>
      <div style={styles.popupButtons}>
        <button style={styles.confirmButton} onClick={confirmDelete}>Yes</button>
        <button style={styles.cancelButton} onClick={() => setShowDeleteConfirm(false)}>No</button>
      </div>
    </div>
  </div>
)}
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
      button: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '10px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      },
      staffList: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(255px, 1fr))',
        gap: '20px',
      },
      subtitle: {
        fontSize: '24px',
        marginBottom: '15px',
        gridColumn: '1 / -1',
        color: '#2c3e50',
      },
      staffCard: {
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
  export default StaffManagePage;
