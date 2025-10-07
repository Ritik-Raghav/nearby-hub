import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json', // default; will override for FormData
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('providerToken'); // ensure providerToken used here
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('providerToken');
      localStorage.removeItem('provider');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  signup: async (userData: { firstName: string; lastName: string; email: string; password: string }) => {
    const response = await api.post(`${apiUrl}/public/user-signup`, {
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      password: userData.password,
      username: userData.email.split('@')[0],
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post(`${apiUrl}/public/user-login`, { email, password });
    return response.data;
  },

  getUserProfile: async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
};

export const providerAPI = {
  // Update provider profile with FormData for image upload
  updateProfile: async (profile: {
    name: string;
    mobile: string;
    category: string;
    description: string;
    price: number;
    profileImage?: File;
  }) => {
    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("mobile", profile.mobile);
    formData.append("category", profile.category);
    formData.append("description", profile.description);
    formData.append("price", profile.price.toString());
    if (profile.profileImage) {
      formData.append("profileImage", profile.profileImage);
    }

    try {
      const token = localStorage.getItem("providerToken");
      if (!token) throw new Error("No provider token found");

      const response = await api.put(`${apiUrl}/provider/update-provider-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // important for file upload
        },
      });

      return response.data;
    } catch (error: any) {
      console.error("Error updating provider profile:", error.response || error);
      throw error;
    }
  },
};

export default api;
