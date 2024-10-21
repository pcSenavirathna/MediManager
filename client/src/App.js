import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StaffManagePage from './pages/ManageStaff/StaffManagePage';
import StaffSchedulePage from './pages/ManageStaff/StaffSchedulePage';
import ReportPage from './pages/ManageStaff/ReportPage';
import MakeAppointmentPage from './pages/AppointmentManagement/makeAppointment';
import AppointmentViwe from './pages/AppointmentManagement/AppointmentView';
import DoctorManage from './pages/ManageStaff/DoctorManagePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DigitleHeathCard from './pages/digitalCard/DigitleHeathCard';
import AccessCard from './pages/digitalCard/AccessCard';
import ScanningCard from './pages/digitalCard/ScanningCard';
import PaymentPage from './pages/paymentManagement/paymentPage';
import WardManagePage from './pages/ManageWard/WardManagePage'
import PatientDischarge from './pages/AppointmentManagement/PatientDischarge';
import Analyze from './pages/Analyze/analyze';
import PendingPaymentView from './pages/paymentManagement/ViewPendingPayments';

const App = () => {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/staff" element={<StaffManagePage />} />
            <Route path="/schedules" element={<StaffSchedulePage />} />
            <Route path="/reports" element={<ReportPage />} />
            <Route path="/digitleHeathCard" element={<DigitleHeathCard />} />
            <Route path="/makeappoinment" element={<MakeAppointmentPage />} />
            <Route path="/appointmentview" element={<AppointmentViwe />} />
            <Route path="/doctorMange" element={<DoctorManage />} />
            <Route path="/accessCard" element={<AccessCard />} />
            <Route path="/scanningCard" element={<ScanningCard />} />
            <Route path="/bedshedule" element={<WardManagePage />} />
            <Route path="/discharge/:patientId" element={<PatientDischarge />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path='/paymentPage/:amount/:id' element={<PaymentPage />} />
            <Route path='/payments' element={<PendingPaymentView />} />


          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
