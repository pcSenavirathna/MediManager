const User = require('../models/User');
const Staff = require('../models/Staff');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.register = async (email, password, userType) => {

  if (!email || !password) {
    throw new Error({ message: "Email and Password can't be empty" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error({ message: "User already exists" });
    }

    const user = new User({ email, password, userType });
    await user.save();
    const token = generateToken(user._id);

    return "Success";
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error({ message: `Error registering user: ${error.message}` });
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields.' });
  }

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        token: generateToken(user._id),
        user: {
          _id: user._id,
          email: user.email,
          userType: user.userType,
        },
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};