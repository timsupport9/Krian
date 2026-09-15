CREATE TABLE IF NOT EXISTS webinar_registrations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  webinar_id INT NOT NULL,
  user_id INT NOT NULL,
  status ENUM('registered', 'attended', 'cancelled') DEFAULT 'registered',
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  attended_at TIMESTAMP NULL,
  FOREIGN KEY (webinar_id) REFERENCES webinars(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_registration (webinar_id, user_id),
  INDEX idx_webinar_id (webinar_id),
  INDEX idx_user_id (user_id)
);
