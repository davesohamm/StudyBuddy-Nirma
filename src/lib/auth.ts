import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from './config';
import { NextRequest } from 'next/server';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  name: string;
  iat?: number;
  exp?: number;
}

export interface AuthResult {
  success: boolean;
  user?: JWTPayload;
  token?: string;
  message?: string;
}

/**
 * Generate JWT token
 */
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(
    payload,
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, config.bcrypt.saltRounds);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
}

/**
 * Authenticate request using JWT token
 */
export function authenticateRequest(request: NextRequest): AuthResult;
export function authenticateRequest(authHeader: string | null): AuthResult;
export function authenticateRequest(requestOrHeader: NextRequest | string | null): AuthResult {
  let authHeader: string | null;
  
  if (typeof requestOrHeader === 'string' || requestOrHeader === null) {
    authHeader = requestOrHeader;
  } else {
    authHeader = requestOrHeader.headers.get('authorization');
  }
  
  const token = extractTokenFromHeader(authHeader);
  
  if (!token) {
    return {
      success: false,
      message: 'No token provided'
    };
  }
  
  const user = verifyToken(token);
  
  if (!user) {
    return {
      success: false,
      message: 'Invalid or expired token'
    };
  }
  
  return {
    success: true,
    user,
    token
  };
}

/**
 * Check if user has required role
 */
export function hasRole(user: JWTPayload, requiredRoles: string[]): boolean {
  return requiredRoles.includes(user.role);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
} 