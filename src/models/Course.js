import BaseModel from './BaseModel.js';

export default class Course extends BaseModel {
  constructor(db) {
    super(db, 'courses');
  }

  async findBySlug(slug) {
    return await this.findBy('slug', slug);
  }

  async getPublished() {
    return await this.db.query(
      'SELECT * FROM courses WHERE status = ? ORDER BY created_at DESC',
      ['published']
    );
  }

  async getByExpert(expertId) {
    return await this.db.query(
      'SELECT * FROM courses WHERE expert_id = ? ORDER BY created_at DESC',
      [expertId]
    );
  }

  async getFeatured() {
    return await this.db.query(
      'SELECT * FROM courses WHERE is_featured = ? AND status = ? ORDER BY rating DESC LIMIT 10',
      [true, 'published']
    );
  }

  async search(query) {
    return await this.db.query(
      'SELECT * FROM courses WHERE (title LIKE ? OR description LIKE ?) AND status = ? ORDER BY created_at DESC',
      [`%${query}%`, `%${query}%`, 'published']
    );
  }

  async getWithModules(courseId) {
    const course = await this.find(courseId);
    if (!course) return null;

    const modules = await this.db.query(
      'SELECT * FROM modules WHERE course_id = ? ORDER BY sequence',
      [courseId]
    );

    course.modules = modules;
    return course;
  }
}
