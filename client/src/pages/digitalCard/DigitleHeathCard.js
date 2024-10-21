import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './DigitleHeathCard.css';
import healthCardService from '../../services/healthCardService';

const DigitleHeathCard = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		age: '',
		nicNo: '',
		bloodGroup: '',
		gender: '',
	});

	useNavigate(); // Initialize useNavigate

	useEffect(() => {
		// Retrieve user info from localStorage when the component mounts
		const user = JSON.parse(localStorage.getItem('user'));
		if (user) {
			setFormData((prevState) => ({
				...prevState,
				name: user.name || '',  // Ensure name is retrieved
				email: user.email || ''  // Ensure email is retrieved
			}));
		}
	}, []); // This effect runs only once when the component mounts

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validate NIC input on submit
		const regex = /^(?:\d{12}|\d{9}[Vv]?)$/; // regex for 12 digits or 9 digits with 'V'/'v'
		if (!regex.test(formData.nicNo)) {
			alert('Please enter a valid NIC No: 12 digits or 9 digits followed by "V" or "v".');
			return; // Stop submission if validation fails
		}

		try {
			const result = await healthCardService.submitHealthCard(formData);
			alert('Health card activated successfully.');

			// Store health card data in local storage
			localStorage.setItem('healthCard', JSON.stringify(result)); // Save the created health card
			window.location.href = '/'; // Redirect to home page
		} catch (error) {
			console.error('Error submitting the form', error);
			alert('Error submitting the form');
		}
	};


	return (
		<div className="containerr">
			<div className="cardd">
				<h2>FILL INTO GET YOUR HEALTH CARD</h2>
				<form className="formm" onSubmit={handleSubmit}>
					<input
						type="email"
						placeholder="someone@gmail.com"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
						disabled
					/>
					<input
						type="text"
						placeholder="Your name"
						name="name"
						value={formData.name}
						onChange={handleChange}
						required
					/>
					<input
						type="text"
						placeholder="NIC No"
						name="nicNo"
						value={formData.nicNo}
						onChange={handleChange}
						maxLength={12}
						required
					/>
					<input
						type="number"
						placeholder="Age"
						name="age"
						value={formData.age}
						onChange={handleChange}
						required
					/>
					<select
						name="bloodGroup"
						className="dropdown"
						value={formData.bloodGroup}
						onChange={handleChange}
						required
					>
						<option value="" disabled>Select your blood group</option>
						<option value="A+">A+</option>
						<option value="A-">A-</option>
						<option value="B+">B+</option>
						<option value="B-">B-</option>
						<option value="AB+">AB+</option>
						<option value="AB-">AB-</option>
						<option value="O+">O+</option>
						<option value="O-">O-</option>
					</select>
					<div className="radio-groupp">
						<label>Sex:</label>
						<label>
							<input
								type="radio"
								name="gender"
								value="Male"
								checked={formData.gender === 'Male'}
								onChange={handleChange}
								required
							/>
							Male
						</label>
						<label>
							<input
								type="radio"
								name="gender"
								value="Female"
								checked={formData.gender === 'Female'}
								onChange={handleChange}
								required
							/>
							Female
						</label>
						<label>
							<input
								type="radio"
								name="gender"
								value="Other"
								checked={formData.gender === 'Other'}
								onChange={handleChange}
							/>
							Other
						</label>
					</div>
					<button type="submit">Submit</button>
				</form>
			</div>
		</div>
	);
};

export default DigitleHeathCard;
