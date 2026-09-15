import BaseModel from './BaseModel.js';

export default class Quiz extends BaseModel {
  constructor(db) {
    super(db, 'quizzes');
  }

  async getQuizzesByCourse(courseId) {
    return await this.db.query(
      'SELECT * FROM quizzes WHERE course_id = ? ORDER BY created_at',
      [courseId]
    );
  }

  async getQuizWithQuestions(quizId) {
    const quiz = await this.find(quizId);
    if (!quiz) return null;

    const questions = await this.db.query(
      'SELECT * FROM quiz_questions WHERE quiz_id = ? ORDER BY sequence',
      [quizId]
    );

    for (const question of questions) {
      question.options = await this.db.query(
        'SELECT * FROM quiz_options WHERE question_id = ? ORDER BY sequence',
        [question.id]
      );
    }

    quiz.questions = questions;
    return quiz;
  }

  async getUserQuizAttempts(quizId, userId) {
    return await this.db.query(
      'SELECT * FROM quiz_attempts WHERE quiz_id = ? AND user_id = ? ORDER BY created_at DESC',
      [quizId, userId]
    );
  }

  async canAttempt(quizId, userId) {
    const quiz = await this.find(quizId);
    if (!quiz) return false;

    const attempts = await this.db.query(
      'SELECT COUNT(*) as count FROM quiz_attempts WHERE quiz_id = ? AND user_id = ?',
      [quizId, userId]
    );

    return attempts[0].count < quiz.attempts_allowed;
  }
}
