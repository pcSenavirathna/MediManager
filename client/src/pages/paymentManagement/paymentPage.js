import React, { useState } from 'react';
import './PaymentPage.css';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import OtpModal from './OtpModal'; // Import the OTP modal
import dischargeService from '../../services/dischargeService';


const PaymentPage = () => {
	const [paymentDetails, setPaymentDetails] = useState({
		fullName: '',
		cardNumber: '',
		bank: '',
		expiryDate: '',
		cvc: '',
	});
	const [errors, setErrors] = useState([]);
	const { amount, id } = useParams(); 
	const [isOtpModalOpen, setIsOtpModalOpen] = useState(false); // State to control OTP modal
	const navigate = useNavigate(); // Initialize useNavigate for redirection

	const pharmacyBill = 500;
	const tax = 0;
	const discount = 0;


	const totalAmount = parseFloat(amount) + pharmacyBill - discount + tax;

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		if (name === 'expiryDate') {
			let formattedValue = value.replace(/\D/g, '');
			if (formattedValue.length >= 2) {
				formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
			}
			if (formattedValue.length < 5 && formattedValue.length === 2) {
				formattedValue = formattedValue.slice(0, 2);
			}
			setPaymentDetails({ ...paymentDetails, [name]: formattedValue });
		} else {
			setPaymentDetails({ ...paymentDetails, [name]: value });
		}
	};

	const validatePaymentDetails = () => {
		const newErrors = [];

		if (!paymentDetails.fullName) {
			newErrors.push('Full name is required');
		}

		if (!paymentDetails.bank) {
			newErrors.push('Bank name is required');
		}

		if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(paymentDetails.cardNumber)) {
			newErrors.push('Card number must be a valid 16-digit number');
		}

		const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
		if (!expiryRegex.test(paymentDetails.expiryDate)) {
			newErrors.push('Expiry date must be in MM/YY format');
		} else {
			const [month, year] = paymentDetails.expiryDate.split('/');
			const currentYear = new Date().getFullYear() % 100;
			const currentMonth = new Date().getMonth() + 1;

			if (parseInt(month, 10) < 1 || parseInt(month, 10) > 12) {
				newErrors.push('Month must be between 01 and 12');
			}

			if (parseInt(year, 10) < currentYear || (parseInt(year, 10) === currentYear && parseInt(month, 10) < currentMonth)) {
				newErrors.push('Expiry date must be in the future');
			}
		}

		if (!/^\d{3}$/.test(paymentDetails.cvc)) {
			newErrors.push('CVC must be a 3-digit number');
		}

		setErrors(newErrors);
		return newErrors.length === 0;
	};

	const handlePayment = () => {
		if (validatePaymentDetails()) {
			setIsOtpModalOpen(true); // Open OTP modal if validation passes
		} else {
			console.log('Payment validation failed', errors);
		}
	};

	const handleOtpSubmit = async (otp) => {
		if (otp === '111111') {
			alert("Payment successfully processed!");

			try {
				await dischargeService.markDischargeAsPaid(id); // Mark the discharge as paid
				navigate('/payments'); // Redirect to ViewPendingPayments page
			} catch (error) {
				console.error('Error marking discharge as paid:', error);
				alert("Failed to process payment. Please try again."); // Alert user on failure
			}
		} else {
			alert("Incorrect OTP. Please try again."); // Alert for incorrect OTP
		}
	};

	const handleCardNumberChange = (e) => {
		let { value } = e.target;
		value = value.replace(/\D/g, '');
		value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
		setPaymentDetails({ ...paymentDetails, cardNumber: value });
	};

	return (
		<div className="payment-container">
			<div className="bill-section">
				<h2>Your Bill</h2>
				<div className="bill-details">
					<p>Hospital Charges: <span>Rs. {amount}</span></p>
					<p>Pharmacy Bill: <span>Rs. {pharmacyBill}</span></p>
					<p>Discounts: <span>Rs. {discount}</span></p>
					<hr />
					<p>Tax: <span>{tax}%</span></p>
					<p>Total Amount: <span>Rs. {totalAmount}</span></p>
				</div>
			</div>

			<div className="payment-section">
				<h2>Payment Gateway</h2>

				{errors.length > 0 && (
					<div className="error-messages">
						<ul>
							{errors.map((error, index) => (
								<li key={index}>{error}</li>
							))}
						</ul>
					</div>
				)}

				<div className="payment-form">
					<input
						type="text"
						name="fullName"
						placeholder="Full Name"
						value={paymentDetails.fullName}
						onChange={handleInputChange}
					/>

					<select
						name="bank"
						value={paymentDetails.bank}
						onChange={handleInputChange}
					>
						<option value="">Select Bank</option>
						<option value="Bank of Ceylon">Bank of Ceylon</option>
						<option value="Peoples Bank">Peoples Bank</option>
						<option value="National Savings Bank">National Savings Bank</option>
						<option value="Housing Development Finance Corporation (HDFC)">
							Housing Development Finance Corporation (HDFC)
						</option>
						<option value="Lankaputhra Development Bank">Lankaputhra Development Bank</option>
						<option value="Pradeshiya Sanwardena Bank">Pradeshiya Sanwardena Bank</option>
						<option value="Sri Lanka Savings Bank">Sri Lanka Savings Bank</option>
						<option value="Employment Trust Fund Board">Employment Trust Fund Board</option>
					</select>

					<input
						type="text"
						name="cardNumber"
						placeholder="Card Number"
						value={paymentDetails.cardNumber}
						onChange={handleCardNumberChange}
						maxLength={19}
						pattern="[0-9 ]{19}"
						title="Enter a valid 16-digit card number (e.g., 4598 2548 1487 3252)"
					/>

					<div className="card-info">
						<input
							type="text"
							name="expiryDate"
							placeholder="MM/YY"
							value={paymentDetails.expiryDate}
							onChange={handleInputChange}
							maxLength="5"
							pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
						/>

						<input
							type="text"
							name="cvc"
							placeholder="CVC"
							value={paymentDetails.cvc}
							onChange={handleInputChange}
							maxLength={3}
						/>
					</div>

					<button onClick={handlePayment}>Pay</button>
				</div>
			</div>

			{/* Render the OTP Modal */}
			{isOtpModalOpen && (
				<OtpModal
					onClose={() => setIsOtpModalOpen(false)}
					onSubmit={handleOtpSubmit}
				/>
			)}
		</div>
	);
};

export default PaymentPage;
