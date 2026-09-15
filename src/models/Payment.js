import BaseModel from './BaseModel.js';

export default class Payment extends BaseModel {
  constructor(db) {
    super(db, 'payments');
  }

  async findByReference(referenceId) {
    return await this.findBy('reference_id', referenceId);
  }

  async getUserPayments(userId) {
    return await this.db.query(
      'SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
  }

  async getCompletedPayments(userId) {
    return await this.db.query(
      'SELECT * FROM payments WHERE user_id = ? AND status = ? ORDER BY paid_at DESC',
      [userId, 'completed']
    );
  }

  async getTotalEarnings(expertId) {
    const result = await this.db.queryOne(
      'SELECT SUM(amount) as total FROM payments WHERE status = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)',
      ['completed']
    );
    return result?.total || 0;
  }

  async markAsPaid(paymentId) {
    return await this.db.update(
      'payments',
      { status: 'completed', paid_at: new Date() },
      { id: paymentId }
    );
  }
}
