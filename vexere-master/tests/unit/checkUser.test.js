import { jest } from '@jest/globals';
import checkUser, { getUserFromDB } from '../../routes/db/checkUser.js';

// Mock dependencies
jest.mock('../../server.js', () => ({
  prisma: {
    $connect: jest.fn(),
    user: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    }
  },
  sessionManager: {
    checkAndRefreshed: jest.fn(),
    addUser: jest.fn()
  }
}));

// Import mocked dependencies
import { prisma, sessionManager } from '../../server.js';

describe('checkUser Function - White Box Testing', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup mock request, response, and next function
    mockReq = {
      oidc: {
        isAuthenticated: jest.fn(),
        user: null
      }
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      redirect: jest.fn()
    };
    
    mockNext = jest.fn();
  });

  describe('Branch Coverage Tests', () => {
    
    test('TC1: User not authenticated - should call next() and return early', async () => {
      // Arrange
      mockReq.oidc.isAuthenticated.mockReturnValue(false);
      
      // Act
      await checkUser(mockReq, mockRes, mockNext);
      
      // Assert
      expect(mockReq.oidc.isAuthenticated).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(prisma.$connect).not.toHaveBeenCalled();
    });

    test('TC2: User authenticated but already logged in session - should call next() and return early', async () => {
      // Arrange
      mockReq.oidc.isAuthenticated.mockReturnValue(true);
      mockReq.oidc.user = { sid: 'test-session-id' };
      sessionManager.checkAndRefreshed.mockReturnValue(true);
      
      // Act
      await checkUser(mockReq, mockRes, mockNext);
      
      // Assert
      expect(mockReq.oidc.isAuthenticated).toHaveBeenCalledTimes(1);
      expect(sessionManager.checkAndRefreshed).toHaveBeenCalledWith('test-session-id');
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(prisma.$connect).not.toHaveBeenCalled();
    });

    test('TC3: User authenticated but no user.sub - should call next() and return early', async () => {
      // Arrange
      mockReq.oidc.isAuthenticated.mockReturnValue(true);
      mockReq.oidc.user = { sid: 'test-session-id' };
      sessionManager.checkAndRefreshed.mockReturnValue(false);
      
      // Act
      await checkUser(mockReq, mockRes, mockNext);
      
      // Assert
      expect(prisma.$connect).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(prisma.user.findFirst).not.toHaveBeenCalled();
    });

    test('TC4: User exists and uuid contains current sub - should add to session and call next()', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        Name: 'Test User',
        email: 'test@example.com',
        uuid: 'auth0|123456789'
      };
      
      mockReq.oidc.isAuthenticated.mockReturnValue(true);
      mockReq.oidc.user = { 
        sid: 'test-session-id',
        sub: 'auth0|123456789',
        email: 'test@example.com'
      };
      sessionManager.checkAndRefreshed.mockReturnValue(false);
      prisma.user.findFirst.mockResolvedValue(mockUser);
      
      // Act
      await checkUser(mockReq, mockRes, mockNext);
      
      // Assert
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: 'test@example.com' },
            { uuid: { contains: 'auth0|123456789' } }
          ]
        }
      });
      expect(sessionManager.addUser).toHaveBeenCalledWith('test-session-id', mockUser);
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    test('TC5: User exists but uuid does not contain current sub - should update uuid and add to session', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        Name: 'Test User',
        email: 'test@example.com',
        uuid: 'auth0|old-uuid'
      };
      
      const updatedUser = {
        ...mockUser,
        uuid: 'auth0|old-uuid, auth0|123456789'
      };
      
      mockReq.oidc.isAuthenticated.mockReturnValue(true);
      mockReq.oidc.user = { 
        sid: 'test-session-id',
        sub: 'auth0|123456789',
        email: 'test@example.com'
      };
      sessionManager.checkAndRefreshed.mockReturnValue(false);
      prisma.user.findFirst.mockResolvedValue(mockUser);
      prisma.user.update.mockResolvedValue(updatedUser);
      
      // Act
      await checkUser(mockReq, mockRes, mockNext);
      
      // Assert
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updatedUser
      });
      expect(sessionManager.addUser).toHaveBeenCalledWith('test-session-id', updatedUser);
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    test('TC6: User does not exist - should create new user and add to session', async () => {
      // Arrange
      const newUser = {
        Name: 'New User',
        email: 'new@example.com',
        uuid: 'auth0|123456789'
      };
      
      const createdUser = {
        id: 2,
        ...newUser,
        phone: null
      };
      
      mockReq.oidc.isAuthenticated.mockReturnValue(true);
      mockReq.oidc.user = { 
        sid: 'test-session-id',
        sub: 'auth0|123456789',
        name: 'New User',
        email: 'new@example.com'
      };
      sessionManager.checkAndRefreshed.mockReturnValue(false);
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(createdUser);
      
      // Act
      await checkUser(mockReq, mockRes, mockNext);
      
      // Assert
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: newUser
      });
      expect(sessionManager.addUser).toHaveBeenCalledWith('test-session-id', createdUser);
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    test('TC7: User does not exist and name is null - should create user with empty name', async () => {
      // Arrange
      const newUser = {
        Name: '',
        email: 'new@example.com',
        uuid: 'auth0|123456789'
      };
      
      const createdUser = {
        id: 2,
        ...newUser,
        phone: null
      };
      
      mockReq.oidc.isAuthenticated.mockReturnValue(true);
      mockReq.oidc.user = { 
        sid: 'test-session-id',
        sub: 'auth0|123456789',
        name: null,
        email: 'new@example.com'
      };
      sessionManager.checkAndRefreshed.mockReturnValue(false);
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(createdUser);
      
      // Act
      await checkUser(mockReq, mockRes, mockNext);
      
      // Assert
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: newUser
      });
      expect(sessionManager.addUser).toHaveBeenCalledWith('test-session-id', createdUser);
    });

    test('TC8: User does not exist and email is null - should create user with null email', async () => {
      // Arrange
      const newUser = {
        Name: 'Test User',
        email: null,
        uuid: 'auth0|123456789'
      };
      
      const createdUser = {
        id: 2,
        ...newUser,
        phone: null
      };
      
      mockReq.oidc.isAuthenticated.mockReturnValue(true);
      mockReq.oidc.user = { 
        sid: 'test-session-id',
        sub: 'auth0|123456789',
        name: 'Test User',
        email: null
      };
      sessionManager.checkAndRefreshed.mockReturnValue(false);
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(createdUser);
      
      // Act
      await checkUser(mockReq, mockRes, mockNext);
      
      // Assert
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: newUser
      });
    });
  });

  describe('Path Coverage Tests', () => {
    
    test('TC9: Complete path through all branches - user not authenticated', async () => {
      // Arrange
      mockReq.oidc.isAuthenticated.mockReturnValue(false);
      
      // Act
      await checkUser(mockReq, mockRes, mockNext);
      
      // Assert - Verify only first condition is checked
      expect(mockReq.oidc.isAuthenticated).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(sessionManager.checkAndRefreshed).not.toHaveBeenCalled();
      expect(prisma.$connect).not.toHaveBeenCalled();
    });

    test('TC10: Complete path - user authenticated, logged in session', async () => {
      // Arrange
      mockReq.oidc.isAuthenticated.mockReturnValue(true);
      mockReq.oidc.user = { sid: 'test-session-id' };
      sessionManager.checkAndRefreshed.mockReturnValue(true);
      
      // Act
      await checkUser(mockReq, mockRes, mockNext);
      
      // Assert - Verify both conditions are checked
      expect(mockReq.oidc.isAuthenticated).toHaveBeenCalledTimes(1);
      expect(sessionManager.checkAndRefreshed).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(prisma.$connect).not.toHaveBeenCalled();
    });

    test('TC11: Complete path - user authenticated, not in session, no user.sub', async () => {
      // Arrange
      mockReq.oidc.isAuthenticated.mockReturnValue(true);
      mockReq.oidc.user = { sid: 'test-session-id' };
      sessionManager.checkAndRefreshed.mockReturnValue(false);
      
      // Act
      await checkUser(mockReq, mockRes, mockNext);
      
      // Assert - Verify database connection but no user operations
      expect(prisma.$connect).toHaveBeenCalledTimes(1);
      expect(prisma.user.findFirst).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    test('TC12: Complete path - user authenticated, not in session, has user.sub, user exists with matching uuid', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        Name: 'Test User',
        email: 'test@example.com',
        uuid: 'auth0|123456789'
      };
      
      mockReq.oidc.isAuthenticated.mockReturnValue(true);
      mockReq.oidc.user = { 
        sid: 'test-session-id',
        sub: 'auth0|123456789',
        email: 'test@example.com'
      };
      sessionManager.checkAndRefreshed.mockReturnValue(false);
      prisma.user.findFirst.mockResolvedValue(mockUser);
      
      // Act
      await checkUser(mockReq, mockRes, mockNext);
      
      // Assert - Verify user found and added to session
      expect(prisma.user.findFirst).toHaveBeenCalledTimes(1);
      expect(sessionManager.addUser).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling Tests', () => {
    
    test('TC13: Database connection error', async () => {
      // Arrange
      mockReq.oidc.isAuthenticated.mockReturnValue(true);
      mockReq.oidc.user = { sid: 'test-session-id' };
      sessionManager.checkAndRefreshed.mockReturnValue(false);
      prisma.$connect.mockRejectedValue(new Error('Database connection failed'));
      
      // Act & Assert
      await expect(checkUser(mockReq, mockRes, mockNext)).rejects.toThrow('Database connection failed');
    });

    test('TC14: Database findFirst error', async () => {
      // Arrange
      mockReq.oidc.isAuthenticated.mockReturnValue(true);
      mockReq.oidc.user = { 
        sid: 'test-session-id',
        sub: 'auth0|123456789',
        email: 'test@example.com'
      };
      sessionManager.checkAndRefreshed.mockReturnValue(false);
      prisma.user.findFirst.mockRejectedValue(new Error('Database query failed'));
      
      // Act & Assert
      await expect(checkUser(mockReq, mockRes, mockNext)).rejects.toThrow('Database query failed');
    });

    test('TC15: Database create error', async () => {
      // Arrange
      mockReq.oidc.isAuthenticated.mockReturnValue(true);
      mockReq.oidc.user = { 
        sid: 'test-session-id',
        sub: 'auth0|123456789',
        name: 'Test User',
        email: 'test@example.com'
      };
      sessionManager.checkAndRefreshed.mockReturnValue(false);
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.user.create.mockRejectedValue(new Error('Database create failed'));
      
      // Act & Assert
      await expect(checkUser(mockReq, mockRes, mockNext)).rejects.toThrow('Database create failed');
    });

    test('TC16: Database update error', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        Name: 'Test User',
        email: 'test@example.com',
        uuid: 'auth0|old-uuid'
      };
      
      mockReq.oidc.isAuthenticated.mockReturnValue(true);
      mockReq.oidc.user = { 
        sid: 'test-session-id',
        sub: 'auth0|123456789',
        email: 'test@example.com'
      };
      sessionManager.checkAndRefreshed.mockReturnValue(false);
      prisma.user.findFirst.mockResolvedValue(mockUser);
      prisma.user.update.mockRejectedValue(new Error('Database update failed'));
      
      // Act & Assert
      await expect(checkUser(mockReq, mockRes, mockNext)).rejects.toThrow('Database update failed');
    });
  });

  describe('getUserFromDB Function Tests', () => {
    
    test('TC17: getUserFromDB - user found by email', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        Name: 'Test User',
        email: 'test@example.com',
        uuid: 'auth0|123456789'
      };
      
      prisma.user.findFirst.mockResolvedValue(mockUser);
      
      // Act
      const result = await getUserFromDB('auth0|123456789', 'test@example.com');
      
      // Assert
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: 'test@example.com' },
            { uuid: { contains: 'auth0|123456789' } }
          ]
        }
      });
      expect(result).toEqual(mockUser);
    });

    test('TC18: getUserFromDB - user found by uuid', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        Name: 'Test User',
        email: 'test@example.com',
        uuid: 'auth0|123456789'
      };
      
      prisma.user.findFirst.mockResolvedValue(mockUser);
      
      // Act
      const result = await getUserFromDB('auth0|123456789', null);
      
      // Assert
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: null },
            { uuid: { contains: 'auth0|123456789' } }
          ]
        }
      });
      expect(result).toEqual(mockUser);
    });

    test('TC19: getUserFromDB - user not found', async () => {
      // Arrange
      prisma.user.findFirst.mockResolvedValue(null);
      
      // Act
      const result = await getUserFromDB('auth0|123456789', 'test@example.com');
      
      // Assert
      expect(result).toBeNull();
    });
  });
}); 