import React, { useState } from 'react';
import { QrReader } from 'react-qr-scanner'; // Correct import
import axios from 'axios';
import './ScanningCard.css';
import { jsPDF } from 'jspdf';

const ScanningCard = () => {
	const [scanning, setScanning] = useState(false);
	const [qrKey, setQrKey] = useState('');
	const [patientData, setPatientData] = useState(null);
	const [error, setError] = useState('');

	const handleScan = (result, error) => {
		if (!!result) {
			setQrKey(result?.text); // Adjust for newer API response
			fetchPatientData(result?.text); // Fetch patient data using scanned QR key
			setScanning(false);
		}

		if (!!error) {
			console.error(error);
			setError('Error scanning QR code');
		}
	};

	const fetchPatientData = async (qrKey) => {
		try {
			// Fetching patient data from the server using the qrKey
			const response = await axios.get(`http://localhost:5000/api/healthCard/get/${qrKey}`);

			if (response.data) {
				setPatientData(response.data);
				setError('');
			} else {
				setPatientData(null);
				setError('Patient not found or error fetching data.');
			}
		} catch (err) {
			console.error(err);
			setPatientData(null);
			setError('Patient not found or error fetching data.');
		}
	};

	const handleManualSubmit = (e) => {
		e.preventDefault();
		fetchPatientData(qrKey);
	};

	const startScanning = () => {
		// Check if getUserMedia is supported
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			setScanning(true);
		} else {
			setError('Camera not supported in this browser.');
		}
	};

	const downloadPdf = () => {
		const doc = new jsPDF({
			margins: { top: 5, bottom: 5, left: 5, right: 5 }
		});

		const pageHeight = doc.internal.pageSize.height;
		let y = 20; // Start position on page

		doc.setFontSize(18);
		doc.setTextColor(0, 128, 0); // Set text color to green (RGB: 0, 128, 0)
		doc.text('Medical Report', doc.internal.pageSize.width / 2, y, { align: 'center' });
		y += 10; // Move down

		doc.setTextColor(0, 0, 0); // Reset the text color to black

		if (patientData) {
			doc.setFontSize(12);

			const addText = (text, increment = 10) => {
				if (y + increment >= pageHeight - 10) {
					doc.addPage();
					y = 10; // Reset y to the top margin
				}
				doc.text(text, 5, y);
				y += increment;
			};

			addText(`Name: ${patientData.name}`);
			addText(`Age: ${patientData.age} years old`);
			addText(`Gender: ${patientData.gender}`);
			addText(`NIC No: ${patientData.nicNo}`);
			addText(`Blood Group: ${patientData.bloodGroup}`);
			addText(`Email: ${patientData.email}`);
			addText(`Medical Record Number: ${patientData.qrKey}`);

			// Presenting Complaint
			doc.setFont('helvetica', 'bold');
			addText('Presenting Complaint:');
			doc.setFont('helvetica', 'normal');
			addText('The patient presented with persistent chest pain, shortness of breath, and fatigue for the last two days.');

			// History of Present Illness
			doc.setFont('helvetica', 'bold');
			addText('History of Present Illness:');
			doc.setFont('helvetica', 'normal');
			addText('The patient reports intermittent chest discomfort that worsened on exertion and improved with rest.');
			addText('No history of nausea, vomiting, or dizziness. The patient also reports increased fatigue over the last week.');

			// Past Medical History
			doc.setFont('helvetica', 'bold');
			addText('Past Medical History:');
			doc.setFont('helvetica', 'normal');
			addText('• Hypertension: Diagnosed 10 years ago.');
			addText('• Type 2 Diabetes: Diagnosed 8 years ago, controlled on medication.');
			addText('• Previous Surgeries: Appendectomy (2015).');
			addText('• Medications: Metformin 500 mg, Amlodipine 10 mg.');
			addText('• Allergies: No known drug allergies.');

			// Family History
			doc.setFont('helvetica', 'bold');
			addText('Family History:');
			doc.setFont('helvetica', 'normal');
			addText('• Father: Passed away due to a heart attack at the age of 65.');
			addText('• Mother: Hypertension, alive at 72 years.');

			// Physical Examination
			doc.setFont('helvetica', 'bold');
			addText('Physical Examination:');
			doc.setFont('helvetica', 'normal');
			addText('General Appearance: Alert and oriented, in mild distress due to chest pain.');
			addText('Vital Signs:');
			addText('• Blood Pressure: 160/95 mmHg');
			addText('• Heart Rate: 90 bpm');
			addText('• Respiratory Rate: 20 breaths/min');
			addText('• Temperature: 98.7°F');
			addText('• Oxygen Saturation: 94% on room air');

			// Cardiovascular and Respiratory Examination
			addText('Cardiovascular Examination: Normal S1 and S2 sounds, no murmurs. Mild jugular venous distension noted.');
			addText('Respiratory Examination: Clear to auscultation bilaterally, no wheezing or crackles.');

			// Investigations
			doc.setFont('helvetica', 'bold');
			addText('Investigations:');
			doc.setFont('helvetica', 'normal');
			addText('• ECG: Sinus tachycardia, no acute ischemic changes.');
			addText('• Chest X-Ray: Normal heart size, clear lung fields.');
			addText('• Blood Tests: CBC: Within normal limits.');
			addText('• Blood Sugar (Fasting): 120 mg/dL.');
			addText('• Lipid Profile: Elevated LDL cholesterol at 160 mg/dL.');

			// Diagnosis
			doc.setFont('helvetica', 'bold');
			addText('Diagnosis:');
			doc.setFont('helvetica', 'normal');
			addText('Likely unstable angina, hypertensive heart disease, and poorly controlled diabetes.');

			// Plan
			doc.setFont('helvetica', 'bold');
			addText('Plan:');
			doc.setFont('helvetica', 'normal');
			addText('• Admission to Cardiology Unit for further evaluation and management.');
			addText('• Start anti-anginal therapy with nitroglycerin and beta-blockers.');
			addText('• Optimize diabetes control with insulin adjustments.');
			addText('• Cardiac enzyme tests and repeat ECG to rule out myocardial infarction.');
			addText('• Cardiology consult for potential coronary angiography.');

			// Doctor's information and date
			doc.setFont('helvetica', 'bold');
			const pageWidth = doc.internal.pageSize.width;

			doc.text(`Doctor's Name: Dr. Emily Carter`, pageWidth - 10, 500, { align: 'right' });
			doc.text(`Date: 15th October 2024`, pageWidth - 10, 510, { align: 'right' });
		}

		// Save the PDF
		doc.save('medical_report.pdf');
	};



	return (
		<div className="scanning-card-containerr">
			<h22>Scan QR Code or Enter QR Key check medical report</h22>
			{scanning ? (
				<div style={{ width: '300px', height: '300px' }}>
					<QrReader
						onResult={handleScan}
						constraints={{ facingMode: 'environment' }} // Use back camera on mobile
						style={{ width: '100%', height: 'auto' }}
					/>
				</div>
			) : (
					<div className="card-glasss manual-entryy">
						<form onSubmit={handleManualSubmit}>
							<input
								type="text"
								placeholder="Enter QR Key"
								value={qrKey}
								onChange={(e) => setQrKey(e.target.value)}
								required
								maxLength={8}
								className="glass-input"
							/>
							<button type="submit" className="glass-buttonn">Check</button>
						</form>
						<button onClick={startScanning} className="glass-buttonn">Scan QR Code</button>
				</div>
			)}

			{error && <p className="error">{error}</p>}
			{patientData && (
				<div className="patient-data">

					<div style={{ textAlign: 'right' }}>
						<button onClick={downloadPdf} className="glass-button" style={{ maxWidth: '300px' }}>
							Download Medical Report
						</button>
					</div>
					<h1 style={{ color: 'green', textAlign: 'center' }}>Medical Report</h1>
					<div className="medical-report">
						<p style={{ textAlign: 'left' }}><strong>Name:</strong> {patientData.name}</p>
						<p style={{ textAlign: 'left' }}><strong>Age:</strong> {patientData.age} years old</p>
						<p style={{ textAlign: 'left' }}><strong>Gender:</strong> {patientData.gender}</p>
						<p style={{ textAlign: 'left' }}><strong>NIC No:</strong> {patientData.nicNo}</p>
						<p style={{ textAlign: 'left' }}><strong>Blood Group:</strong> {patientData.bloodGroup}</p>
						<p style={{ textAlign: 'left' }}><strong>Email:</strong> {patientData.email}</p>
						<p style={{ textAlign: 'left' }}><strong>Date of Birth:</strong> 12th March 1979</p>
						<p style={{ textAlign: 'left' }}><strong>Medical Record Number:</strong> {patientData.qrKey}</p>
						<hr />
						<br />

						<h4 style={{ textAlign: 'left' }}>Presenting Complaint:</h4>
						<p style={{ textAlign: 'left' }}><ul>
							<li>The patient presented with persistent chest pain, shortness of breath, and fatigue for the last two days.</li>
						</ul>
						</p>
						<h4 style={{ textAlign: 'left' }}>History of Present Illness:</h4>
						<p style={{ textAlign: 'left' }}>
							<ul>
								<li>The patient reports intermittent chest discomfort that worsened on exertion and improved with rest. No history of nausea, vomiting, or dizziness. The patient also reports increased fatigue over the last week.</li>
							</ul>
						</p>

						<h4 style={{ textAlign: 'left' }}>Past Medical History:</h4>
						<ul style={{ textAlign: 'left' }}>
							<li>Hypertension: Diagnosed 10 years ago.</li>
							<li>Type 2 Diabetes: Diagnosed 8 years ago, controlled on medication.</li>
							<li>Previous Surgeries: Appendectomy (2015).</li>
							<li>Medications: Metformin 500 mg, Amlodipine 10 mg.</li>
							<li>Allergies: No known drug allergies.</li>
						</ul>

						<h4 style={{ textAlign: 'left' }}>Family History:</h4>
						<ul style={{ textAlign: 'left' }}>
							<li>Father: Passed away due to a heart attack at the age of 65.</li>
							<li>Mother: Hypertension, alive at 72 years.</li>
						</ul>
						<hr />
						<h3 style={{ textAlign: 'left' }}>Physical Examination:</h3>
						<p style={{ textAlign: 'left' }}><strong>General Appearance:</strong> Alert and oriented, in mild distress due to chest pain.</p>
						<p style={{ textAlign: 'left' }}><strong>Vital Signs:</strong></p>
						<ul style={{ textAlign: 'left' }}>
							<li>Blood Pressure: 160/95 mmHg</li>
							<li>Heart Rate: 90 bpm</li>
							<li>Respiratory Rate: 20 breaths/min</li>
							<li>Temperature: 98.7°F</li>
							<li>Oxygen Saturation: 94% on room air</li>
						</ul>
						<br />
						<p style={{ textAlign: 'left' }}><strong>Cardiovascular Examination:</strong> Normal S1 and S2 sounds, no murmurs. Mild jugular venous distension noted.</p>
						<p style={{ textAlign: 'left' }}><strong>Respiratory Examination:</strong> Clear to auscultation bilaterally, no wheezing or crackles.</p>
						<hr />
						<h4 style={{ textAlign: 'left' }}>Investigations:</h4>
						<ul style={{ textAlign: 'left' }}>
							<li>ECG: Sinus tachycardia, no acute ischemic changes.</li>
							<li>Chest X-Ray: Normal heart size, clear lung fields.</li>
							<li>Blood Tests: Complete Blood Count (CBC): Within normal limits.</li>
							<li>Blood Sugar (Fasting): 120 mg/dL.</li>
							<li>Lipid Profile: Elevated LDL cholesterol at 160 mg/dL.</li>
						</ul>
						<hr></hr>
						<h4 style={{ textAlign: 'left' }}>Diagnosis:</h4>
						<p style={{ textAlign: 'left' }}>Likely unstable angina, hypertensive heart disease, and poorly controlled diabetes.</p>
						<hr />
						<h4 style={{ textAlign: 'left' }}>Plan:</h4>
						<ul style={{ textAlign: 'left' }}>
							<li>Admission to Cardiology Unit for further evaluation and management.</li>
							<li>Start anti-anginal therapy with nitroglycerin and beta-blockers.</li>
							<li>Optimize diabetes control with insulin adjustments.</li>
							<li>Cardiac enzyme tests and repeat ECG to rule out myocardial infarction.</li>
							<li>Cardiology consult for potential coronary angiography.</li>
						</ul>
						<hr />
						<p style={{ textAlign: 'end' }}><strong>Doctor's Name:</strong> Dr. Emily Carter</p>
						<p style={{ textAlign: 'end' }}><strong>Date:</strong> 15th October 2024</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default ScanningCard;
