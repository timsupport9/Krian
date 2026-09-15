export default class AuthService {
  constructor(userModel, logger) {
    this.userModel = userModel;
    this.logger = logger;
  }

  async register(data) {
    try {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.default.hash(data.password, 10);

      const result = await this.userModel.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        role: data.role || 'student',
        status: 'active',
      });

      this.logger.info(`User registered: ${data.email}`);
      return result;
    } catch (error) {
      this.logger.error('Registration error:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const user = await this.userModel.findByEmail(email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const bcrypt = await import('bcryptjs');
      const isValid = await bcrypt.default.compare(password, user.password);

      if (!isValid) {
        await this.userModel.incrementLoginAttempts(email);
        throw new Error('Invalid credentials');
      }

      await this.userModel.updateLastLogin(user.id);
      await this.userModel.resetLoginAttempts(email);

      this.logger.info(`User logged in: ${email}`);
      return user;
    } catch (error) {
      this.logger.error('Login error:', error);
      throw error;
    }
  }

  async verifyToken(token, secret) {
    try {
      const jwt = await import('jsonwebtoken');
      return jwt.verify(token, secret);
    } catch (error) {
      this.logger.error('Token verification failed:', error);
      throw error;
    }
  }
}
