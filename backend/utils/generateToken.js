const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  try {
    console.log('Generating token for userId:', userId);
    
    const token = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );
    
    console.log('✅ Token generated successfully');
    return token;
  } catch (error) {
    console.error('❌ Error generating token:', error);
    throw error;
  }
};

// ✅ Make sure this is exported correctly
module.exports = generateToken;