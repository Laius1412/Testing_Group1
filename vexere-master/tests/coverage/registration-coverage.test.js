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

describe('Registration Code Coverage Tests', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    jest.clearAllMocks();
    
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

  describe('Statement Coverage Tests', () => {
    
    test('SC1: Cover all statements in checkUser function', async () => {
      // This test ensures every statement in the function is executed at least once
      
      // Test case 1: User not authenticated
      mockReq.oidc.isAuthenticated.mockReturnValue(false);
      await checkUser(mockReq, mockRes, mockNext);
      
      // Test case 2: User authenticated, already in session
      mockReq.oidc.isAuthenticated.mockReturnValue(true);
      mockReq.oidc.user = { sid: 'test-session-id' };
      sessionManager.checkAndRefreshed.mockReturnValue(true);
      await checkUser(mockReq, mockRes, mockNext);
      
      // Test case 3: User authenticated, not in session, no user.sub
      sessionManager.checkAndRefreshed.mockReturnValue(false);
      mockReq.oidc.user = { sid: 'test-session-id' };
      await checkUser(mockReq, mockRes, mockNext);
      
      // Test case 4: User authenticated, not in session, has user.sub, user exists with matching uuid
      mockReq.oidc.user = { 
        sid: 'test-session-id',
        sub: 'auth0|123456789',
        email: 'test@example.com'
      };
      const mockUser = {
        id: 1,
        Name: 'Test User',
        email: 'test@example.com',
        uuid: 'auth0|123456789'
      };
      prisma.user.findFirst.mockResolvedValue(mockUser);
      await checkUser(mockReq, mockRes, mockNext);
      
      // Test case 5: User authenticated, not in session, has user.sub, user exists but uuid doesn't match
      const mockUser2 = {
        id: 1,
        Name: 'Test User',
        email: 'test@example.com',
        uuid: 'auth0|old-uuid'
      };
      prisma.user.findFirst.mockResolvedValue(mockUser2);
      const updatedUser = { ...mockUser2, uuid: 'auth0|old-uuid, auth0|123456789' };
      prisma.user.update.mockResolvedValue(updatedUser);
      await checkUser(mockReq, mockRes, mockNext);
      
      // Test case 6: User authenticated, not in session, has user.sub, user doesn't exist
      prisma.user.findFirst.mockResolvedValue(null);
      const newUser = {
        Name: 'New User',
        email: 'new@example.com',
        uuid: 'auth0|123456789'
      };
      const createdUser = { id: 2, ...newUser, phone: null };
      prisma.user.create.mockResolvedValue(createdUser);
      mockReq.oidc.user.name = 'New User';
      mockReq.oidc.user.email = 'new@example.com';
      await checkUser(mockReq, mockRes, mockNext);
      
      // Verify all statements were executed
      expect(mockReq.oidc.isAuthenticated).toHaveBeenCalled();
      expect(sessionManager.checkAndRefreshed).toHaveBeenCalled();
      expect(prisma.$connect).toHaveBeenCalled();
      expect(prisma.user.findFirst).toHaveBeenCalled();
      expect(prisma.user.create).toHaveBeenCalled();
      expect(prisma.user.update).toHaveBeenCalled();
      expect(sessionManager.addUser).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('Branch Coverage Tests', () => {
    
    test('BC1: Cover all branches in authentication check', async () => {
      // Branch 1: !req.oidc.isAuthenticated() = true
      mockReq.oidc.isAuthenticated.mockReturnValue(false);
      await checkUser(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);
      
      // Branch 2: !req.oidc.isAuthenticated() = false
      mockReq.oidc.isAuthenticated.mockReturnValue(true);
      mockReq.oidc.user = { sid: 'test-session-id' };
      sessionManager.checkAndRefreshed.mockReturnValue(true);
      await checkUser(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(2);
    });

    test('BC2: Cover all branches in session check', async () => {
      // Branch 1: sessionManager.checkAndRefreshed() = true
      mockReq.oidc.isAuthenticated.mockReturnValue(true);
      mockReq.oidc.user = { sid: 'test-session-id' };
      sessionManager.checkAndRefreshed.mockReturnValue(true);
      await checkUser(mockReq, mockRes, mockNext);
      
      // Branch 2: sessionManager.checkAndRefreshed() = false
      sessionManager.checkAndRefreshed.mockReturnValue(false);
      await checkUser(mockReq, mockRes, mockNext);
    });

    test('BC3: Cover all branches in user.sub check', async () => {
      // Branch 1: req.oidc.user && req.oidc.user.sub = false
      mockReq.oidc.isAuthenticated.mockReturnValue(true);
      mockReq.oidc.user = { sid: 'test-session-id' };
      sessionManager.checkAndRefreshed.mockReturnValue(false);
      await checkUser(mockReq, mockRes, mockNext);
      
      // Branch 2: req.oidc.user && req.oidc.user.sub = true
      mockReq.oidc.user = { 
        sid: 'test-session-id',
        sub: 'auth0|123456789',
        email: 'test@example.com'
      };
      await checkUser(mockReq, mockRes, mockNext);
    });

    test('BC4: Cover all branches in user existence check', async () => {
      // Branch 1: userSaved = null (user doesn't exist)
      mockReq.oidc.isAuthenticated.mockReturnValue(true);
      mockReq.oidc.user = { 
        sid: 'test-session-id',
        sub: 'auth0|123456789',
        name: 'New User',
        email: 'new@example.com'
      };
      sessionManager.checkAndRefreshed.mockReturnValue(false);
      prisma.user.findFirst.mockResolvedValue(null);
      const createdUser = { id: 1, Name: 'New User', email: 'new@example.com', uuid: 'auth0|123456789', phone: null };
      prisma.user.create.mockResolvedValue(createdUser);
      await checkUser(mockReq, mockRes, mockNext);
      
      // Branch 2: userSaved exists
      const existingUser = { id: 1, Name: 'Test User', email: 'test@example.com', uuid: 'auth0|123456789' };
      prisma.user.findFirst.mockResolvedValue(existingUser);
      await checkUser(mockReq, mockRes, mockNext);
    });

    test('BC5: Cover all branches in uuid matching check', async () => {
      // Branch 1: userSaved.uuid && userSaved.uuid.includes(req.oidc.user.sub) = true
      mockReq.oidc.isAuthenticated.mockReturnValue(true);
      mockReq.oidc.user = { 
        sid: 'test-session-id',
        sub: 'auth0|123456789',
        email: 'test@example.com'
      };
      sessionManager.checkAndRefreshed.mockReturnValue(false);
      const userWithMatchingUuid = { 
        id: 1, 
        Name: 'Test User', 
        email: 'test@example.com', 
        uuid: 'auth0|123456789' 
      };
      prisma.user.findFirst.mockResolvedValue(userWithMatchingUuid);
      await checkUser(mockReq, mockRes, mockNext);
      
      // Branch 2: userSaved.uuid && userSaved.uuid.includes(req.oidc.user.sub) = false
      const userWithDifferentUuid = { 
        id: 1, 
        Name: 'Test User', 
        email: 'test@example.com', 
        uuid: 'auth0|old-uuid' 
      };
      prisma.user.findFirst.mockResolvedValue(userWithDifferentUuid);
      const updatedUser = { ...userWithDifferentUuid, uuid: 'auth0|old-uuid, auth0|123456789' };
      prisma.user.update.mockResolvedValue(updatedUser);
      await checkUser(mockReq, mockRes, mockNext);
    });

    test('BC6: Cover all branches in name and email null checks', async () => {
      // Branch 1: req.oidc.user.name = null
      mockReq.oidc.isAuthenticated.mockReturnValue(true);
      mockReq.oidc.user = { 
        sid: 'test-session-id',
        sub: 'auth0|123456789',
        name: null,
        email: 'test@example.com'
      };
      sessionManager.checkAndRefreshed.mockReturnValue(false);
      prisma.user.findFirst.mockResolvedValue(null);
      const createdUser1 = { id: 1, Name: '', email: 'test@example.com', uuid: 'auth0|123456789', phone: null };
      prisma.user.create.mockResolvedValue(createdUser1);
      await checkUser(mockReq, mockRes, mockNext);
      
      // Branch 2: req.oidc.user.name = "Test User"
      mockReq.oidc.user.name = 'Test User';
      const createdUser2 = { id: 2, Name: 'Test User', email: 'test@example.com', uuid: 'auth0|123456789', phone: null };
      prisma.user.create.mockResolvedValue(createdUser2);
      await checkUser(mockReq, mockRes, mockNext);
      
      // Branch 3: req.oidc.user.email = null
      mockReq.oidc.user.email = null;
      const createdUser3 = { id: 3, Name: 'Test User', email: null, uuid: 'auth0|123456789', phone: null };
      prisma.user.create.mockResolvedValue(createdUser3);
      await checkUser(mockReq, mockRes, mockNext);
    });
  });

  describe('Condition Coverage Tests', () => {
    
    test('CC1: Cover all conditions in authentication check', async () => {
      // Condition: !req.oidc.isAuthenticated()
      // Sub-condition 1: req.oidc.isAuthenticated() = false
      mockReq.oidc.isAuthenticated.mockReturnValue(false);
      await checkUser(mockReq, mockRes, mockNext);
      
      // Sub-condition 2: req.oidc.isAuthenticated() = true
      mockReq.oidc.isAuthenticated.mockReturnValue(true);
      mockReq.oidc.user = { sid: 'test-session-id' };
      sessionManager.checkAndRefreshed.mockReturnValue(true);
      await checkUser(mockReq, mockRes, mockNext);
    });

    test('CC2: Cover all conditions in session check', async () => {
      // Condition: req.oidc.user && req.oidc.user.sid && sessionManager.checkAndRefreshed(req.oidc.user.sid)
      // Sub-condition 1: req.oidc.user = null
      mockReq.oidc.isAuthenticated.mockReturnValue(true);
      mockReq.oidc.user = null;
      await checkUser(mockReq, mockRes, mockNext);
      
      // Sub-condition 2: req.oidc.user.sid = undefined
      mockReq.oidc.user = {};
      await checkUser(mockReq, mockRes, mockNext);
      
      // Sub-condition 3: sessionManager.checkAndRefreshed() = false
      mockReq.oidc.user = { sid: 'test-session-id' };
      sessionManager.checkAndRefreshed.mockReturnValue(false);
      await checkUser(mockReq, mockRes, mockNext);
      
      // Sub-condition 4: All conditions true
      sessionManager.checkAndRefreshed.mockReturnValue(true);
      await checkUser(mockReq, mockRes, mockNext);
    });

    test('CC3: Cover all conditions in user.sub check', async () => {
      // Condition: req.oidc.user && req.oidc.user.sub
      // Sub-condition 1: req.oidc.user = null
      mockReq.oidc.isAuthenticated.mockReturnValue(true);
      mockReq.oidc.user = null;
      sessionManager.checkAndRefreshed.mockReturnValue(false);
      await checkUser(mockReq, mockRes, mockNext);
      
      // Sub-condition 2: req.oidc.user.sub = undefined
      mockReq.oidc.user = { sid: 'test-session-id' };
      await checkUser(mockReq, mockRes, mockNext);
      
      // Sub-condition 3: Both conditions true
      mockReq.oidc.user = { 
        sid: 'test-session-id',
        sub: 'auth0|123456789',
        email: 'test@example.com'
      };
      await checkUser(mockReq, mockRes, mockNext);
    });

    test('CC4: Cover all conditions in uuid matching check', async () => {
      // Condition: userSaved.uuid && userSaved.uuid.includes(req.oidc.user.sub)
      // Sub-condition 1: userSaved.uuid = null
      mockReq.oidc.isAuthenticated.mockReturnValue(true);
      mockReq.oidc.user = { 
        sid: 'test-session-id',
        sub: 'auth0|123456789',
        email: 'test@example.com'
      };
      sessionManager.checkAndRefreshed.mockReturnValue(false);
      const userWithoutUuid = { 
        id: 1, 
        Name: 'Test User', 
        email: 'test@example.com', 
        uuid: null 
      };
      prisma.user.findFirst.mockResolvedValue(userWithoutUuid);
      await checkUser(mockReq, mockRes, mockNext);
      
      // Sub-condition 2: userSaved.uuid.includes() = false
      const userWithDifferentUuid = { 
        id: 1, 
        Name: 'Test User', 
        email: 'test@example.com', 
        uuid: 'auth0|different-uuid' 
      };
      prisma.user.findFirst.mockResolvedValue(userWithDifferentUuid);
      const updatedUser = { ...userWithDifferentUuid, uuid: 'auth0|different-uuid, auth0|123456789' };
      prisma.user.update.mockResolvedValue(updatedUser);
      await checkUser(mockReq, mockRes, mockNext);
      
      // Sub-condition 3: Both conditions true
      const userWithMatchingUuid = { 
        id: 1, 
        Name: 'Test User', 
        email: 'test@example.com', 
        uuid: 'auth0|123456789' 
      };
      prisma.user.findFirst.mockResolvedValue(userWithMatchingUuid);
      await checkUser(mockReq, mockRes, mockNext);
    });
  });

  describe('Path Coverage Tests', () => {
    
    test('PC1: Cover all possible execution paths', async () => {
      // Path 1: Not authenticated -> next()
      mockReq.oidc.isAuthenticated.mockReturnValue(false);
      await checkUser(mockReq, mockRes, mockNext);
      
      // Path 2: Authenticated, in session -> next()
      mockReq.oidc.isAuthenticated.mockReturnValue(true);
      mockReq.oidc.user = { sid: 'test-session-id' };
      sessionManager.checkAndRefreshed.mockReturnValue(true);
      await checkUser(mockReq, mockRes, mockNext);
      
      // Path 3: Authenticated, not in session, no user.sub -> next()
      sessionManager.checkAndRefreshed.mockReturnValue(false);
      mockReq.oidc.user = { sid: 'test-session-id' };
      await checkUser(mockReq, mockRes, mockNext);
      
      // Path 4: Authenticated, not in session, has user.sub, user exists with matching uuid -> next()
      mockReq.oidc.user = { 
        sid: 'test-session-id',
        sub: 'auth0|123456789',
        email: 'test@example.com'
      };
      const userWithMatchingUuid = { 
        id: 1, 
        Name: 'Test User', 
        email: 'test@example.com', 
        uuid: 'auth0|123456789' 
      };
      prisma.user.findFirst.mockResolvedValue(userWithMatchingUuid);
      await checkUser(mockReq, mockRes, mockNext);
      
      // Path 5: Authenticated, not in session, has user.sub, user exists with different uuid -> next()
      const userWithDifferentUuid = { 
        id: 1, 
        Name: 'Test User', 
        email: 'test@example.com', 
        uuid: 'auth0|old-uuid' 
      };
      prisma.user.findFirst.mockResolvedValue(userWithDifferentUuid);
      const updatedUser = { ...userWithDifferentUuid, uuid: 'auth0|old-uuid, auth0|123456789' };
      prisma.user.update.mockResolvedValue(updatedUser);
      await checkUser(mockReq, mockRes, mockNext);
      
      // Path 6: Authenticated, not in session, has user.sub, user doesn't exist -> next()
      prisma.user.findFirst.mockResolvedValue(null);
      const newUser = {
        Name: 'New User',
        email: 'new@example.com',
        uuid: 'auth0|123456789'
      };
      const createdUser = { id: 2, ...newUser, phone: null };
      prisma.user.create.mockResolvedValue(createdUser);
      mockReq.oidc.user.name = 'New User';
      mockReq.oidc.user.email = 'new@example.com';
      await checkUser(mockReq, mockRes, mockNext);
      
      // Verify all paths were executed
      expect(mockNext).toHaveBeenCalledTimes(6);
    });
  });

  describe('getUserFromDB Coverage Tests', () => {
    
    test('GDC1: Cover all statements in getUserFromDB', async () => {
      const mockUser = {
        id: 1,
        Name: 'Test User',
        email: 'test@example.com',
        uuid: 'auth0|123456789'
      };
      
      prisma.user.findFirst.mockResolvedValue(mockUser);
      
      const result = await getUserFromDB('auth0|123456789', 'test@example.com');
      
      expect(prisma.$connect).toHaveBeenCalled();
      expect(prisma.user.findFirst).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    test('GDC2: Cover all branches in getUserFromDB', async () => {
      // Branch 1: User found
      const mockUser = {
        id: 1,
        Name: 'Test User',
        email: 'test@example.com',
        uuid: 'auth0|123456789'
      };
      prisma.user.findFirst.mockResolvedValue(mockUser);
      const result1 = await getUserFromDB('auth0|123456789', 'test@example.com');
      expect(result1).toEqual(mockUser);
      
      // Branch 2: User not found
      prisma.user.findFirst.mockResolvedValue(null);
      const result2 = await getUserFromDB('auth0|123456789', 'test@example.com');
      expect(result2).toBeNull();
    });
  });
}); 