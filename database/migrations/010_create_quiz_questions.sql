CREATE TABLE IF NOT EXISTS quiz_questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  quiz_id INT NOT NULL,
  type ENUM('multiple_choice', 'true_false', 'short_answer') DEFAULT 'multiple_choice',
  question TEXT NOT NULL,
  explanation LONGTEXT,
  sequence INT DEFAULT 0,
  points INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
  INDEX idx_quiz_id (quiz_id)
);
