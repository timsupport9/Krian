import BaseModel from './BaseModel.js';

export default class Notification extends BaseModel {
  constructor(db) {
    super(db, 'notifications');
  }

  async getUserNotifications(userId, unreadOnly = false) {
    let query = 'SELECT * FROM notifications WHERE user_id = ?';
    const params = [userId];

    if (unreadOnly) {
      query += ' AND is_read = ?';
      params.push(false);
    }

    query += ' ORDER BY created_at DESC';
    return await this.db.query(query, params);
  }

  async markAsRead(notificationId) {
    return await this.db.update(
      'notifications',
      { is_read: true, read_at: new Date() },
      { id: notificationId }
    );
  }

  async markAllAsRead(userId) {
    return await this.db.update(
      'notifications',
      { is_read: true, read_at: new Date() },
      { user_id: userId }
    );
  }

  async getUnreadCount(userId) {
    const result = await this.db.queryOne(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = ?',
      [userId, false]
    );
    return result?.count || 0;
  }
}
