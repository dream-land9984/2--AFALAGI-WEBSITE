const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const getAuthToken = () => localStorage.getItem('afalagi_token');
export const setAuthToken = (token) => {
  if (token) localStorage.setItem('afalagi_token', token);
  else localStorage.removeItem('afalagi_token');
};

export const getSavedUser = () => {
  const user = localStorage.getItem('afalagi_user');
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const setSavedUser = (user) => {
  if (user) localStorage.setItem('afalagi_user', JSON.stringify(user));
  else localStorage.removeItem('afalagi_user');
};

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getProfile: () => request('/auth/profile'),

  // Reports
  getReports: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.region) query.append('region', params.region);
    if (params.status) query.append('status', params.status);
    const queryString = query.toString();
    return request(`/reports${queryString ? `?${queryString}` : ''}`);
  },
  getReportById: (id) => request(`/reports/${id}`),
  createReport: (body) => request('/reports', { method: 'POST', body: JSON.stringify(body) }),
  updateReport: (id, body) => request(`/reports/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteReport: (id) => request(`/reports/${id}`, { method: 'DELETE' }),

  // Stats
  getImpactStats: () => request('/reports/stats/impact'),

  // File Upload
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/uploads', {
      method: 'POST',
      body: formData,
    });
  },
};
