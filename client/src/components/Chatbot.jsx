import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, X, Wrench, Phone, Mail, MapPin } from 'lucide-react';
import axios from 'axios'; // Add this import

// TEMPORARY VERIFICATION (Add this)
console.log(
  'ENV TEST - Gemini Key:', 
  process.env.REACT_APP_GEMINI_API_KEY 
    ? '✅ Loaded successfully' 
    : '❌ Not found - check .env location'
);

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! Welcome to Auto Machinery Singapore (AMS)! 🏍️\n\nI can help you with:\n• Motorbike parts and products\n• Parts availability and pricing\n• Technical specifications\n• Store locations and contact info\n• Service and installation\n\nWhat can I help you find today?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Fetch database data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_BASE_URL + '/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        // Set fallback products if needed
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // AMS Company Information
  const amsInfo = {
    company: 'Auto Machinery Singapore (AMS)',
    address: '\n41 Rowell Road, Singapore 207992\n50 Ubi Ave 3, Singapore 408866',
    phone: '\n+65 6292 9452\n+65 6749 8051',
    email: 'info@ams.com.sg',
    hours: 'Monday-Friday: 9:00 AM - 6:00 PM\nSaturday: 9:00 AM - 5:00 PM\nSunday & Public Holidays: Closed',
    specialties: ['Motorbike Parts', 'Engine Rebuilds', 'Performance Upgrades', 'Maintenance Services'],
    brands: ['Yamaha', 'Honda', 'Bosch'],
    services: ['Parts Installation', 'Engine Diagnostics', 'Performance Tuning', 'Maintenance', 'Repairs']
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Database search function
  const searchDatabase = async (query) => {
    try {
      const response = await axios.get(`/api/search/unified-search?q=${encodeURIComponent(query)}`);
          
      // Process the results to include parts with products
      const formattedResults = response.data.results.map(item => {
        if (item.type === 'product') {
        return {
          title: item.title,
          description: item.description,

          parts: (item.parts || []).map(part => ({
            partName: part.partName,
            partNumber: part.partNumber,
            price: part.price
          }))
        };
      }
        // For part results
        return {
          title: item.product?.title || 'Associated Product',
          description: item.product?.description || '',
          price: null,
          parts: [{
            partName: item.partName,
            partNumber: item.partNumber,
            price: item.price
          }]
        };
      });

      return formattedResults;
    } catch (error) {
      console.error("Search failed:", error);
      return searchProductsLocally(query);
    }
  };

  // Local search fallback
  const searchProductsLocally = (query) => {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product => {
      // Search in product fields
      const productMatch = 
        product.title.toLowerCase().includes(lowercaseQuery) ||
        (product.description && product.description.toLowerCase().includes(lowercaseQuery));
      
      // Search in associated parts
      const partsMatch = product.parts && product.parts.some(part => 
        part.partName.toLowerCase().includes(lowercaseQuery) ||
        (part.partNumber && part.partNumber.toLowerCase().includes(lowercaseQuery))
      );
      
      return productMatch || partsMatch;
    });
  };

  // Get product categories from database
  const getProductCategories = () => {
    if (products.length === 0) return [];
    
    const categories = new Set();
    products.forEach(product => {
      // Extract categories from product titles or descriptions
      const title = product.title ? product.title.toLowerCase() : '';
      const description = product.description ? product.description.toLowerCase() : '';
      
      // Add common motorbike part categories based on actual data
      if (title.includes('brake') || description.includes('brake')) categories.add('Brake Parts');
      if (title.includes('engine') || description.includes('engine')) categories.add('Engine Parts');
      if (title.includes('filter') || description.includes('filter')) categories.add('Filters');
      if (title.includes('oil') || description.includes('oil')) categories.add('Oils & Lubricants');
      if (title.includes('chain') || description.includes('chain')) categories.add('Chain & Sprockets');
      if (title.includes('light') || description.includes('light')) categories.add('Lighting');
      if (title.includes('electrical') || description.includes('electrical')) categories.add('Electrical');
      if (title.includes('suspension') || description.includes('suspension')) categories.add('Suspension');
      if (title.includes('exhaust') || description.includes('exhaust')) categories.add('Exhaust');
      if (title.includes('tire') || title.includes('tyre') || description.includes('tire')) categories.add('Tires');
      
      // Also check parts for categories
      if (product.parts && product.parts.length > 0) {
        product.parts.forEach(part => {
          const partName = part.partName ? part.partName.toLowerCase() : '';
          if (partName.includes('brake')) categories.add('Brake Parts');
          if (partName.includes('filter')) categories.add('Filters');
          if (partName.includes('chain')) categories.add('Chain & Sprockets');
          if (partName.includes('light')) categories.add('Lighting');
          // Add more part-based categorization as needed
        });
      }
    });
    
    return Array.from(categories);
  };

  // Enhanced Gemini API Integration with database context
  const generateGeminiResponse = async (userMessage) => {
    try {
      // First search the database for relevant products
      const dbResults = await searchDatabase(userMessage);
      
      console.log('Using API key:', process.env.REACT_APP_GEMINI_API_KEY?.substring(0, 10) + '...'); 

      const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`;
      
      const prompt = `You're an AI assistant for Auto Machinery Singapore (AMS), a motorbike parts specialist.

Here's relevant data from our database for "${userMessage}":
${dbResults.length > 0 ? 
  `Products found:\n${dbResults.map(p => 
    `- ${p.title}: ${p.description} - $${p.price}${p.parts ? 
      `\n  Parts: ${p.parts.map(part => `${part.partName} (${part.partNumber}) - $${part.price}`).join(', ')}` 
      : ''}`
  ).join('\n')}` 
  : 'No exact matches found in current inventory'
}

Company Info:
- Name: ${amsInfo.company}
- Address: ${amsInfo.address}
- Phone: ${amsInfo.phone}
- Email: ${amsInfo.email}
- Hours: ${amsInfo.hours}
- Specialties: ${amsInfo.specialties.join(', ')}
- Brands: ${amsInfo.brands.join(', ')}
- Services: ${amsInfo.services.join(', ')}

Customer Question: ${userMessage}

Guidelines:
- Be helpful and professional
- Reference specific parts/numbers when available from database
- If no exact match found, suggest alternatives or direct to contact AMS
- Include contact info when appropriate
- Use emojis appropriately (🏍️, 🔧, 📞, etc.)
- Keep responses informative but concise
- Focus on motorbike parts and services
- If they ask for similar products when none found, suggest common alternatives for their bike type`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 400,
            topP: 0.8,
            topK: 40
          }
        })
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error('API Error Details:', errorDetails);
        throw new Error(`API Error ${response.status}: ${errorDetails}`);
      }

      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || "I couldn't generate a response. Please try again or contact AMS directly.";
    } catch (error) {
      console.error('Full Gemini Error:', error);
      return `🚨 Technical Issue: ${error.message}. Please call ${amsInfo.phone} for help.`;
    }
  };

  // Enhanced smart pattern matching with database integration
  const generateSmartResponse = async (userMessage) => {
    if (isLoadingProducts) {
      return "Just a moment while I load our product information...";
    }
    
    const lowercaseMessage = userMessage.toLowerCase();
    
    // Greeting responses
    if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi') || lowercaseMessage.includes('hey')) {
      return `Hello! Welcome to Auto Machinery Singapore! 🏍️\n\nWe're your trusted partner for motorbike parts and services. Whether you need parts for ${amsInfo.brands.slice(0, 3).join(', ')} or any other brand, we've got you covered!\n\nHow can I assist you today?`;
    }

    // Company information
    if (lowercaseMessage.includes('about') || lowercaseMessage.includes('company') || lowercaseMessage.includes('ams')) {
      return `Auto Machinery Singapore (AMS) is Singapore's premier motorbike parts specialist! 🏍️\n\n📍 Location: ${amsInfo.address}\n📞 Phone: ${amsInfo.phone}\n📧 Email: ${amsInfo.email}\n\n🔧 We specialize in:\n${amsInfo.specialties.map(s => `• ${s}`).join('\n')}\n\n🏍️ Brands we support:\n${amsInfo.brands.map(b => `• ${b}`).join('\n')}\n\nVisit us for all your motorbike needs!`;
    }

    // Contact information
    if (lowercaseMessage.includes('contact') || lowercaseMessage.includes('phone') || lowercaseMessage.includes('email') || lowercaseMessage.includes('address') || lowercaseMessage.includes('location') || lowercaseMessage.includes('directions')) {
      return `📞 Contact Auto Machinery Singapore:\n\n📍 Address: ${amsInfo.address}\n📞 Phone: ${amsInfo.phone}\n📧 Email: ${amsInfo.email}\n\n🕒 Opening Hours:\n${amsInfo.hours}\n\nFeel free to reach out anytime! We're here to help with all your motorbike parts needs.`;
    }

    // Hours/timing
    if (lowercaseMessage.includes('hours') || lowercaseMessage.includes('open') || lowercaseMessage.includes('time') || lowercaseMessage.includes('when')) {
      return `🕒 Auto Machinery Singapore Opening Hours:\n\n${amsInfo.hours}\n\nWe're always ready to help during business hours! For urgent inquiries, you can also contact us directly.`;
    }

    // Enhanced general product inquiry handling
    if (lowercaseMessage.includes('what products') || 
        lowercaseMessage.includes('show me products') || 
        lowercaseMessage.includes('show me all') || 
        lowercaseMessage.includes('what do you have') || 
        lowercaseMessage.includes('what parts') ||
        lowercaseMessage.includes('list products') ||
        lowercaseMessage.includes('list of all products') ||
        lowercaseMessage.includes('list all products') ||
        lowercaseMessage.includes('available products')) {
      
      const categories = getProductCategories();
      
      if (categories.length > 0) {
        return `🏍️ AMS Product Categories Available:\n\n${categories.map(cat => `• ${cat}`).join('\n')}\n\n🔍 To see specific products, try asking:\n• "Show me brake parts"\n• "Do you have Yamaha filters?"\n• "What engine parts are available?"\n\nOr tell me:\n• Your bike model (e.g., "Yamaha R15")\n• What part you need (e.g., "brake pads")\n• What you're looking to repair/upgrade\n\n📞 For our complete catalog, call ${amsInfo.phone}`;
      } else {
        return `🏍️ We stock a wide range of motorbike parts including:\n\n• Brake Parts (pads, discs, fluid)\n• Engine Components (filters, oils, gaskets)\n• Chain & Sprockets\n• Lighting & Electrical\n• Suspension Components\n• Exhaust Systems\n• Tires & Wheels\n\n🔍 What specific part are you looking for? Try asking:\n• "Show me brake parts for Yamaha"\n• "Do you have air filters?"\n• "What's available for Honda?"\n\n📞 For our complete catalog: ${amsInfo.phone}`;
      }
    }

  // Database-powered product/part queries
  if (lowercaseMessage.includes('part') || lowercaseMessage.includes('product') || 
      lowercaseMessage.includes('do you have') || lowercaseMessage.includes('do u have') ||
      amsInfo.brands.some(brand => lowercaseMessage.includes(brand.toLowerCase()))) {
    
    const dbResults = await searchDatabase(userMessage);
    
    if (dbResults.length > 0) {
      let response = "Here's what I found in our inventory:\n\n";
      
      dbResults.slice(0, 3).forEach(product => {
        response += `🏍️ ${product.title || 'Product'}`;
        if (product.price) response += ` - $${product.price}`;
        response += '\n';
        
        if (product.description) {
          response += `${product.description}\n`;
        }
        
        if (product.parts && product.parts.length > 0) {
          response += `Parts included:\n${product.parts.map(part => 
            `• ${part.partName || 'Part'}${part.partNumber ? ` (${part.partNumber})` : ''}${part.price ? ` - $${part.price}` : ''}`
          ).join('\n')}\n`;
        }
        
        response += '\n';
      });
      
      if (dbResults.length > 3) {
        response += `...and ${dbResults.length - 3} more items available.\n\n`;
      }
      
      response += `For more details or to place an order, call ${amsInfo.phone} or visit our store!`;
      return response;
    } else {
      return null;
    }
  }


    // Price inquiries (general pricing questions)
    if ((lowercaseMessage.includes('price') || lowercaseMessage.includes('cost') || lowercaseMessage.includes('how much')) &&
        !lowercaseMessage.includes('part') && !lowercaseMessage.includes('product') && 
        !amsInfo.brands.some(brand => lowercaseMessage.includes(brand.toLowerCase()))) {
      return `💰 AMS Pricing Information:\n\nOur prices are competitive and we offer:\n• Quality OEM and aftermarket parts\n• Bulk purchase discounts\n• Installation services\n• Warranty on parts\n\nFor specific pricing, please:\n📞 Call: ${amsInfo.phone}\n🏪 Visit our store\n\nWhat specific part are you looking for? I can help you find it!`;
    }

    // Services
    if (lowercaseMessage.includes('service') || lowercaseMessage.includes('repair') || lowercaseMessage.includes('install')) {
      return `🔧 AMS Services:\n\n${amsInfo.services.map(s => `• ${s}`).join('\n')}\n\nOur certified technicians have years of experience with all major motorcycle brands. We use genuine parts and provide warranty on our work.\n\n📞 Book a service: ${amsInfo.phone}\n📍 Visit us: ${amsInfo.address}\n\nWhat type of service do you need help with?`;
    }

    // Return null if no pattern matches (will trigger AI response)
    return null;
  };

  // Updated response handler with proper prioritization
  const generateResponse = async (userMessage) => {
    console.log('[DEBUG] Generating response for:', userMessage);
    
    const lowercaseMessage = userMessage.toLowerCase();

    // 1. FIRST - Check for general product inquiries
    if (lowercaseMessage.includes('what products') || 
        lowercaseMessage.includes('show me products') || 
        lowercaseMessage.includes('show me all') || 
        lowercaseMessage.includes('what do you have') ||
        lowercaseMessage.includes('list products') ||
        lowercaseMessage.includes('list of all products') ||
        lowercaseMessage.includes('list all products')) {
      
      const patternResponse = await generateSmartResponse(userMessage);
      if (patternResponse) {
        console.log('[DEBUG] Using enhanced general product inquiry response');
        return patternResponse;
      }
    }

    // 2. SECOND - Try database lookup for specific product/part queries
    const shouldSearchDatabase = (
      lowercaseMessage.includes('part') || 
      lowercaseMessage.includes('product') ||
      amsInfo.brands.some(brand => lowercaseMessage.includes(brand.toLowerCase())) ||
      // Search for any non-trivial query that's not a special pattern
      (!lowercaseMessage.includes('contact') &&
      !lowercaseMessage.includes('phone') &&
      !lowercaseMessage.includes('email') &&
      !lowercaseMessage.includes('address') &&
      !lowercaseMessage.includes('hours') &&
      !lowercaseMessage.includes('open') &&
      !lowercaseMessage.includes('service') &&
      !lowercaseMessage.includes('repair') &&
      !lowercaseMessage.includes('about') &&
      !lowercaseMessage.includes('company') &&
      !lowercaseMessage.includes('hello') &&
      !lowercaseMessage.includes('hi') &&
      !lowercaseMessage.includes('hey') &&
      userMessage.trim().length > 2)
    );

    if (shouldSearchDatabase) {
      try {
        const dbResults = await searchDatabase(userMessage);
        
        if (dbResults.length > 0) {
          let response = "🏍️ Here's what I found in our inventory:\n\n";
          
          dbResults.slice(0, 3).forEach(item => {
            // Always show product header
            response += `🔹 ${item.title || 'Product'}`;
            if (item.price) response += ` - $${item.price}`;
            response += '\n';
            
            if (item.description) {
              response += `${item.description}\n`;
            }
            
            // Show parts if they exist
            if (item.parts && item.parts.length > 0) {
              response += `🔧 Parts included:\n${item.parts.map(part => 
                `• ${part.partName || 'Part'}${part.partNumber ? ` (${part.partNumber})` : ''}${part.price ? ` - $${part.price}` : ''}`
              ).join('\n')}\n`;
            } else {
              response += `ℹ️ No parts listed for this product\n`;
            }
            
            response += '\n';
          });
          
          if (dbResults.length > 3) {
            response += `ℹ️ Plus ${dbResults.length - 3} more items available.\n\n`;
          }
          
          response += `📞 For more details: ${amsInfo.phone}`;
          console.log('[DEBUG] Using database-powered response');
          return response;
        }
      } catch (error) {
        console.error('Database search failed:', error);
      }
    }
    // 3. THIRD - Try other pattern matching
    const patternResponse = await generateSmartResponse(userMessage);
    if (patternResponse) {
      console.log('[DEBUG] Using pattern-matched response');
      return patternResponse;
    }

    // 4. FOURTH - Use AI for complex queries with database context
    console.log('[DEBUG] Using Gemini AI response');
    try {
      const dbResults = await searchDatabase(userMessage); // Get fresh results for AI context
      const aiResponse = await generateGeminiResponse(userMessage, dbResults);
      if (aiResponse && !aiResponse.includes('Technical Issue')) {
        return aiResponse;
      }
    } catch (error) {
      console.error('[DEBUG] AI failed:', error);
    }

    // 5. FINAL - Fallback
    console.log('[DEBUG] Using fallback response');
    return `I understand you're asking about "${userMessage}". 🤔\n\nAs an AMS specialist, I can help with:\n🏍️ Parts for ${amsInfo.brands.slice(0, 4).join(', ')}\n🔧 Technical questions\n📦 Pricing and availability\n\nFor immediate help, call ${amsInfo.phone}.`;
  };

  const handleSend = async () => {
    if (userInput.trim() === '') return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: userInput }]);
    setIsTyping(true);

    // Generate response
    try {
      const response = await generateResponse(userInput);
      
      // Add realistic delay
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: response }]);
        setIsTyping(false);
      }, 1000);
      
    } catch (error) {
      console.error('Response generation error:', error);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: 'I apologize, but I\'m having trouble processing your request right now. Please try again or contact us directly at ' + amsInfo.phone 
      }]);
      setIsTyping(false);
    }

    setUserInput('');
  };

  const handleQuickAction = (action) => {
    let message = '';
    switch (action) {
      case 'call':
        message = 'contact information';
        break;
      case 'email':
        message = 'email address';
        break;
      case 'location':
        message = 'location and directions';
        break;
      default:
        return;
    }
    setUserInput(message);
  };

  return (
    <div style={{ position: 'fixed', bottom: '16px', right: '16px', zIndex: 9999 }}>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'background-color 0.2s',
          position: 'relative'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
        {!open && (
          <div style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            width: '12px',
            height: '12px',
            backgroundColor: '#4ade80',
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }}></div>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={{
          position: 'absolute',
          bottom: '70px',
          right: '0',
          width: '384px',
          height: '500px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(to right, #dc2626, #b91c1c)',
            color: 'white',
            padding: '16px',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wrench size={20} />
                <div>
                  <h3 style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>AMS Assistant</h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#fecaca' }}>Auto Machinery Singapore</p>
                </div>
              </div>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#4ade80',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }}></div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '8px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', gap: '4px', fontSize: '12px' }}>
              <button 
                onClick={() => handleQuickAction('call')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'white',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                <Phone size={12} />
                <span>Call</span>
              </button>
              <button 
                onClick={() => handleQuickAction('email')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'white',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                <Mail size={12} />
                <span>Email</span>
              </button>
              <button 
                onClick={() => handleQuickAction('location')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'white',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                <MapPin size={12} />
                <span>Location</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '75%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    whiteSpace: 'pre-line',
                    fontSize: '14px',
                    backgroundColor: msg.sender === 'user' ? '#dc2626' : '#f3f4f6',
                    color: msg.sender === 'user' ? 'white' : '#374151'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  padding: '8px 12px',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#9ca3af',
                        borderRadius: '50%',
                        animation: 'bounce 1s infinite'
                      }}></div>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#9ca3af',
                        borderRadius: '50%',
                        animation: 'bounce 1s infinite 0.1s'
                      }}></div>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#9ca3af',
                        borderRadius: '50%',
                        animation: 'bounce 1s infinite 0.2s'
                      }}></div>
                    </div>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>AMS is typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            borderTop: '1px solid #e5e7eb',
            padding: '12px'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about motorbike parts..."
                style={{
                  flex: 1,
                  border: '1px solid #d1d5db',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button
                onClick={handleSend}
                disabled={userInput.trim() === ''}
                style={{
                  backgroundColor: userInput.trim() === '' ? '#9ca3af' : '#dc2626',
                  color: 'white',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '50%',
                  cursor: userInput.trim() === '' ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s'
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;