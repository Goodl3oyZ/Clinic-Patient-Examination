/**
 * Test data for E2E tests
 * Update credentials based on your test environment
 */

export const testDoctor = {
  email: 'doctor.test@example.com',
  password: 'TestDoctor123!',
  name: 'Dr. Test Doctor',
};

export const testPatient = {
  email: 'patient.test@example.com',
  password: 'TestPatient123!',
  name: 'Test Patient',
};

// Invalid credentials for negative testing
export const invalidCredentials = {
  email: 'invalid@example.com',
  password: 'wrongpassword',
  malformedEmail: 'not-an-email',
};

// Medical data for testing doctor workflows
export const medicalData = {
  chiefComplaint: 'ปวดหัวและมีไข้',
  diagnosis: 'ไข้หวัด',
  treatmentPlan: 'พักผ่อนและดื่มน้ำมาก',
  prescription: {
    medication: 'พาราเซตามอล',
    dosage: '500mg',
    frequency: 'วันละ 3 ครั้ง',
    duration: '7 วัน',
  },
};
