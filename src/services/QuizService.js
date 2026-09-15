export default class QuizService {
  constructor(quizModel, logger, db) {
    this.quizModel = quizModel;
    this.logger = logger;
    this.db = db;
  }

  async startAttempt(quizId, userId) {
    try {
      const canAttempt = await this.quizModel.canAttempt(quizId, userId);

      if (!canAttempt) {
        throw new Error('No more attempts allowed for this quiz');
      }

      const result = await this.db.insert('quiz_attempts', {
        quiz_id: quizId,
        user_id: userId,
        started_at: new Date(),
      });

      this.logger.info(`Quiz attempt started: quiz=${quizId}, user=${userId}`);
      return result;
    } catch (error) {
      this.logger.error('Quiz attempt start error:', error);
      throw error;
    }
  }

  async submitAnswer(attemptId, questionId, selectedOptionId) {
    try {
      const option = await this.db.queryOne(
        'SELECT is_correct FROM quiz_options WHERE id = ?',
        [selectedOptionId]
      );

      await this.db.insert('quiz_answers', {
        attempt_id: attemptId,
        question_id: questionId,
        selected_option_id: selectedOptionId,
        is_correct: option?.is_correct || false,
      });

      this.logger.info(`Answer submitted: attempt=${attemptId}, question=${questionId}`);
    } catch (error) {
      this.logger.error('Answer submission error:', error);
      throw error;
    }
  }

  async completeAttempt(attemptId) {
    try {
      const answers = await this.db.query(
        'SELECT COUNT(*) as total, SUM(CASE WHEN is_correct = TRUE THEN 1 ELSE 0 END) as correct FROM quiz_answers WHERE attempt_id = ?',
        [attemptId]
      );

      const score = Math.round((answers[0].correct / answers[0].total) * 100);
      const attempt = await this.db.queryOne('SELECT quiz_id FROM quiz_attempts WHERE id = ?', [attemptId]);
      const quiz = await this.quizModel.find(attempt.quiz_id);

      const passed = score >= quiz.pass_score;

      await this.db.update(
        'quiz_attempts',
        { score, passed, completed_at: new Date() },
        { id: attemptId }
      );

      this.logger.info(`Quiz attempt completed: attempt=${attemptId}, score=${score}`);
      return { score, passed };
    } catch (error) {
      this.logger.error('Attempt completion error:', error);
      throw error;
    }
  }
}
