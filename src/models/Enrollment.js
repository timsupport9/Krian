import BaseModel from './BaseModel.js';

export default class Enrollment extends BaseModel {
  constructor(db) {
    super(db, 'enrollments');
  }

  async findByUserAndCourse(userId, courseId) {
    return await this.db.queryOne(
      'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );
  }

  async getUserCourses(userId) {
    return await this.db.query(
      `SELECT e.*, c.* FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.user_id = ? AND e.status = ?`,
      [userId, 'active']
    );
  }

  async getCourseEnrollments(courseId) {
    return await this.db.query(
      `SELECT e.*, u.name, u.email FROM enrollments e
       JOIN users u ON e.user_id = u.id
       WHERE e.course_id = ?`,
      [courseId]
    );
  }

  async getCompletedCourses(userId) {
    return await this.db.query(
      `SELECT e.*, c.title FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.user_id = ? AND e.status = ?`,
      [userId, 'completed']
    );
  }

  async updateProgress(userId, courseId, percentage) {
    return await this.db.update(
      'enrollments',
      { progress_percentage: percentage },
      { user_id: userId, course_id: courseId }
    );
  }
}
