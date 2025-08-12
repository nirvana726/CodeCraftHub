const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.registerUser = async ({ username, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('User already exists');

  const user = new User({ username, email, password });
  await user.save();

  return {
    id: user._id,
    username: user.username,
    email: user.email,
  };
};

exports.loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid email or password');

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new Error('Invalid email or password');

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return token;
};

exports.getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw new Error('User not found');

  return user;
};
