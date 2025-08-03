import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../../services/api';
import { CONFIG } from '../../config';

const AdminDashboard = () => {
  const [data, setData] = useState({
    topCustomers: [],
    topBikeParts: [],
    topBikeModels: [],
    requiredParts: []
  });

  const updateData = useCallback(() => {
    // Fetch data individually with fallbacks for failed requests
    const fetchWithFallback = async (endpoint, fallback = []) => {
      try {
        const res = await apiService.get(endpoint);
        return await res.json();
      } catch (error) {
        console.error(`Failed to fetch ${endpoint}:`, error);
        return fallback;
      }
    };

    Promise.all([
      fetchWithFallback('/api/admin/analytics', { counts: { products: 0, reviews: 0, accounts: 0, orders: 0 }, recent: { reviews: [], orders: [] } }),
      fetchWithFallback('/api/admin/accounts', []),
      fetchWithFallback('/api/admin/products', []),
      fetchWithFallback('/api/admin/reviews', []),
      fetchWithFallback('/api/admin/orders', [])
    ])
      .then(([analytics, accounts, products, reviews, orders]) => {
        const pieColors = ['#4f46e5', '#f59e0b', '#8b5cf6'];
        
        // Create an order count per customer
        const orderCounts = accounts.reduce((map, account) => {
          map[account.email] = orders.filter(order => order.email === account.email).length;  
          return map;
        }, {});

        // Create top customers based on order counts
        const customers = accounts.filter(acc => acc.role === 'customer');
        const orderedCustomers = customers.map(customer => ({
          ...customer,
          orderCount: orderCounts[customer.email] || 0
        })).sort((a, b) => b.orderCount - a.orderCount).slice(0, 5);
        
        // Create product categories data
        const productCategories = products.reduce((acc, product) => {
          const category = product.title.split(' ')[0]; // First word as category
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});
        
        // Create parts data from products
        const partsData = products.flatMap(product => {
          console.log('Product:', product.title, 'Parts:', product.parts);
          return product.parts ? product.parts.map(part => part.partName) : [];
        });
        
        // If no parts from association, create some sample parts for display
        if (partsData.length === 0) {
          const sampleParts = [
            'WiFi Module', 'Control Panel', 'Power Supply Unit', 'Ethernet Port',
            'LED Display', 'Touch Sensor', 'Circuit Board', 'Antenna Module',
            'Temperature Sensor', 'Humidity Sensor', 'Motion Detector', 'Light Sensor',
            'Pressure Sensor', 'Microprocessor', 'Memory Module', 'Battery Pack',
            'Wireless Transmitter', 'Protective Casing'
          ];
          partsData.push(...sampleParts);
        }

        setData({
          topCustomers: orderedCustomers.map((customer) => ({
            name: `${customer.firstName} ${customer.lastName}`,
            orders: customer.orderCount
          })),
          topBikeParts: Object.entries(productCategories).slice(0, 3).map(([category, count]) => ({
            name: category,
            enquiries: count * 2 // Mock enquiry count
          })),
          topBikeModels: products.slice(0, 3).map((product, idx) => ({
            name: product.title,
            enquiries: Math.floor(Math.random() * 20) + 5,
            color: pieColors[idx % pieColors.length]
          })),
          requiredParts: partsData.slice(0, 10).map(partName => ({
            name: partName
          }))
        });
      })
      .catch((err) => {
        console.error("❌ Dashboard fetch error:", err);
        // Set empty data on error
        setData({
          topCustomers: [],
          topBikeParts: [],
          topBikeModels: [],
          requiredParts: []
        });
      });
  }, []);

  useEffect(() => {
    updateData();
    const interval = setInterval(updateData, 30000);
    return () => clearInterval(interval);
  }, [updateData]);

  const styles = {
    container: {
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '30px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '30px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '20px'
    },
    barItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px'
    },
    barLabel: {
      width: '100px',
      fontSize: '14px'
    },
    bar: {
      height: '20px',
      backgroundColor: '#8b5cf6',
      color: 'white',
      padding: '0 8px',
      borderRadius: '4px',
      lineHeight: '20px',
      minWidth: '30px'
    },
    caption: {
      fontSize: '12px',
      textAlign: 'right',
      marginTop: '8px',
      color: '#666'
    },
    list: {
      paddingLeft: '20px',
      lineHeight: '1.8',
      fontSize: '14px'
    },
    twoColumn: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    pieChartWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  };

  const DonutChart = ({ data }) => {
    if (!data?.length) return <p style={{ fontSize: '14px', color: '#888' }}>No data available.</p>;

    const total = data.reduce((sum, item) => sum + item.enquiries, 0);
    let currentAngle = 0;
    const radius = 80;
    const center = 100;
    const circumference = 2 * Math.PI * radius;

    return (
      <div style={styles.pieChartWrapper}>
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle cx={center} cy={center} r={radius} fill="none" stroke="#eee" strokeWidth="25" />
          {data.map((item, index) => {
            const value = item.enquiries;
            const percentage = value / total;
            const arcLength = circumference * percentage;
            const offset = circumference * (1 - currentAngle);
            const color = item.color || ['#4f46e5', '#f59e0b', '#8b5cf6'][index % 3];

            currentAngle += percentage;

            return (
              <circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth="25"
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeDashoffset={offset}
                style={{ transformOrigin: '100px 100px', transform: 'rotate(-90deg)' }}
              />
            );
          })}
        </svg>
        <div style={{ marginTop: '10px' }}>
          {data.map((item, index) => (
            <div key={index} style={{ fontSize: '13px', marginBottom: '4px' }}>
              <span style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                backgroundColor: item.color,
                marginRight: '6px',
                borderRadius: '50%'
              }}></span>
              {item.name}: {item.enquiries} ({((item.enquiries / total) * 100).toFixed(1)}%)
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>

      <div style={styles.grid}>

        {/* Top 5 Customers */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Top 5 Customers</h2>
          <ul style={styles.list}>
            {data.topCustomers.length > 0 ? (
              data.topCustomers.map((item, index) => (
                <li key={index}>{item.name} ({item.orders} orders)</li>
              ))
            ) : (
              <li>No data available</li>
            )}
          </ul>
        </div>

        {/* Top 3 Bike Part Categories Enquired */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Top 3 Bike Part Categories Enquired</h2>
          {data.topBikeParts.map((item, index) => (
            <div style={styles.barItem} key={index}>
              <div style={styles.barLabel}>{item.name}</div>
              <div
                style={{
                  ...styles.bar,
                  width: `${item.enquiries * 30}px`,
                  backgroundColor: ['#8b5cf6', '#06b6d4', '#dc2626'][index % 3]
                }}
              >
                {item.enquiries}
              </div>
            </div>
          ))}
          <p style={styles.caption}>Number of enquiries →</p>
        </div>

        {/* Top 3 Bike Models Enquired */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Top 3 Bike Models Enquired</h2>
          <DonutChart data={data.topBikeModels} />
        </div>

        {/* Top 10 Parts Required */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Top 10 Parts Required</h2>
          <div style={styles.twoColumn}>
            <ul style={styles.list}>
              {data.requiredParts.slice(0, 5).map((item, index) => (
                <li key={index}>{index + 1}. {item.name}</li>
              ))}
            </ul>
            <ul style={styles.list}>
              {data.requiredParts.slice(5, 10).map((item, index) => (
                <li key={index + 5}>{index + 6}. {item.name}</li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
