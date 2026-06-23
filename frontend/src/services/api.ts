import axios from 'axios';

// Resolve API URL (matches dev proxy or env or default)
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const registerUser = async (userData: { name: string; email: string; password?: string }) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials: { email: string; password?: string }) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// Data Upload
export const uploadDataFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload/data', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Analysis & Reports
export const triggerAnalysis = async (analysisData: {
  orgName: string;
  industry: string;
  size: string;
  requirements: string;
  filePath?: string;
}) => {
  const response = await api.post('/analyze', analysisData);
  return response.data;
};

export const getReportDetails = async (reportId: string | number) => {
  const response = await api.get(`/reports/${reportId}`);
  return response.data;
};

export const getUserReportsList = async (userId: string | number) => {
  const response = await api.get(`/reports/user/${userId}`);
  return response.data;
};

export const deleteReportDetails = async (reportId: string | number) => {
  const response = await api.delete(`/reports/${reportId}`);
  return response.data;
};

// PDF Export download trigger
export const exportReportPDF = async (reportId: string | number, orgName: string) => {
  const response = await api.post(`/reports/${reportId}/export`, {}, {
    responseType: 'blob', // Important: receive PDF stream as raw Blob
  });
  
  // Create clickable temporary link to save PDF locally
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Growth_Report_${orgName.replace(/\s+/g, '_')}.pdf`);
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export default api;
