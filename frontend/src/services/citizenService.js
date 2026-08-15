import  api  from "./api.js";

export async function getCitizenDashboard() {
  const response  = await api.get('/citizen/dashboard');
  return response.data;
}