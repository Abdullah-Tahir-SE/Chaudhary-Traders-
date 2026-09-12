const API_BASE_URL = 'http://localhost:5000/api';

const DEFAULT_ADMIN = {
  id: 1,
  name: 'Chaudhary Admin',
  username_or_email: 'admin',
  email: 'admin@chaudhary.com',
  role: 'admin',
};

export const adminLoginApi = async (credentials) => {
  const idInput = String(credentials.username_or_email || credentials.username || credentials.email || credentials.emailOrPhone || '').trim().toLowerCase();
  const passInput = String(credentials.password || '').trim();

  // Instant local check for default credentials: username = "admin" & password = "admin"
  if (
    (idInput === 'admin' || idInput === 'admin@chaudhary.com' || idInput === 'admin terminal') &&
    (passInput === 'admin' || passInput === 'admin123')
  ) {
    return {
      success: true,
      message: 'Admin terminal access granted.',
      token: 'admin-token-sungro-2026-auth',
      user: DEFAULT_ADMIN,
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (data && data.success) {
      return data;
    }
  } catch (err) {
    console.warn('Backend server unreachable, using admin fallback:', err);
  }

  // Fallback check if user entered admin / admin when backend is unreachable on Vercel
  if (
    idInput.includes('admin') &&
    (passInput === 'admin' || passInput === 'admin123')
  ) {
    return {
      success: true,
      message: 'Admin terminal access granted.',
      token: 'admin-token-sungro-2026-auth',
      user: DEFAULT_ADMIN,
    };
  }

  return { success: false, message: 'Invalid admin credentials. (Use Username: admin | Password: admin)' };
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
  const idInput = String(credentials.emailOrPhone || credentials.identifier || credentials.phone || credentials.email || credentials.username_or_email || '').trim().toLowerCase();
  const passInput = String(credentials.password || '').trim();

  // If admin credentials typed on general login page
  if (
    (idInput === 'admin' || idInput === 'admin@chaudhary.com') &&
    (passInput === 'admin' || passInput === 'admin123')
  ) {
    return {
      success: true,
      message: 'Admin login successful.',
      token: 'admin-token-sungro-2026-auth',
      user: DEFAULT_ADMIN,
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/customer-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (data && data.success) return data;
  } catch (err) {
    console.warn('Backend server unreachable, using login fallback:', err);
  }

  if (
    idInput.includes('admin') &&
    (passInput === 'admin' || passInput === 'admin123')
  ) {
    return {
      success: true,
      message: 'Admin login successful.',
      token: 'admin-token-sungro-2026-auth',
      user: DEFAULT_ADMIN,
    };
  }

  return { success: false, message: 'Invalid credentials. (Use Username: admin | Password: admin)' };
};

export const getMeApi = async (token) => {
  if (token === 'admin-token-sungro-2026-auth' || (token && token.includes('admin'))) {
    const saved = localStorage.getItem('ct_pos_user');
    const user = saved ? JSON.parse(saved) : DEFAULT_ADMIN;
    return { success: true, user };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (data && data.success) return data;
  } catch (err) {
    console.warn('Backend server offline during getMe session validation:', err);
  }

  const savedUser = localStorage.getItem('ct_pos_user');
  if (savedUser) {
    return { success: true, user: JSON.parse(savedUser) };
  }

  return { success: false, message: 'Session expired or invalid.' };
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
