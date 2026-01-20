const adminAuth = (req, res, next) => {
  try {
    // ✅ Check if user exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    // ✅ Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can perform this action',
      });
    }

    console.log('✅ Admin verified for user:', req.user.id);
    next();
  } catch (error) {
    console.error('❌ Admin auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying admin status',
    });
  }
};

module.exports = { adminAuth };