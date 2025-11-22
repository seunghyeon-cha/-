export const testUsers = {
  validUser: {
    email: process.env.TEST_USER_EMAIL || 'test@example.com',
    password: process.env.TEST_USER_PASSWORD || 'password123',
    name: '테스트유저',
  },
  invalidUser: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
  },
  newUser: {
    email: `test-${Date.now()}@example.com`,
    password: 'testpass123',
    name: '새테스트유저',
  },
};
