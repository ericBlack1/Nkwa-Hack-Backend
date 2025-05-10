CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);

-- Wallets table (unchanged)
CREATE TABLE wallets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  address VARCHAR(42) UNIQUE NOT NULL,
  private_key_encrypted TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for wallet addresses
CREATE INDEX idx_wallets_address ON wallets(address);
CREATE INDEX idx_wallets_user_id ON wallets(user_id);

-- Token transactions table (unchanged)
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  wallet_id INTEGER REFERENCES wallets(id) ON DELETE CASCADE,
  tx_hash VARCHAR(66),
  recipient_address VARCHAR(42) NOT NULL,
  amount DECIMAL(20, 8) NOT NULL,  -- 20 digits total, 8 decimal places
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for transactions
CREATE INDEX idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX idx_transactions_tx_hash ON transactions(tx_hash);
CREATE INDEX idx_transactions_recipient ON transactions(recipient_address);
CREATE INDEX idx_transactions_created ON transactions(created_at);

-- Fiat transactions (NkwaPay) (unchanged)
CREATE TABLE fiat_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  payment_id VARCHAR(100) NOT NULL,
  amount_xaf DECIMAL(10, 2) NOT NULL,  -- XAF amounts (2 decimal places)
  amount_afc DECIMAL(20, 8) NOT NULL,  -- AFC amounts (8 decimal places for precision)
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for fiat transactions
CREATE INDEX idx_fiat_transactions_user_id ON fiat_transactions(user_id);
CREATE INDEX idx_fiat_transactions_payment_id ON fiat_transactions(payment_id);
CREATE INDEX idx_fiat_transactions_status ON fiat_transactions(status);