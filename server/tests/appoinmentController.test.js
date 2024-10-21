
const request = require('supertest');
const express = require('express');
const appointmentRoutes = require('../routes/appointmentRoutes');
const Appointment = require('../models/Appointment');

const app = express();

app.use(express.json());
app.use('/api/appointments', appointmentRoutes);

jest.mock('../models/Appointment');

describe('Appointment Controller', () => {
  it('should create a new appointment', async () => {
    const mockAppointment = {
      date: '2023-05-20',
      time: '10:00',
      doctor: 'Dr. Smith',
      patient: 'John Doe',
      reason: 'Checkup'
    };

    Appointment.prototype.save.mockResolvedValue(mockAppointment);

    const res = await request(app)
      .post('/api/appointments')
      .send(mockAppointment);

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual('Appointment created successfully');
    expect(res.body).toHaveProperty('appointment');
    expect(res.body.appointment).toEqual(mockAppointment);
  });

  it('should get all appointments', async () => {
    const mockAppointments = [
      { date: '2023-05-20', time: '10:00', doctor: 'Dr. Smith', patient: 'John Doe' },
      { date: '2023-05-21', time: '11:00', doctor: 'Dr. Johnson', patient: 'Jane Smith' }
    ];

    Appointment.find.mockResolvedValue(mockAppointments);

    const res = await request(app).get('/api/appointments');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockAppointments);
  });

  it('should update an appointment', async () => {
    const mockAppointmentId = 'abc123';
    const mockUpdatedAppointment = {
      date: '2023-05-22',
      time: '14:00',
      doctor: 'Dr. Brown',
      patient: 'Alice Johnson'
    };

    Appointment.findByIdAndUpdate.mockResolvedValue(mockUpdatedAppointment);

    const res = await request(app)
      .put(`/api/appointments/${mockAppointmentId}`)
      .send(mockUpdatedAppointment);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockUpdatedAppointment);
  });

  it('should delete an appointment', async () => {
    const mockAppointmentId = 'abc123';

    Appointment.findByIdAndDelete.mockResolvedValue();

    const res = await request(app).delete(`/api/appointments/${mockAppointmentId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Appointment deleted');
  });

  it('should get last week appointment count', async () => {
    const mockAppointmentCount = [
      { _id: { date: '2023-05-15', interval: '06:00-12:00' }, count: 3 },
      { _id: { date: '2023-05-16', interval: '12:00-18:00' }, count: 5 }
    ];

    Appointment.aggregate.mockResolvedValue(mockAppointmentCount);


    const res = await request(app).get('/api/appointments/count');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockAppointmentCount);
  });
});


