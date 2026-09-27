import  api  from "./api.js";

export async function getCitizenDashboard() {
  const response  = await api.get('/citizen/dashboard');
  return response.data;
}

export async function getCitizenApplications(params = {}) {
  const response = await api.get('/citizen/application',{params});
  return response.data;
}

export async function getCitizenServices() {
  const response = await api.get('/citizen/services');
  return response.data;
}

export async function submitCitizenApplication(data) {
  const response = await api.post('/citizen/application/apply', data);
  // console.log(response)
  return response.data;
}

export async function createPaymentOrder(params) {
  const response = await api.post('/citizen/payment/order', {application_id:params});
  return response.data;
}


export async function verifyPayment(data) {
  const response = await api.post('/citizen/payment/verify', data);
  return response.data;
}