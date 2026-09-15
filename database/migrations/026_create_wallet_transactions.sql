CREATE TABLE IF NOT EXISTS wallet_transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  wallet_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  type ENUM('credit', 'debit') NOT NULL,
  description VARCHAR(255),
  reference_id VARCHAR(255),
  balance_before DECIMAL(10, 2),
  balance_after DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
  INDEX idx_wallet_id (wallet_id),
  INDEX idx_created_at (created_at)
);
