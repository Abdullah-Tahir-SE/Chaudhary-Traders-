const API_BASE_URL = 'http://localhost:5000/api';

export const adminLoginApi = async (credentials) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error logging in as admin:', err);
    return { success: false, message: 'Failed to connect to authentication server.' };
  }
};

export const customerRegisterApi = async (userData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/customer-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error registering customer account:', err);
    return { success: false, message: 'Failed to connect to authentication server.' };
  }
};

export const customerLoginApi = async (credentials) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/customer-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error logging in customer:', err);
    return { success: false, message: 'Failed to connect to authentication server.' };
  }
};

export const getMeApi = async (token) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error fetching profile:', err);
    return { success: false, message: 'Session expired or invalid.' };
  }
};

export const updateCustomerProfileApi = async (token, profileData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/customer/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error updating customer profile:', err);
    return { success: false, message: 'Failed to connect to server.' };
  }
};

export const fetchAdminCustomersApi = async (token, search = '') => {
  try {
    const params = new URLSearchParams();
    if (search && search.trim()) params.append('search', search.trim());
    const res = await fetch(`${API_BASE_URL}/admin/customers-list?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error('Error fetching admin customers:', err);
    return [];
  }
};

export const deleteAdminCustomerApi = async (token, id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/customers-list/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error deleting admin customer:', err);
    return { success: false, message: 'Failed to connect to server.' };
  }
};

// Legacy alias helpers for backward compatibility
export const loginApi = adminLoginApi;
export const registerApi = customerRegisterApi;
export const fetchUsersApi = fetchAdminCustomersApi;
export const deleteUserApi = deleteAdminCustomerApi;
