
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const staffRoutes = require('../routes/staffRoutes');
const Staff = require('../models/Staff');
const auth = require('../controllers/authController');

const app = express();

app.use(express.json());
app.use('/api/staff', staffRoutes);

jest.mock('../models/Staff');
jest.mock('../controllers/authController');

describe('Staff Controller', () => {
  it('should create a new staff member', async () => {
    const mockStaff = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      role: 'Doctor'
    };

    Staff.prototype.save.mockResolvedValue(mockStaff);
    auth.register.mockResolvedValue();

    const res = await request(app)
      .post('/api/staff')
      .send(mockStaff);

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual('Staff member created successfully');
    
  });

  it('should get all staff members', async () => {
    const mockStaff = [
      { name: 'John Doe', email: 'john@example.com', role: 'Doctor' },
      { name: 'Jane Smith', email: 'jane@example.com', role: 'Nurse' }
    ];

    Staff.find.mockResolvedValue(mockStaff);

    const res = await request(app).get('/api/staff');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockStaff);
  });

  it('should update a staff member', async () => {
    const mockStaffId = 'abc123';
    const mockUpdatedStaff = {
      name: 'John Updated',
      email: 'john.updated@example.com',
      role: 'Senior Doctor'
    };

    Staff.findByIdAndUpdate.mockResolvedValue(mockUpdatedStaff);

    const res = await request(app)
      .put(`/api/staff/${mockStaffId}`)
      .send(mockUpdatedStaff);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockUpdatedStaff);
  });

  it('should delete a staff member', async () => {
    const mockStaffId = 'abc123';

    Staff.findByIdAndDelete.mockResolvedValue();

    const res = await request(app).delete(`/api/staff/${mockStaffId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Staff member deleted');
  });

  it('should get a staff member by ID', async () => {
    const mockStaffId = 'abc123';
    const mockStaff = {
      _id: mockStaffId,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Doctor'
    };

    Staff.findById.mockResolvedValue(mockStaff);

    const res = await request(app).get(`/api/staff/${mockStaffId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockStaff);
  });

  it('should return 404 when getting a non-existent staff member', async () => {
    const mockStaffId = 'nonexistent123';

    Staff.findById.mockResolvedValue(null);

    const res = await request(app).get(`/api/staff/${mockStaffId}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('Staff member not found');
  });
});
