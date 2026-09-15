CREATE TABLE IF NOT EXISTS webinars (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT,
  expert_id INT NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  meeting_link VARCHAR(255),
  capacity INT,
  registered_count INT DEFAULT 0,
  status ENUM('scheduled', 'live', 'completed', 'cancelled') DEFAULT 'scheduled',
  recording_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (expert_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_start_time (start_time)
);
