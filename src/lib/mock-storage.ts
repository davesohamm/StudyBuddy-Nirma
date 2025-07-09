// Shared mock storage for authentication fallback
export const mockUsers: any[] = [];

export function addMockUser(user: any) {
  mockUsers.push(user);
}

export function findMockUser(email: string) {
  return mockUsers.find(user => user.email === email.toLowerCase());
}

export function getAllMockUsers() {
  return [...mockUsers];
}

export function clearMockUsers() {
  mockUsers.length = 0;
}

// Log when using mock storage
export function logMockOperation(operation: string, email?: string) {
  console.log(`📝 Mock Storage ${operation}:`, email || 'N/A');
} 