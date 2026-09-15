import BaseModel from './BaseModel.js';

export default class Appointment extends BaseModel {
  constructor(db) {
    super(db, 'appointments');
  }

  async getExpertAppointments(expertId) {
    return await this.db.query(
      `SELECT a.*, u.name as student_name FROM appointments a
       JOIN users u ON a.user_id = u.id
       WHERE a.expert_id = ? ORDER BY a.scheduled_at DESC`,
      [expertId]
    );
  }

  async getUserAppointments(userId) {
    return await this.db.query(
      `SELECT a.*, u.name as expert_name FROM appointments a
       JOIN users u ON a.expert_id = u.id
       WHERE a.user_id = ? ORDER BY a.scheduled_at DESC`,
      [userId]
    );
  }

  async getUpcoming() {
    return await this.db.query(
      'SELECT * FROM appointments WHERE status = ? AND scheduled_at > NOW() ORDER BY scheduled_at',
      ['scheduled']
    );
  }

  async checkConflict(expertId, scheduledAt, duration) {
    const endTime = new Date(new Date(scheduledAt).getTime() + duration * 60000);
    
    return await this.db.queryOne(
      `SELECT id FROM appointments 
       WHERE expert_id = ? AND status IN ('scheduled', 'in_progress')
       AND scheduled_at < ? AND DATE_ADD(scheduled_at, INTERVAL duration_minutes MINUTE) > ?`,
      [expertId, endTime, scheduledAt]
    );
  }
}
