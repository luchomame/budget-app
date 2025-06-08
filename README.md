# 💸 Budget Tracker App: Vision & Planning

## 🎯 Purpose

This project is a personal budgeting app designed to replace a complex spreadsheet workflow. The goal is to create a more **visual**, **interactive**, and **forecast-driven** experience for tracking income, expenses, debts, savings, and investments. It should feel intuitive, look beautiful, and allow deeper insights into monthly cash flow and net worth.

## 🧠 Problem Statement

* Spreadsheets work but lack visual and interactive appeal.
* Manual processes make it harder to forecast or analyze.
* Tracking paycheck allocation, expenses, debt payoff, and savings across multiple accounts is tedious.

> This app will simplify those tasks with reusable inputs, interactive charts, and end-of-month projections.

## ✅ Core Features (MVP)

* Add paychecks and allocate percentages to USAA, Chase, and other accounts
* Track recurring and manual expenses with optional notes
* Support expense splitting across multiple accounts or categories
* Divide expenses by monthly vs per-check distribution
* Track and visualize credit card debts and payoff timelines
* Add savings and investment goals with custom categories
* Visualize money in vs money out with circular progress indicators
* Track fun money spending separately
* Project end-of-month balances by account and category

## 🎁 Nice-to-Haves (Future Versions)

* Month-over-month spending analysis
* Auto-import transactions via Plaid or other APIs
* Auto-sync account balances
* Expense categorization with tags or emojis
* Calendar view of paychecks and recurring bills
* Demo mode with fake data
* Export charts/images
* ML-based insights: trend detection, payoff projection, burn rate

## 🖥️ Screens / Views

* **Dashboard:** Summary, net balance, savings graphs, expenses snapshot
* **Paycheck Form:** Log amount, date, and split allocation
* **Expenses Tracker:** View by account or date; add/edit/delete entries
* **Savings Manager:** View goals and progress; add deposits
* **Investment Tracker:** Similar to savings view, but with types like Roth IRA, stocks, CDs
* **Debt Manager:** Log CC balances, payments, and project payoffs
* **Recurring Charges:** View and manage subscriptions, bills, and autopay items
* **Accounts Manager:** Manual setup for checking, savings, credit cards, etc.

## 🗃️ Data Model (Initial Buckets)

* **Accounts**: `id`, `name`, `type`, `balance`
* **Paychecks**: `id`, `amount`, `date`, `is_recurring`
* **Allocations**: `paycheck_id`, `account_id`, `percentage`, `amount`
* **Expenses**: `id`, `account_id`, `amount`, `category`, `note`, `date`, `is_recurring`
* **Debts**: `id`, `name`, `type`, `balance`, `payment_schedule`
* **DebtPayments**: `debt_id`, `amount`, `date`, `source_account`
* **SavingsGoals**: `id`, `name`, `target_amount`, `current_amount`
* **SavingsDeposits**: `goal_id`, `account_id`, `amount`, `date`
* **Investments**: `id`, `name`, `type`, `amount`, `date`
* **RecurringCharges**: `id`, `description`, `amount`, `interval`, `account_id`, `start_date`
* **Transactions** (optional unifying table): `id`, `type`, `source_account_id`, `target_id`, `amount`, `date`, `category`, `notes`

## 🔗 System Logic

```
Paycheck → Available Money
Expense → - Available Money
Savings → - Available Money → + Net Worth
CC Payment → - Available Money → - Debt → + Net Worth
Fun Money → - Available Money (tagged as discretionary)
Investments → - Available Money → + Net Worth
```

## 🏗️ MVP Checklist

* [ ] Visual dashboard (in/out + net worth)
* [ ] Paycheck entry & split logic
* [ ] Expense tracker by account/date
* [ ] Recurring expenses and debt
* [ ] Savings + investment tracking
* [ ] Manual accounts setup
* [ ] End-of-month projection logic

## 🧰 Tech Stack

* **Frontend**: Remix + ShadCN/UI (mobile-first, beautiful forms)
* **Backend**: Supabase (PostgreSQL, Auth, Row-Level Security)
* **Hosting**: Render or Fly.io (for experimentation)
* **PWA Support**: `@remix-pwa` plugin with manifest + service worker
* **Mobile Option (later)**: React Native + Supabase (via Expo + `expo-router`)

## 🎨 Design Priorities

* Start with logic and routing
* Use ShadCN templates and refine spacing/colors/iconography
* Avoid spreadsheet-like visuals — embrace progress indicators, summaries, and visual hierarchy

## ✨ Why This Is Exciting

* Custom-fit to your budgeting style
* Visually satisfying — a step above spreadsheets
* Real-world portfolio piece (can open source or showcase)
* Great base for data viz and ML experimentation

## 📌 Next Steps

1. Define Supabase schema
2. Set up routes in Remix
3. Build paycheck entry + allocation first
4. Layer in dashboard after paycheck + expenses logic

Let’s go.
