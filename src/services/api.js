const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en la solicitud');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // Tours methods
  async getTours() {
    return await this.request('/tours');
  }

  async createTour(tourData) {
    return await this.request('/tours', {
      method: 'POST',
      body: JSON.stringify(tourData)
    });
  }

  // Cart methods
  async addToCart(tourId) {
    return await this.request('/tours/cart', {
      method: 'POST',
      body: JSON.stringify({ tourId })
    });
  }

  async getCart() {
    return await this.request('/tours/cart');
  }

  async removeFromCart(tourId) {
    return await this.request(`/tours/cart/${tourId}`, {
      method: 'DELETE'
    });
  }

  async processPurchase(paymentData) {
    return await this.request('/tours/purchase', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  }

  // User methods
  async updateProfile(profileData) {
    return await this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async uploadImage(imageData) {
    return await this.request('/upload/image', {
      method: 'POST',
      body: JSON.stringify({ image: imageData })
    });
  }

  async becomeGuide() {
    return await this.request('/user/become-guide', {
      method: 'POST'
    });
  }

  async getProfile() {
    return await this.request('/user/profile');
  }
}

export default new ApiService();