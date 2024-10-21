import React, { useState, useEffect } from 'react';
import backgroundImage from '../../images/mediback.jpg';
import dischargeService from '../../services/dischargeService';
import patientService from '../../services/patientService';
import { useNavigate } from 'react-router-dom'; // Ensure you import useNavigate

const PendingPaymentView = () => {
    const [pendingPayments, setPendingPayments] = useState([]);
    const [patient, setPatient] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate(); 

    useEffect(() => {
        fetchPendingPayments();
    }, []);

    const fetchPendingPayments = async () => {
        const patientData = await patientService.getPatientByEmail(user.email);
        setPatient(patientData);
        const data = await dischargeService.getDischargeByPatientId(patientData.patientId);
        setPendingPayments(data);
    };

    const handlePayment = async (payment) => {
        navigate(`/paymentPage/${payment.amountPaid}/${payment._id}`); // Pass amount and ID
        console.log(`Processing payment for amount: ${payment.amountPaid}`); 
    };

    return (
        <div style={styles.backgroundImage}>
            <div style={styles.container}>
                <h1 style={styles.title}>Pending Payments</h1>
                <div style={styles.paymentList}>
                    {pendingPayments.map((payment) => (
                        !payment.paid && ( // Only show unpaid payments
                            <div key={payment._id} style={styles.paymentCard}>
                                <p>Date: {new Date(payment.dischargeDate).toLocaleDateString()}</p>
                                <p>Amount: ${payment.amountPaid}</p>
                                <p>Patient: {patient.name}</p>
                                <p>Notes: {payment.notes}</p>
                                <button
                                    style={styles.payButton}
                                    onClick={() => handlePayment(payment)}
                                >
                                    Pay
                                </button>
                            </div>
                        )
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
    paymentList: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
    },
    paymentCard: {
        backgroundColor: '#f9f9f9',
        padding: '15px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    backgroundImage: {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        minHeight: '100vh',
    },
    payButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '10px',
    },

};

export default PendingPaymentView;
