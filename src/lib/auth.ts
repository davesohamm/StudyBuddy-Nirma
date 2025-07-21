import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { config } from './config';
import { NextRequest } from 'next/server';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  name: string;
  sessionId?: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: string;
  sessionId: string;
  type: 'refresh';
  iat?: number;
  exp?: number;
}

export interface AuthResult {
  success: boolean;
  user?: JWTPayload;
  token?: string;
  message?: string;
  errorCode?: string;
}

export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
  score: number;
}

/**
 * Hash password with enhanced security
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = config.security.bcrypt.saltRounds;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Enhanced password validation
 */
export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];
  let score = 0;
  const validation = config.validation.password;

  // Length check
  if (password.length < validation.minLength) {
    errors.push(`Password must be at least ${validation.minLength} characters long`);
  } else {
    score += 20;
  }

  // Uppercase check
  if (validation.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else if (/[A-Z]/.test(password)) {
    score += 20;
  }

  // Lowercase check
  if (validation.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else if (/[a-z]/.test(password)) {
    score += 20;
  }

  // Number check
  if (validation.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else if (/\d/.test(password)) {
    score += 20;
  }

  // Special character check
  if (validation.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 20;
  }

  // Additional strength checks
  if (password.length >= 12) score += 10;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 10;

  const strength: 'weak' | 'medium' | 'strong' = 
    score >= 80 ? 'strong' : score >= 60 ? 'medium' : 'weak';

  return {
    isValid: errors.length === 0,
    errors,
    strength,
    score: Math.min(100, score)
  };
}

/**
 * Validate email format and domain
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;

  // Check allowed domains if configured
  const allowedDomains = config.validation.email.domains;
  if (allowedDomains && allowedDomains.length > 0) {
    const domain = email.split('@')[1]?.toLowerCase();
    return allowedDomains.some(allowedDomain => 
      domain === allowedDomain.toLowerCase()
    );
  }

  return true;
}

/**
 * Generate JWT access token
 */
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  const sessionId = crypto.randomUUID();
  const secret = process.env.JWT_SECRET || 'nirma_studybuddy_jwt_secret_2024_v2_ultra_secure_key';
  return jwt.sign(
    { ...payload, sessionId },
    secret,
    { expiresIn: '30d' }
  );
}

/**
 * Generate refresh token
 */
export function generateRefreshToken(userId: string, sessionId: string): string {
  const secret = process.env.JWT_SECRET || 'nirma_studybuddy_jwt_secret_2024_v2_ultra_secure_key';
  return jwt.sign(
    { userId, sessionId, type: 'refresh' },
    secret,
    { expiresIn: '90d' }
  );
}

/**
 * Verify JWT token with enhanced security
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    
    // Additional validation
    if (!decoded.userId || !decoded.email || !decoded.role) {
      console.warn('Invalid token payload structure');
      return null;
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.warn('Token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.warn('Invalid token');
    } else {
      console.error('Token verification failed:', error);
    }
    return null;
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as RefreshTokenPayload;
    
    if (decoded.type !== 'refresh' || !decoded.userId || !decoded.sessionId) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
}

/**
 * Generate secure random token for email verification, password reset, etc.
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
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
 * Enhanced authentication middleware with better error handling
 */
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
      message: 'No authorization token provided',
      errorCode: 'NO_TOKEN'
    };
  }
  
  const user = verifyToken(token);
  
  if (!user) {
    return {
      success: false,
      message: 'Invalid or expired token',
      errorCode: 'INVALID_TOKEN'
    };
  }
  
  return {
    success: true,
    user,
    token
  };
}

/**
 * Role-based authorization check
 */
export function authorizeRole(user: JWTPayload, requiredRoles: string[]): boolean {
  return requiredRoles.includes(user.role);
}

/**
 * Check if user has permission for specific resource
 */
export function checkPermission(user: JWTPayload, resource: string, action: string): boolean {
  // Admin has all permissions
  if (user.role === 'admin') return true;

  // Define permission matrix
  const permissions: Record<string, Record<string, string[]>> = {
    'user': {
      'read': ['student', 'faculty', 'admin'],
      'update': ['student', 'faculty', 'admin'],
      'delete': ['admin']
    },
    'course': {
      'read': ['student', 'faculty', 'admin'],
      'create': ['faculty', 'admin'],
      'update': ['faculty', 'admin'],
      'delete': ['admin']
    },
    'assignment': {
      'read': ['student', 'faculty', 'admin'],
      'create': ['faculty', 'admin'],
      'update': ['faculty', 'admin'],
      'delete': ['faculty', 'admin'],
      'submit': ['student']
    },
    'grade': {
      'read': ['student', 'faculty', 'admin'],
      'create': ['faculty', 'admin'],
      'update': ['faculty', 'admin'],
      'delete': ['admin']
    }
  };

  const resourcePermissions = permissions[resource];
  if (!resourcePermissions) return false;

  const actionPermissions = resourcePermissions[action];
  if (!actionPermissions) return false;

  return actionPermissions.includes(user.role);
}

/**
 * Generate password reset token with expiration
 */
export function generatePasswordResetToken(): { token: string; expires: Date } {
  const token = generateSecureToken();
  const expires = new Date();
  expires.setHours(expires.getHours() + 1); // 1 hour expiration
  
  return { token, expires };
}

/**
 * Generate email verification token
 */
export function generateEmailVerificationToken(): string {
  return generateSecureToken();
}

/**
 * Validate session and check if user should be forced to re-authenticate
 */
export function shouldForceReauth(lastLogin: Date, lastPasswordChange?: Date): boolean {
  const now = new Date();
  const daysSinceLogin = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24);
  
  // Force re-auth after 30 days
  if (daysSinceLogin > 30) return true;
  
  // Force re-auth if password was changed recently and user hasn't logged in since
  if (lastPasswordChange && lastPasswordChange > lastLogin) return true;
  
  return false;
}

/**
 * Create audit log entry for authentication events
 */
export interface AuthAuditLog {
  userId?: string;
  email: string;
  action: 'login' | 'logout' | 'register' | 'password_change' | 'failed_login' | 'account_locked';
  success: boolean;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  details?: any;
}

export function createAuditLog(entry: Omit<AuthAuditLog, 'timestamp'>): AuthAuditLog {
  return {
    ...entry,
    timestamp: new Date()
  };
} 