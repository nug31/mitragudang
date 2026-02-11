-- Stock History Table for tracking all quantity changes
-- Run this in your Railway MySQL database

CREATE TABLE IF NOT EXISTS stock_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_id INT NOT NULL,
  change_type ENUM('opening', 'restock', 'request', 'adjustment', 'closing') NOT NULL,
  quantity_before INT NOT NULL,
  quantity_change INT NOT NULL,
  quantity_after INT NOT NULL,
  reference_id VARCHAR(100) DEFAULT NULL,  -- e.g., request_id
  notes TEXT DEFAULT NULL,
  created_by VARCHAR(36) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_item_id (item_id),
  INDEX idx_change_type (change_type),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Add some indexes for faster queries
CREATE INDEX idx_stock_history_item_date ON stock_history(item_id, created_at);
