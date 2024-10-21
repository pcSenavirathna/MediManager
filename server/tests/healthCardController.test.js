const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const healthCardRoutes = require('../routes/healthcardRoutes');
const HealthCard = require('../models/HealthCard');
const app = express();

app.use(express.json());
app.use('/api/healthCard', healthCardRoutes);

// Mock MongoDB with Jest
jest.mock('../models/HealthCard');

describe('HealthCard Controller', () => {
	it('should update the QRKey for an existing health card', async () => {
		const mockNicNo = '990999V';
		const mockQRKey = 'AB123456';

		HealthCard.findOneAndUpdate.mockResolvedValue({
			name: 'John Doe',
			nicNo: mockNicNo,
			qrKey: mockQRKey,
			email: 'john@example.com',
			bloodGroup: 'A+'
		});

		const res = await request(app)
			.post('/api/healthCard/updateQRKey')
			.send({ nicNo: mockNicNo, qrKey: mockQRKey });

		expect(res.statusCode).toEqual(200);
		expect(res.body.qrKey).toEqual(mockQRKey);
	});
});
