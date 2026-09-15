CREATE TABLE IF NOT EXISTS conversations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  initiator_id INT NOT NULL,
  recipient_id INT NOT NULL,
  last_message_id INT,
  last_message_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (initiator_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_conversation (initiator_id, recipient_id),
  INDEX idx_initiator_id (initiator_id),
  INDEX idx_recipient_id (recipient_id)
);
