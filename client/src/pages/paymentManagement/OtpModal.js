// OtpModal.js
import React, { useState } from 'react';
import './OtpModal.css'; // Import any CSS you want to use for the modal

const OtpModal = ({ onClose, onSubmit }) => {
	const [otp, setOtp] = useState('');

	const handleInputChange = (e) => {
		setOtp(e.target.value);
	};


	const handleSubmit = () => {
		if (otp.length === 6) { // Assuming OTP is 6 digits
			onSubmit(otp);
			onClose();
		} else {
			alert("Please enter a valid 6-digit OTP");
		}
	};

	return (
		<div className="modal-overlayy">
			<div className="modal-contentt">
				<h2>Enter OTP</h2>
				<input
					type="text"
					value={otp}
					onChange={handleInputChange}
					maxLength={6}
					placeholder="Enter OTP"
					className='otp-input'
				/>
				<button onClick={handleSubmit}>Submit</button>
				<button onClick={onClose}>Cancel</button>
			</div>
		</div>
	);
};

export default OtpModal;
