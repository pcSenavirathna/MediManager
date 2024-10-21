import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './AccessCard.css'; // Include your CSS styles

const AccessCard = () => {
	const [healthCard, setHealthCard] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [uniqueKey, setUniqueKey] = useState(''); // State for unique key
	const qrRef = useRef(null); // Create a reference for the QR code

	useEffect(() => {
		const fetchHealthCard = async () => {
			const user = JSON.parse(localStorage.getItem('user'));
			if (user && user.email) {
				try {
					const response = await axios.get(`http://localhost:5000/api/healthCard/exists/${user.email}`);
					if (response.data.exists) {
						const cardResponse = await axios.get(`http://localhost:5000/api/healthCard/${user.email}`);
						setHealthCard(cardResponse.data);
					} else {
						setError('No health card found for this user.');
					}
				} catch (err) {
					console.error('Error fetching health card:', err);
					setError('Error fetching health card data.');
				}
			} else {
				setError('User not logged in.');
			}
			setLoading(false);
		};

		fetchHealthCard();
	}, []);

	useEffect(() => {
		// Generate a unique key when health card data is retrieved
		if (healthCard) {
			const generatedKey = generateUniqueKey(healthCard.name, healthCard.nicNo);
			setUniqueKey(generatedKey);
			// After generating the key, update it in the database
			updateQRKeyInDB(generatedKey, healthCard.nicNo);
		}
	}, [healthCard]);

	const generateUniqueKey = (name, nicNo) => {
		// Extract first two letters from the name (case insensitive)
		const firstTwoLetters = name.substring(0, 2).toUpperCase();
		// Extract last six characters from the NIC number
		const lastSixDigits = nicNo.slice(-6);
		// Combine to create unique key
		return `${firstTwoLetters}${lastSixDigits}`;
	};

	const updateQRKeyInDB = async (qrKey, nicNo) => {
		try {
			await axios.post(`http://localhost:5000/api/healthCard/updateQRKey`, { qrKey, nicNo });
		} catch (err) {
			console.error('Error updating QRKey in the database:', err);
		}
	};

	const handleDownloadPNG = () => {
		html2canvas(qrRef.current).then((canvas) => {
			const link = document.createElement('a');
			link.download = 'qrcode.png';
			link.href = canvas.toDataURL('image/png');
			link.click();
		});
	};

	const handleDownloadPDF = () => {
		html2canvas(qrRef.current).then((canvas) => {
			const imgData = canvas.toDataURL('image/png');
			const pdf = new jsPDF();
			pdf.addImage(imgData, 'PNG', 10, 10, 180, 160); // Adjust PDF dimensions as needed
			pdf.save('qrcode.pdf');
		});
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>{error}</p>;
	if (!healthCard) return null;

	const { name, bloodGroup, nicNo } = healthCard;
	const qrData = JSON.stringify({ name, bloodGroup, nicNo });

	return (
		<div className="glass-card">
			<div className="card-content">
				<div className="download-buttons">
					<button onClick={handleDownloadPNG}>Download PNG</button>
					<button
						onClick={handleDownloadPDF}
						onMouseEnter={(e) => e.target.style.background = '#8B0000'}
						onMouseLeave={(e) => e.target.style.background = 'red'}
						style={{ background: 'lightred', transition: 'background-color 0.3s ease' }}
					>
						Download PDF
					</button>

				</div>
				<h2>My Health Card</h2>
				<div className="qr-code" ref={qrRef}>
					<QRCodeCanvas value={qrData} size={270} />
					<p style={{
						textAlign: 'center',
						fontSize: '1.2rem',
						marginTop: '-5px',
						background: 'black',
						marginBottom: '5px',
					}}>
						<strong>QR Key:</strong> {uniqueKey}</p>
				</div>
				<div className="card-details">
					<p><strong>Name:</strong> {name}</p>
					<p><strong>NIC No:</strong> {nicNo}</p>
					<p><strong>Blood Group:</strong> {bloodGroup}</p>
				</div>
			</div>
		</div>
	);
};

export default AccessCard;
