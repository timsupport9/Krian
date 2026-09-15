import BaseModel from './BaseModel.js';

export default class User extends BaseModel {
  constructor(db) {
    super(db, 'users');
  }

  async findByEmail(email) {
    return await this.findBy('email', email);
  }

  async findByRole(role) {
    return await this.db.query(
      'SELECT * FROM users WHERE role = ?',
      [role]
    );
  }

  async getActiveUsers() {
    return await this.db.query(
      'SELECT * FROM users WHERE status = ? ORDER BY created_at DESC',
      ['active']
    );
  }

  async getExperts() {
    return await this.db.query(
      'SELECT * FROM users WHERE role = ? AND status = ?',
      ['expert', 'active']
    );
  }

  async updateLastLogin(id) {
    return await this.db.update('users', { last_login_at: new Date() }, { id });
  }

  async incrementLoginAttempts(email) {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const attempts = (user.login_attempts || 0) + 1;
    await this.db.update('users', { login_attempts: attempts }, { id: user.id });
    return user;
  }

  async resetLoginAttempts(email) {
    const user = await this.findByEmail(email);
    if (!user) return null;

    await this.db.update('users', { login_attempts: 0 }, { id: user.id });
    return user;
  }
}
