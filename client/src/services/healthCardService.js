import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const submitHealthCard = async (data) => {
	const response = await axios.post(`${API_URL}/healthCard/submit`, data);
	return response.data;
};

const healthCardService = {
	submitHealthCard,
};

export default healthCardService;
