// Temporary mock authentication for testing without npm packages
export interface JWTPayload {
  userId: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  name: string;
}

export interface AuthResult {
  success: boolean;
  user?: JWTPayload;
  token?: string;
  message?: string;
}

/**
 * Mock token generation (DO NOT USE IN PRODUCTION)
 */
export function generateToken(payload: JWTPayload): string {
  // Simple base64 encoding for testing (NOT SECURE)
  return btoa(JSON.stringify(payload));
}

/**
 * Mock token verification (DO NOT USE IN PRODUCTION)
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    // Simple base64 decoding for testing (NOT SECURE)
    const decoded = JSON.parse(atob(token)) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Mock password hashing (DO NOT USE IN PRODUCTION)
 */
export async function hashPassword(password: string): Promise<string> {
  // Simple mock hash for testing (NOT SECURE)
  return `mock_hash_${password.length}_${btoa(password).slice(0, 10)}`;
}

/**
 * Mock password comparison (DO NOT USE IN PRODUCTION)
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  // Simple mock comparison for testing (NOT SECURE)
  const mockHash = await hashPassword(password);
  return mockHash === hash;
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
 * Mock authentication middleware
 */
export function authenticateRequest(authHeader: string | null): AuthResult {
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