-- Drop tables in dependency order (children first)
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS recurring_charges;
DROP TABLE IF EXISTS investment_contributions;
DROP TABLE IF EXISTS investment_accounts;
DROP TABLE IF EXISTS savings_deposits;
DROP TABLE IF EXISTS savings_goals;
DROP TABLE IF EXISTS savings_accounts;
DROP TABLE IF EXISTS debt_payments;
DROP TABLE IF EXISTS debts;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS allocations;
DROP TABLE IF EXISTS spending_accounts;
DROP TABLE IF EXISTS paychecks;


-- Paychecks
CREATE TABLE paychecks (
  paycheck_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer TEXT,
  amount NUMERIC NOT NULL DEFAULT 0,
  is_recurring BOOLEAN DEFAULT FALSE
);

-- Spending Accounts (Checking, Savings, Credit Cards)
CREATE TABLE spending_accounts (
  account_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'checking', 'credit', etc.
  balance NUMERIC DEFAULT 0
);

-- Allocations
CREATE TABLE allocations (
  allocation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paycheck_id UUID REFERENCES paychecks(paycheck_id) ON DELETE CASCADE,
  account_id UUID REFERENCES spending_accounts(account_id) ON DELETE CASCADE,
  percentage NUMERIC DEFAULT 0,
  amount NUMERIC DEFAULT 0
);

-- Expenses
CREATE TABLE expenses (
  expense_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES spending_accounts(account_id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  category TEXT,
  note TEXT,
  date DATE NOT NULL DEFAULT NOW(),
  is_recurring BOOLEAN DEFAULT FALSE
);

-- Debts
CREATE TABLE debts (
  debt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  type TEXT,
  balance NUMERIC DEFAULT 0,
  payment_schedule DATE DEFAULT NOW()
);

-- Debt Payments
CREATE TABLE debt_payments (
  debt_payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debt_id UUID REFERENCES debts(debt_id) ON DELETE CASCADE,
  account_id UUID REFERENCES spending_accounts(account_id),
  amount NUMERIC NOT NULL DEFAULT 0,
  date DATE NOT NULL DEFAULT NOW()
);

-- Savings Accounts
CREATE TABLE savings_accounts (
  savings_account_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  type TEXT,
  balance NUMERIC DEFAULT 0
);

-- Savings Goals
CREATE TABLE savings_goals (
  goal_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  target_amount NUMERIC DEFAULT 0,
  current_amount NUMERIC DEFAULT 0
);

-- Savings Deposits
CREATE TABLE savings_deposits (
  deposit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  savings_account_id UUID REFERENCES savings_accounts(savings_account_id),
  account_id UUID REFERENCES spending_accounts(account_id),
  amount NUMERIC DEFAULT 0,
  date DATE DEFAULT NOW()
);

-- Investment Accounts
CREATE TABLE investment_accounts (
  investment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  type TEXT,
  balance NUMERIC DEFAULT 0
);

-- Investment Contributions
CREATE TABLE investment_contributions (
  deposit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investment_id UUID REFERENCES investment_accounts(investment_id),
  account_id UUID REFERENCES spending_accounts(account_id),
  note TEXT,
  amount NUMERIC DEFAULT 0,
  date DATE DEFAULT NOW()
);

-- Recurring Charges
CREATE TABLE recurring_charges (
  recurring_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT,
  amount NUMERIC DEFAULT 0,
  interval_label TEXT,
  interval_days INT DEFAULT 0,
  account_id UUID REFERENCES spending_accounts(account_id),
  start_date DATE DEFAULT NOW()
);

-- Unified Transactions Table (optional abstraction)
CREATE TABLE transactions (
  transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'income', 'expense', 'savings', 'debt_payment', 'investment'
  source_account_id UUID REFERENCES spending_accounts(account_id),
  target_id UUID, -- polymorphic FK to any other table
  amount NUMERIC DEFAULT 0,
  date DATE DEFAULT NOW(),
  category TEXT,
  notes TEXT
);
