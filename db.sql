-- Paychecks
CREATE TABLE paychecks (
  paycheck_id UUID PRIMARY KEY,
  employer TEXT,
  amount NUMERIC NOT NULL,
  is_recurring BOOLEAN DEFAULT FALSE
);

-- Spending Accounts (Checking, Savings, Credit Cards)
CREATE TABLE spending_accounts (
  account_id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'checking', 'credit', etc.
  balance NUMERIC DEFAULT 0
);

-- Allocations
CREATE TABLE allocations (
  allocation_id UUID PRIMARY KEY,
  paycheck_id UUID REFERENCES paychecks(paycheck_id) ON DELETE CASCADE,
  account_id UUID REFERENCES spending_accounts(account_id) ON DELETE CASCADE,
  percentage NUMERIC,
  amount NUMERIC
);

-- Expenses
CREATE TABLE expenses (
  expense_id UUID PRIMARY KEY,
  account_id UUID REFERENCES spending_accounts(account_id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  category TEXT,
  note TEXT,
  date DATE NOT NULL,
  is_recurring BOOLEAN DEFAULT FALSE
);

-- Debts
CREATE TABLE debts (
  debt_id UUID PRIMARY KEY,
  name TEXT,
  type TEXT,
  balance NUMERIC,
  payment_schedule DATE
);

-- Debt Payments
CREATE TABLE debt_payments (
  debt_payment_id UUID PRIMARY KEY,
  debt_id UUID REFERENCES debts(debt_id) ON DELETE CASCADE,
  account_id UUID REFERENCES spending_accounts(account_id),
  amount NUMERIC NOT NULL,
  date DATE NOT NULL
);

-- Savings Accounts
CREATE TABLE savings_accounts (
  savings_account_id UUID PRIMARY KEY,
  name TEXT,
  type TEXT,
  balance NUMERIC DEFAULT 0
);

-- Savings Goals
CREATE TABLE savings_goals (
  goal_id UUID PRIMARY KEY,
  name TEXT,
  target_amount NUMERIC,
  current_amount NUMERIC DEFAULT 0
);

-- Savings Deposits
CREATE TABLE savings_deposits (
  deposit_id UUID PRIMARY KEY,
  savings_account_id UUID REFERENCES savings_accounts(savings_account_id),
  account_id UUID REFERENCES spending_accounts(account_id),
  amount NUMERIC,
  date DATE
);

-- Investment Accounts
CREATE TABLE investment_accounts (
  investment_id UUID PRIMARY KEY,
  name TEXT,
  type TEXT,
  balance NUMERIC DEFAULT 0
);

-- Investment Contributions
CREATE TABLE investment_contributions (
  deposit_id UUID PRIMARY KEY,
  investment_id UUID REFERENCES investment_accounts(investment_id),
  account_id UUID REFERENCES spending_accounts(account_id),
  note TEXT,
  amount NUMERIC,
  date DATE
);

-- Recurring Charges
CREATE TABLE recurring_charges (
  recurring_id UUID PRIMARY KEY,
  description TEXT,
  amount NUMERIC,
  interval_label TEXT,
  interval_days INT,
  account_id UUID REFERENCES spending_accounts(account_id),
  start_date DATE
);

-- Unified Transactions Table (optional abstraction)
CREATE TABLE transactions (
  transaction_id UUID PRIMARY KEY,
  type TEXT NOT NULL, -- 'income', 'expense', 'savings', 'debt_payment', 'investment'
  source_account_id UUID REFERENCES spending_accounts(account_id),
  target_id UUID, -- polymorphic FK to any other table
  amount NUMERIC,
  date DATE,
  category TEXT,
  notes TEXT
);
