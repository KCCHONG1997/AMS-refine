// API utility for consistent API calls
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3002';

// Helper function to build full API URLs
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Common API call wrapper with error handling
export const apiCall = async (endpoint, options = {}) => {
  const url = getApiUrl(endpoint);
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    return response;
  } catch (error) {
    console.error(`API call failed for ${url}:`, error);
    throw error;
  }
};

// Specific API methods for common operations
export const api = {
  // GET request
  get: (endpoint) => apiCall(endpoint, { method: 'GET' }),
  
  // POST request
  post: (endpoint, data) => apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // PUT request
  put: (endpoint, data) => apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // DELETE request
  delete: (endpoint) => apiCall(endpoint, { method: 'DELETE' }),
  
  // POST with FormData (for file uploads)
  postFormData: (endpoint, formData) => apiCall(endpoint, {
    method: 'POST',
    body: formData,
    headers: {}, // Don't set Content-Type for FormData
  }),
};

// Export the base URL for direct use if needed
export { API_BASE_URL };

// Helper for image URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_BASE_URL}${imagePath}`;
};
