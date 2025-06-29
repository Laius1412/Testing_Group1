import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Mock the entire server module
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
    addUser: jest.fn(),
    isLogged: jest.fn()
  }
}));

// Import mocked dependencies
import { prisma, sessionManager } from '../../server.js';
import checkUser from '../../routes/db/checkUser.js';

describe('Registration Integration Tests', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a simple Express app for testing
    app = express();
    app.use(express.json());
    
    // Add the checkUser middleware
    app.use(checkUser);
    
    // Add a test route
    app.get('/test', (req, res) => {
      res.json({ message: 'Test route', user: req.oidc?.user });
    });
  });

  describe('Registration Flow Tests', () => {
    
    test('IT1: Complete registration flow - new user', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        Name: 'New User',
        email: 'newuser@example.com',
        uuid: 'auth0|123456789',
        phone: null
      };

      const mockOidcUser = {
        sid: 'test-session-id',
        sub: 'auth0|123456789',
        name: 'New User',
        email: 'newuser@example.com'
      };

      // Mock authentication
      app.use((req, res, next) => {
        req.oidc = {
          isAuthenticated: () => true,
          user: mockOidcUser
        };
        next();
      });

      sessionManager.checkAndRefreshed.mockReturnValue(false);
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser);

      // Act
      const response = await request(app)
        .get('/test')
        .expect(200);

      // Assert
      expect(prisma.$connect).toHaveBeenCalledTimes(1);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: 'newuser@example.com' },
            { uuid: { contains: 'auth0|123456789' } }
          ]
        }
      });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          Name: 'New User',
          email: 'newuser@example.com',
          uuid: 'auth0|123456789'
        }
      });
      expect(sessionManager.addUser).toHaveBeenCalledWith('test-session-id', mockUser);
      expect(response.body.message).toBe('Test route');
    });

    test('IT2: Registration flow - existing user with matching uuid', async () => {
      // Arrange
      const existingUser = {
        id: 1,
        Name: 'Existing User',
        email: 'existing@example.com',
        uuid: 'auth0|123456789',
        phone: '1234567890'
      };

      const mockOidcUser = {
        sid: 'test-session-id',
        sub: 'auth0|123456789',
        name: 'Existing User',
        email: 'existing@example.com'
      };

      app.use((req, res, next) => {
        req.oidc = {
          isAuthenticated: () => true,
          user: mockOidcUser
        };
        next();
      });

      sessionManager.checkAndRefreshed.mockReturnValue(false);
      prisma.user.findFirst.mockResolvedValue(existingUser);

      // Act
      const response = await request(app)
        .get('/test')
        .expect(200);

      // Assert
      expect(prisma.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(sessionManager.addUser).toHaveBeenCalledWith('test-session-id', existingUser);
    });

    test('IT3: Registration flow - existing user with different uuid', async () => {
      // Arrange
      const existingUser = {
        id: 1,
        Name: 'Existing User',
        email: 'existing@example.com',
        uuid: 'auth0|old-uuid',
        phone: '1234567890'
      };

      const updatedUser = {
        ...existingUser,
        uuid: 'auth0|old-uuid, auth0|123456789'
      };

      const mockOidcUser = {
        sid: 'test-session-id',
        sub: 'auth0|123456789',
        name: 'Existing User',
        email: 'existing@example.com'
      };

      app.use((req, res, next) => {
        req.oidc = {
          isAuthenticated: () => true,
          user: mockOidcUser
        };
        next();
      });

      sessionManager.checkAndRefreshed.mockReturnValue(false);
      prisma.user.findFirst.mockResolvedValue(existingUser);
      prisma.user.update.mockResolvedValue(updatedUser);

      // Act
      const response = await request(app)
        .get('/test')
        .expect(200);

      // Assert
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updatedUser
      });
      expect(sessionManager.addUser).toHaveBeenCalledWith('test-session-id', updatedUser);
    });

    test('IT4: Registration flow - user already in session', async () => {
      // Arrange
      const mockOidcUser = {
        sid: 'test-session-id',
        sub: 'auth0|123456789',
        name: 'Test User',
        email: 'test@example.com'
      };

      app.use((req, res, next) => {
        req.oidc = {
          isAuthenticated: () => true,
          user: mockOidcUser
        };
        next();
      });

      sessionManager.checkAndRefreshed.mockReturnValue(true);

      // Act
      const response = await request(app)
        .get('/test')
        .expect(200);

      // Assert
      expect(sessionManager.checkAndRefreshed).toHaveBeenCalledWith('test-session-id');
      expect(prisma.$connect).not.toHaveBeenCalled();
      expect(prisma.user.findFirst).not.toHaveBeenCalled();
      expect(sessionManager.addUser).not.toHaveBeenCalled();
    });

    test('IT5: Registration flow - user not authenticated', async () => {
      // Arrange
      app.use((req, res, next) => {
        req.oidc = {
          isAuthenticated: () => false,
          user: null
        };
        next();
      });

      // Act
      const response = await request(app)
        .get('/test')
        .expect(200);

      // Assert
      expect(prisma.$connect).not.toHaveBeenCalled();
      expect(prisma.user.findFirst).not.toHaveBeenCalled();
      expect(sessionManager.addUser).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling Integration Tests', () => {
    
    test('IT6: Database connection error during registration', async () => {
      // Arrange
      const mockOidcUser = {
        sid: 'test-session-id',
        sub: 'auth0|123456789',
        name: 'Test User',
        email: 'test@example.com'
      };

      app.use((req, res, next) => {
        req.oidc = {
          isAuthenticated: () => true,
          user: mockOidcUser
        };
        next();
      });

      sessionManager.checkAndRefreshed.mockReturnValue(false);
      prisma.$connect.mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert
      await expect(
        request(app).get('/test')
      ).rejects.toThrow('Database connection failed');
    });

    test('IT7: Database create error during registration', async () => {
      // Arrange
      const mockOidcUser = {
        sid: 'test-session-id',
        sub: 'auth0|123456789',
        name: 'Test User',
        email: 'test@example.com'
      };

      app.use((req, res, next) => {
        req.oidc = {
          isAuthenticated: () => true,
          user: mockOidcUser
        };
        next();
      });

      sessionManager.checkAndRefreshed.mockReturnValue(false);
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.user.create.mockRejectedValue(new Error('Database create failed'));

      // Act & Assert
      await expect(
        request(app).get('/test')
      ).rejects.toThrow('Database create failed');
    });
  });

  describe('Data Validation Integration Tests', () => {
    
    test('IT8: Registration with null name', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        Name: '',
        email: 'test@example.com',
        uuid: 'auth0|123456789',
        phone: null
      };

      const mockOidcUser = {
        sid: 'test-session-id',
        sub: 'auth0|123456789',
        name: null,
        email: 'test@example.com'
      };

      app.use((req, res, next) => {
        req.oidc = {
          isAuthenticated: () => true,
          user: mockOidcUser
        };
        next();
      });

      sessionManager.checkAndRefreshed.mockReturnValue(false);
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser);

      // Act
      const response = await request(app)
        .get('/test')
        .expect(200);

      // Assert
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          Name: '',
          email: 'test@example.com',
          uuid: 'auth0|123456789'
        }
      });
    });

    test('IT9: Registration with null email', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        Name: 'Test User',
        email: null,
        uuid: 'auth0|123456789',
        phone: null
      };

      const mockOidcUser = {
        sid: 'test-session-id',
        sub: 'auth0|123456789',
        name: 'Test User',
        email: null
      };

      app.use((req, res, next) => {
        req.oidc = {
          isAuthenticated: () => true,
          user: mockOidcUser
        };
        next();
      });

      sessionManager.checkAndRefreshed.mockReturnValue(false);
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser);

      // Act
      const response = await request(app)
        .get('/test')
        .expect(200);

      // Assert
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          Name: 'Test User',
          email: null,
          uuid: 'auth0|123456789'
        }
      });
    });
  });
}); 