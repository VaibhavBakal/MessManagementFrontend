import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = (userData) => API.post('/users/register', userData);
export const loginUser = (username, password) => API.post(`/users/login?username=${username}&password=${password}`);
export const sendTiffinRequest = (userId, newAddress, requestData) => {
  const url = newAddress ? `/tiffin/request?userId=${userId}&newAddress=${encodeURIComponent(newAddress)}` : `/tiffin/request?userId=${userId}`;
  return API.post(url, requestData);
};
export const getNotes = () => API.get('/notes');
export const getAllRequests = () => API.get('/admin/requests');
export const updateUser = (id, userData) => API.put(`/admin/users/${id}`, userData);
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);
export const addDailyMenu = (menuData) => API.post('/admin/menu', menuData);
export const getDailyMenu = () => API.get('/menu');
export const postNote = (noteData) => API.post('/admin/notes', noteData);

export default API;