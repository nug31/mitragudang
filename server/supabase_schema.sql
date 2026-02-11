-- WARNING: This will delete existing data in Supabase!
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS stock_history;
DROP TABLE IF EXISTS request_items;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS categories;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  quantity INT NOT NULL DEFAULT 0,
  "minQuantity" INT NOT NULL DEFAULT 0,
  unit VARCHAR(50) DEFAULT 'pcs',
  status VARCHAR(50) DEFAULT 'in-stock',
  price DECIMAL(15, 2) DEFAULT 0,
  "isActive" INT DEFAULT 1,
  "lastRestocked" TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create requests table
CREATE TABLE IF NOT EXISTS requests (
  id VARCHAR(255) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "project_name" VARCHAR(255),
  "requester_id" VARCHAR(255) REFERENCES users(id),
  reason TEXT,
  priority VARCHAR(50) DEFAULT 'medium',
  "due_date" DATE,
  status VARCHAR(50) DEFAULT 'pending',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create request_items table
CREATE TABLE IF NOT EXISTS request_items (
  id SERIAL PRIMARY KEY,
  "request_id" VARCHAR(255) REFERENCES requests(id) ON DELETE CASCADE,
  "item_id" INT REFERENCES items(id) ON DELETE CASCADE,
  quantity INT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create stock_history table
CREATE TABLE IF NOT EXISTS stock_history (
  id SERIAL PRIMARY KEY,
  "item_id" INT REFERENCES items(id) ON DELETE CASCADE,
  "change_type" VARCHAR(50) NOT NULL,
  "quantity_before" INT NOT NULL,
  "quantity_change" INT NOT NULL,
  "quantity_after" INT NOT NULL,
  notes TEXT,
  "created_by" VARCHAR(255),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  "user_id" VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  message TEXT,
  "is_read" INT DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert demo user (password: admin123)
-- Hash should ideally be bcrypt, but I'll leave it for now or use the one from current DB
INSERT INTO users (id, name, email, password, role) 
VALUES (uuid_generate_v4()::text, 'Admin', 'admin@example.com', '$2b$10$YourBcryptHashHere', 'admin')
ON CONFLICT (email) DO NOTHING;
