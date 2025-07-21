import * as fs from 'fs';
import * as path from 'path';

// Shared mock storage for authentication fallback
const MOCK_DATA_FILE = path.join(process.cwd(), 'mock-users.json');

// Load users from file on startup
let mockUsers: any[] = [];

function loadMockUsers() {
  try {
    if (fs.existsSync(MOCK_DATA_FILE)) {
      const data = fs.readFileSync(MOCK_DATA_FILE, 'utf8');
      mockUsers = JSON.parse(data);
      console.log(`📁 Loaded ${mockUsers.length} users from mock storage`);
    } else {
      console.log('📁 No mock storage file found, starting fresh');
    }
  } catch (error) {
    console.error('❌ Error loading mock users:', error);
    mockUsers = [];
  }
}

function saveMockUsers() {
  try {
    fs.writeFileSync(MOCK_DATA_FILE, JSON.stringify(mockUsers, null, 2));
    console.log(`💾 Saved ${mockUsers.length} users to mock storage`);
  } catch (error) {
    console.error('❌ Error saving mock users:', error);
  }
}

// Load users on module initialization
loadMockUsers();

export function addMockUser(user: any) {
  mockUsers.push(user);
  saveMockUsers();
}

export function findMockUser(email: string) {
  return mockUsers.find(user => user.email === email.toLowerCase());
}

export function findMockUserById(userId: string) {
  return mockUsers.find(user => user._id === userId);
}

export function getAllMockUsers() {
  return [...mockUsers];
}

export function updateMockUser(userId: string, updates: any) {
  const userIndex = mockUsers.findIndex(user => user._id === userId);
  if (userIndex !== -1) {
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
    saveMockUsers();
    return mockUsers[userIndex];
  }
  return null;
}

export function clearMockUsers() {
  mockUsers.length = 0;
  saveMockUsers();
}

// Log when using mock storage
export function logMockOperation(operation: string, email?: string) {
  console.log(`📝 Mock Storage ${operation}:`, email || 'N/A');
}

// Initialize storage on first import
export function initializeMockStorage() {
  loadMockUsers();
} 