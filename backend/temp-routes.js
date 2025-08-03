const express = require('express');
const router = express.Router();

// Mock data
const mockProducts = [
  { id: 1, title: 'Sample Product 1', description: 'Description 1', price: 99.99 },
  { id: 2, title: 'Sample Product 2', description: 'Description 2', price: 149.99 },
  { id: 3, title: 'Sample Product 3', description: 'Description 3', price: 199.99 }
];

const mockReviews = [
  { id: 1, rating: 5, content: 'Great product! Exceeded my expectations. Fast shipping and excellent customer service.', createdAt: '2024-01-15T10:30:00Z' },
  { id: 2, rating: 4, content: 'Good quality, fast delivery. Minor packaging issues but the product itself is solid.', createdAt: '2024-01-20T14:22:00Z' },
  { id: 3, rating: 3, content: 'Average product, could be better. Works as described but nothing special.', createdAt: '2024-01-25T09:15:00Z' },
  { id: 4, rating: 2, content: 'Poor quality materials. Product broke after just 2 weeks of normal use. Very disappointed.', createdAt: '2024-01-28T16:45:00Z' },
  { id: 5, rating: 1, content: 'Terrible experience! Product arrived damaged, customer service was unhelpful, and refund process took forever. Would not recommend.', createdAt: '2024-02-01T11:20:00Z' },
  { id: 6, rating: 2, content: 'Overpriced for what you get. Similar products available elsewhere for half the price with better quality.', createdAt: '2024-02-03T13:10:00Z' },
  { id: 7, rating: 1, content: 'Complete waste of money. Product doesn\'t work as advertised. Tried contacting support multiple times with no response.', createdAt: '2024-02-05T08:30:00Z' },
  { id: 8, rating: 4, content: 'Pretty good overall. Installation was easy and it works well. Only complaint is the instruction manual could be clearer.', createdAt: '2024-02-08T12:45:00Z' },
  { id: 9, rating: 2, content: 'Expected much better based on the reviews. Product feels cheap and flimsy. Return process was complicated.', createdAt: '2024-02-10T15:20:00Z' },
  { id: 10, rating: 5, content: 'Outstanding product! Worth every penny. Great build quality and fantastic customer support team.', createdAt: '2024-02-12T10:15:00Z' },
  { id: 11, rating: 1, content: 'Worst purchase I\'ve made this year. Product stopped working after 3 days. Company refuses to honor warranty.', createdAt: '2024-02-14T17:30:00Z' },
  { id: 12, rating: 3, content: 'It\'s okay, does what it\'s supposed to do but nothing extraordinary. Delivery was prompt.', createdAt: '2024-02-16T14:00:00Z' },
  
  // Adding many more bad reviews
  { id: 13, rating: 1, content: 'SCAM! Product never arrived. Tracking shows delivered but nothing at my door. Customer service says it\'s not their problem.', createdAt: '2024-02-18T09:25:00Z' },
  { id: 14, rating: 2, content: 'Cheap plastic construction. My 5-year-old could build something sturdier with LEGOs. Save your money.', createdAt: '2024-02-20T13:45:00Z' },
  { id: 15, rating: 1, content: 'False advertising everywhere! Product looks nothing like the photos. Functionality is 50% of what was promised.', createdAt: '2024-02-22T11:10:00Z' },
  { id: 16, rating: 2, content: 'Broke on first use. Literally the first time I used it, it snapped in half. Manufacturing defect for sure.', createdAt: '2024-02-24T16:20:00Z' },
  { id: 17, rating: 1, content: 'Customer service is absolutely horrible. Rude representatives, no solution offered, just kept passing me around departments.', createdAt: '2024-02-26T08:50:00Z' },
  { id: 18, rating: 1, content: 'Delivery took 3 weeks longer than promised. Product arrived dirty and scratched. No apology, no compensation.', createdAt: '2024-02-28T14:35:00Z' },
  { id: 19, rating: 2, content: 'Instructions are in broken English and make no sense. Product missing essential parts. Had to buy additional components separately.', createdAt: '2024-03-02T10:15:00Z' },
  { id: 20, rating: 1, content: 'DANGEROUS PRODUCT! Overheated and started smoking within minutes. Could have burned my house down. Reported to safety authorities.', createdAt: '2024-03-04T12:40:00Z' },
  { id: 21, rating: 2, content: 'Defective right out of the box. Won\'t hold a charge, makes weird noises. Quality control is non-existent.', createdAt: '2024-03-06T15:25:00Z' },
  { id: 22, rating: 1, content: 'Tried to return it 3 times. Each time they claim they never received it. Clearly a scam to keep your money.', createdAt: '2024-03-08T09:45:00Z' },
  { id: 23, rating: 1, content: 'Product description was completely misleading. What I received was a cheap knockoff version. Feels like I was scammed.', createdAt: '2024-03-10T13:20:00Z' },
  { id: 24, rating: 2, content: 'Terrible build quality. Screws stripped immediately, plastic cracked during assembly. Cheapest materials possible.', createdAt: '2024-03-12T11:55:00Z' },
  { id: 25, rating: 1, content: 'Ordered 2 months ago, still haven\'t received it. Website says "processing" but customer service won\'t give me a straight answer.', createdAt: '2024-03-14T16:10:00Z' },
  { id: 26, rating: 1, content: 'Product smells like toxic chemicals. Gave me a headache after 5 minutes. Clearly not safe for indoor use despite claims.', createdAt: '2024-03-16T10:30:00Z' },
  { id: 27, rating: 2, content: 'Completely incompatible with anything else despite claiming universal compatibility. Wasted hours trying to make it work.', createdAt: '2024-03-18T14:45:00Z' },
  { id: 28, rating: 1, content: 'WORST COMPANY EVER! They charged my card twice, sent wrong product, and now claim I need to pay return shipping for THEIR mistake!', createdAt: '2024-03-20T12:15:00Z' },
  { id: 29, rating: 1, content: 'Product lasted exactly 1 week before completely failing. No warranty support. They want me to buy a new one at "discount" price.', createdAt: '2024-03-22T08:25:00Z' },
  { id: 30, rating: 2, content: 'Extremely loud operation. Sounds like a jet engine. Can\'t use it without disturbing the entire neighborhood.', createdAt: '2024-03-24T15:40:00Z' }
];

