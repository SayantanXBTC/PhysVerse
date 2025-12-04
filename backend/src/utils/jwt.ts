import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = '30d';

export const generateToken = (userId: string, expiresIn: string = JWT_EXPIRES_IN): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): { userId: string } => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
