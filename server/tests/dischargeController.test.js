const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const dischargeController = require('../controllers/dischargeController');
const Discharge = require('../models/Discharge');

// Middleware
app.use(bodyParser.json());

// Define routes for testing
app.post('/api/discharge', dischargeController.createDischarge);
app.get('/api/discharge/:patientId', dischargeController.getDischargeByPatientId);
app.patch('/api/discharge/:id/mark-paid', dischargeController.markDischargeAsPaid);

// Connect to a test database before running tests
beforeAll(async () => {
	await mongoose.connect(process.env.TEST_MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Clear the database after each test
afterEach(async () => {
	await Discharge.deleteMany({});
});

// Disconnect from the database after tests
afterAll(async () => {
	await mongoose.connection.close();
});

// Unit tests
describe('Discharge Controller', () => {
	test('should create a discharge record', async () => {
		const dischargeData = {
			patientId: '123456',
			dischargeDate: new Date(),
			amountPaid: 200,
			notes: 'Patient discharged successfully'
		};

		const response = await request(app).post('/api/discharge').send(dischargeData);

		expect(response.status).toBe(201);
		expect(response.body.message).toBe('Discharge record created successfully');
		expect(response.body.discharge).toHaveProperty('_id');
		expect(response.body.discharge.patientId).toBe(dischargeData.patientId);
	});

	test('should return 400 if required fields are missing', async () => {
		const response = await request(app).post('/api/discharge').send({});

		expect(response.status).toBe(400);
		expect(response.body.message).toBe('All fields are required');
	});

	test('should get discharge records by patient ID', async () => {
		const discharge = new Discharge({
			patientId: '123456',
			dischargeDate: new Date(),
			amountPaid: 200,
			notes: 'Patient discharged successfully'
		});
		await discharge.save();

		const response = await request(app).get('/api/discharge/123456');

		expect(response.status).toBe(200);
		expect(response.body.length).toBe(1);
		expect(response.body[0].patientId).toBe('123456');
	});

	test('should return 404 if no discharge records found for patient', async () => {
		const response = await request(app).get('/api/discharge/123456');

		expect(response.status).toBe(404);
		expect(response.body.message).toBe('No discharge records found for this patient');
	});

	test('should mark a discharge as paid', async () => {
		const discharge = new Discharge({
			patientId: '123456',
			dischargeDate: new Date(),
			amountPaid: 200,
			notes: 'Patient discharged successfully',
			paid: 'false'
		});
		await discharge.save();

		const response = await request(app).patch(`/api/discharge/${discharge._id}/mark-paid`);

		expect(response.status).toBe(200);
		expect(response.body.message).toBe('Payment recorded successfully');
		expect(response.body.discharge.paid).toBe(true);
	});

	test('should return 404 if trying to mark a non-existing discharge as paid', async () => {
		const response = await request(app).patch('/api/discharge/60d5ec49f60b2c001c8b77e2/mark-paid');

		expect(response.status).toBe(404);
		expect(response.body.message).toBe('Discharge record not found');
	});
});
