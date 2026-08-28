import api from './api';

export async function register(form) {
  const response = await api.post('/auth/register', form);
  return response.data;
}

export async function sendOtp(data) {
  const response = await api.post('/auth/send-otp', data);
  // console.log('Sending OTP with data:', response);
  return response.data;
}
 export async function verifyOtp(data) {
  const response  = await api.post('/auth/verify-otp', data);
  return response.data;
 }

export async function login(credentials) {
  const response = await api.post('/auth/login', credentials);
  
  const data = response.data.data;

  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  localStorage.setItem('roles', JSON.stringify(data.roles));

  return data;
}

export async function logout() {
  const response = await api.post('/auth/logout');
  return response.data;
}

export async function profile() {
  const response = await api.get('/auth/profile');

  return response.data.data;
}

export function getUser() {
  return JSON.parse(localStorage.getItem('user'));
}

export function getRoles() {
  return JSON.parse(localStorage.getItem('roles') || '[]');
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

