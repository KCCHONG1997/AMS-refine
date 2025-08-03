import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const TestAPI = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('🧪 Testing API connection...');
        console.log('🧪 API Base URL:', process.env.REACT_APP_API_BASE_URL);
        
        // Test admin reviews endpoint
        const response = await apiService.get('/api/admin/reviews');
        console.log('🧪 Response:', response);
        console.log('🧪 Response status:', response.status);
        console.log('🧪 Response ok:', response.ok);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('🧪 Data received:', result);
        setData(result);
      } catch (err) {
        console.error('🧪 API Test Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  if (loading) return <div>Testing API...</div>;
  if (error) return <div style={{ color: 'red' }}>API Error: {error}</div>;
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>API Test Results</h3>
      <p><strong>API Base URL:</strong> {process.env.REACT_APP_API_BASE_URL}</p>
      <p><strong>Reviews Count:</strong> {data ? data.length : 'N/A'}</p>
      <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default TestAPI;
