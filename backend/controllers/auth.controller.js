const User = require('../models/user.model');
const { hashPassword } = require('../utils/auth');

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, email, password } = req.body;

    // Check if user already exists
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const existingPhone = await User.findByPhone(phone);
    if (existingPhone) {
      return res.status(400).json({ message: 'Phone number already in use' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      phone,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
};
