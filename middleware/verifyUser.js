// Module
const User = require('../model/userSchema');

// Middleware
const verifyUser = async (req, res, next) => {
  try {
    const { email } = req.method === 'GET' ? req.query : req.body;
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res
        .status(404)
        .json({ err: `User not found with the email: '${email}'` });
    }
    next();
  } catch (error) {
    return res.status(401).json({ err: 'Authorization failure.' });
  }
};

module.exports = verifyUser;
