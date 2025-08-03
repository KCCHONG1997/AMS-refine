import React, { useState, useRef } from 'react';

const EasyComputerVision = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const analyzeImage = async (file) => {
    setLoading(true);
    
    // For demo purposes - in production, use your own backend
    const API_KEY = 'YOUR_API_KEY'; // Get from OpenAI, Google Cloud, etc.
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Example using a proxy to avoid CORS (in real app, call your backend)
      const response = await fetch('https://your-backend.com/analyze-image', {
        method: 'POST',
        body: formData,
        // headers: { 'Authorization': `Bearer ${API_KEY}` }
      });
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Easy Computer Vision with GenAI</h2>
      
      <input 
        type="file" 
        ref={fileInputRef}
        accept="image/*"
        onChange={(e) => analyzeImage(e.target.files[0])}
        disabled={loading}
      />
      
      {loading && <p>Analyzing image...</p>}
      
      {results && (
        <div style={{ marginTop: '20px' }}>
          <h3>Results:</h3>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default EasyComputerVision;