const mockAccounts = [
  { id: 1, email: 'admin@ams.com', role: 'admin' },
  { id: 2, email: 'user@test.com', role: 'customer' }
];

// Products routes
router.get('/products', (req, res) => {
  res.json(mockProducts);
});

router.get('/products/:id', (req, res) => {
  const product = mockProducts.find(p => p.id == req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// Reviews routes
router.get('/reviews', (req, res) => {
  res.json(mockReviews);
});

router.get('/reviews/summary', (req, res) => {
  const totalReviews = mockReviews.length;
  const averageRating = mockReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
  
  // Generate more realistic AI analysis based on the mixed reviews
  const positiveReviews = mockReviews.filter(r => r.rating >= 4).length;
  const negativeReviews = mockReviews.filter(r => r.rating <= 2).length;
  const neutralReviews = mockReviews.filter(r => r.rating === 3).length;
  
  const positivePercentage = Math.round((positiveReviews / totalReviews) * 100);
  const negativePercentage = Math.round((negativeReviews / totalReviews) * 100);
  
  let aiAnalysis = '';
  
  if (averageRating >= 4.0) {
    aiAnalysis = `✅ GOOD: Customer reviews are overwhelmingly positive (${positivePercentage}% positive). Customers consistently praise product quality, fast shipping, and excellent customer service. This product is performing well in the market with strong customer satisfaction.`;
  } else if (averageRating >= 3.0) {
    aiAnalysis = `⚖️ MIXED: Customer sentiment is divided (${positivePercentage}% positive, ${negativePercentage}% negative). While some customers are satisfied, there are notable concerns that need attention. Product performance and customer experience could be improved.`;
  } else {
    aiAnalysis = `❌ BAD: Customer reviews are predominantly negative (${negativePercentage}% negative, only ${positivePercentage}% positive). Major issues identified:\n\n🔴 SAFETY CONCERNS: Overheating, toxic odors, fire hazards\n🔴 PRODUCT DEFECTS: Breaking within days/weeks, cheap materials, false advertising\n🔴 CUSTOMER SERVICE CRISIS: Rude staff, no warranty support, unresponsive support\n🔴 DELIVERY FAILURES: Undelivered packages, billing errors, damaged products\n🔴 SCAM ALLEGATIONS: Misleading descriptions, wrong products\n\n⚡ IMMEDIATE ACTION REQUIRED: This product needs major improvements or market withdrawal.`;
  }
  
  res.json({
    aiAnalysis: aiAnalysis,
    statistics: {
      averageRating: averageRating.toFixed(1),
      totalReviews: totalReviews
    }
  });
});

// Accounts routes
router.get('/accounts', (req, res) => {
  let accounts = mockAccounts;
  if (req.query.role) {
    accounts = mockAccounts.filter(acc => acc.role === req.query.role);
  }
  res.json(accounts);
});

// Data routes (for login/register)
router.post('/data/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockAccounts.find(acc => acc.email === email);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // For demo purposes, accept any password
  res.json({ 
    message: 'Login successful', 
    role: user.role, 
    email: user.email 
  });
});

router.post('/data/register', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  
  const existing = mockAccounts.find(acc => acc.email === email);
  if (existing) {
    return res.status(409).json({ message: 'Email already exists' });
  }
  
  const role = email.endsWith('@ams.com') ? 'admin' : 'customer';
  const newAccount = { 
    id: mockAccounts.length + 1, 
    email, 
    role 
  };
  mockAccounts.push(newAccount);
  
  res.json({ message: 'Account created successfully' });
});

// Additional routes can be added here as needed

module.exports = router;
