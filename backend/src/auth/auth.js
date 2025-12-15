import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const getUserFromToken = (token) => {
  if (!token) return null;

  const cleanToken = token.replace('Bearer ', '');
  return verifyToken(cleanToken);
};

export const isAdmin = (user) => {
  return user && user.role === 'ADMIN';
};

export const isEmployee = (user) => {
  return user && user.role === 'EMPLOYEE';
};

export const requireAuth = (user) => {
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
};

export const requireAdmin = (user) => {
  requireAuth(user);
  if (!isAdmin(user)) {
    throw new Error('Admin access required');
  }
  return user;
};
