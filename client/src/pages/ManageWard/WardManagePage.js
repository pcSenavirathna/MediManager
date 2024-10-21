import React, { useState, useEffect } from 'react';
import wardService from '../../services/wardService';
import 'bootstrap/dist/css/bootstrap.min.css';
import backgroundImage from '../../images/mediback.jpg';
import { useNavigate } from 'react-router-dom';

const WardManagePage = () => {
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState(null);
  const [hoveredBed, setHoveredBed] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [patientId, setPatientId] = useState('');
  const [dialogAction, setDialogAction] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchWards();
  }, []);

  const fetchWards = async () => {
    const data = await wardService.getAllWards();
    setWards(data);
  };

  const handleWardSelect = async (wardNo) => {
    if (wardNo == "W000") {
      setSelectedWard(null);
    } else {
      const ward = await wardService.getWardById(wardNo);
      setSelectedWard(ward);
    }
  };

  const handleBedClick = (bed) => {
    setSelectedBed(bed);
    if (bed.isOccupied) {
      setDialogAction('remove');
      setPatientId(bed.patientId);
    } else {
      setDialogAction('add');
      setPatientId('');
    }
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedBed(null);
    setPatientId('');
  };

  const handlePatientAction = async () => {
    if (selectedBed) {
      const updatedBed = {
        ...selectedBed,
        isOccupied: dialogAction === 'add',
        patientId: dialogAction === 'add' ? patientId : null
      };
      await wardService.updateBedOccupancy(selectedWard.wardNo, selectedBed.bedNo, updatedBed.isOccupied, updatedBed.patientId);
      setSelectedWard({
        ...selectedWard,
        beds: selectedWard.beds.map(b => b.bedNo === selectedBed.bedNo ? updatedBed : b)
      });
      if (dialogAction != 'add') {
        navigate('/discharge/' + patientId);
      }
    }
    handleDialogClose();
  };

  return (
    <div style={styles.backgroundImage}>
      <div className="container-fluid " style={styles.container}>
        <h1 className="text-center" style={styles.title}>Ward Management</h1>
        <div className="row" style={{ display: 'flex', alignItems: 'flex-start', marginTop: '5vh' }}>
          {/* Ward Selection and Details Column */}
          <div className="col-md-4 mb-3" style={styles.col}>
            <div className="card shadow-sm mb-3" style={styles.card}>
              <div className="card-body mb-3">
                <h5 className="card-title mb-3" style={styles.cardTitle}>Our ward list</h5>
                <p>Select ward to manage</p>
                <select className="form-select mb-3" onChange={(e) => handleWardSelect(e.target.value)} style={styles.select}>
                  <option value="W000">Choose a ward</option>
                  {wards.map(ward => (
                    <option key={ward.wardNo} value={ward.wardNo}>
                      {ward.wardNo} - {ward.wardType}
                    </option>
                  ))}
                </select>
                {selectedWard && (
                  <div>
                    <h6 style={styles.subtitle}>Ward Details</h6>
                    <p>Ward No: {selectedWard.wardNo}</p>
                    <p>Type: {selectedWard.wardType}</p>
                    <p>Total Beds: {selectedWard.beds.length}</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Hovered Bed Info Column */}
          <div className="col-md-4">
            {selectedWard && (
              <div className="card mb-3 shadow-sm" style={styles.card}>
                <div className="card-body">
                  <h5 className="card-title" style={styles.cardTitle}>Bed Layout</h5>
                  <div style={styles.bedGrid}>
                    {selectedWard.beds.map(bed => (
                      <div
                        key={bed.bedNo}
                        style={{
                          ...styles.bed,
                          backgroundColor: bed.isOccupied ? '#e74c3c' : '#2ecc71',
                        }}
                        onClick={() => handleBedClick(bed)}
                        onMouseEnter={() => setHoveredBed(bed)}
                        onMouseLeave={() => setHoveredBed(null)}
                      >
                        {bed.bedNo}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dialog Column */}
          <div className="col-md-4">

            {isDialogOpen && (
              <div className="card shadow-sm" style={styles.card}>
                <div className="card-body">
                  <h5 className="card-title" style={styles.cardTitle}>{dialogAction === 'add' ? 'Add Patient' : 'Remove Patient'}</h5>
                  {dialogAction === 'add' ? (
                    <input
                      type="text"
                      className="form-control mb-3"
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                      placeholder="Enter Patient ID"
                      style={styles.input}
                    />
                  ) : (
                    <p>Are you sure you want to remove patient {patientId}?</p>
                  )}
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-primary" onClick={handlePatientAction} style={styles.button}>
                      {dialogAction === 'add' ? 'Add' : 'Remove'}
                    </button>
                    <button className="btn btn-secondary" onClick={handleDialogClose} style={styles.button}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
            {hoveredBed && (
              <div className="card shadow-sm" style={styles.card}>
                <div className="card-body">
                  <h5 className="card-title" style={styles.cardTitle}>Bed Information</h5>
                  <p>Bed No: {hoveredBed.bedNo}</p>
                  <p>Status: {hoveredBed.isOccupied ? 'Occupied' : 'Available'}</p>
                  {hoveredBed.isOccupied && <p>Patient ID: {hoveredBed.patientId}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {

    minHeight: 'calc(100vh - 100px)', // Adjust 100px based on your footer height
    paddingBottom: '20px',
  },
  title: {
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  card: {
    borderRadius: '10px',
    transition: 'box-shadow 0.3s ease',
    '&:hover': {
      boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
    },
  },
  cardTitle: {
    color: '#34495e',
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#7f8c8d',
    fontWeight: 'bold',
  },
  select: {
    borderRadius: '5px',
    border: '1px solid #bdc3c7',
  },
  bedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
    gap: '10px',
  },
  backgroundImage: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',

  },
  bed: {
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    color: 'white',
    fontSize: '10px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
  input: {
    borderRadius: '5px',
    border: '1px solid #bdc3c7',
  },
  button: {
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  },
};

export default WardManagePage;