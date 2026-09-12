const API_BASE_URL = 'http://localhost:5000/api';

export const fetchCategoriesApi = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error('Error fetching categories:', err);
    return [];
  }
};

export const fetchProductsApi = async (category = 'All', search = '') => {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'All' && category !== 'ALL') {
      params.append('category', category);
    }
    if (search && search.trim()) {
      params.append('search', search.trim());
    }
    const res = await fetch(`${API_BASE_URL}/products?${params.toString()}`);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
};

export const createProductApi = async (productData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error creating product:', err);
    return { success: false, message: 'Failed to connect to backend server.' };
  }
};

export const updateProductApi = async (id, productData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error updating product:', err);
    return { success: false, message: 'Failed to connect to backend server.' };
  }
};

export const deleteProductApi = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error deleting product:', err);
    return { success: false, message: 'Failed to connect to backend server.' };
  }
};

export const fetchCustomersApi = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/customers`);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error('Error fetching customers:', err);
    return [];
  }
};

export const createSaleApi = async (salePayload) => {
  try {
    const res = await fetch(`${API_BASE_URL}/sales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(salePayload),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error creating sale:', err);
    return { success: false, message: 'Failed to connect to backend server.' };
  }
};

export const fetchDashboardStatsApi = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard/stats`);
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    return null;
  }
};
