# 🗺️ Roadmap: Budget Tracker App

This roadmap guides development of the Budget Tracker App from backend setup through full visual and functional polish.

---

## 🧱 Phase 1: Backend Setup

* [ ] Create Supabase project
* [ ] Create GitHub repo (public for portfolio, private if using real financial data)
* [ ] Define database schema and relationships

  * [ ] Use ERD or dbdiagram.io to plan tables
* [ ] Create initial tables: `accounts`, `paychecks`, `allocations`

---

## 🖼️ Phase 2: UI Setup

* [ ] Initialize Remix project (uses React Router v7 under the hood)
* [ ] Add Tailwind + shadcn/ui for UI components
* [ ] Establish DB connection with Supabase client
* [ ] Set up base routes:

  * [ ] `/` - Dashboard/Home
  * [ ] `/savings`
  * [ ] `/investments`
  * [ ] `/expenses`
  * [ ] `/debts`
  * [ ] `/projection`
  * [ ] `/net-worth`
* [ ] Implement layout wrapper with sidebar or top-nav

---

## 💸 Phase 3: Paycheck Functionality

* [ ] Allow user to log a paycheck (amount + date + recurring flag)
* [ ] Create account management form (add/edit/delete bank accounts)
* [ ] Allow splitting paycheck into specific account allocations (by amount or %)
* [ ] Calculate “remaining to allocate” if totals don’t match paycheck
* [ ] Save all entries to database

---

## 💳 Phase 4: Expense Functionality

* [ ] Create form to log new expenses (amount, category, account, note)
* [ ] Include per-check vs monthly toggle
* [ ] Allow splitting expenses between accounts
* [ ] Add checkbox to mark as recurring
* [ ] Filter expense list by account/date/month
* [ ] Save to database

---

## 💰 Phase 5: Savings & Investments

* [ ] Create UI to define savings goals (name, target amount)
* [ ] Add deposits to goals (per check, monthly)
* [ ] Show goal progress visually
* [ ] Add investments UI (CDs, Roth IRA, etc.)
* [ ] Support per-check and monthly investment plans
* [ ] Save to database

---

## 📅 Phase 6: End-of-Month Projection

* [ ] Link paycheck → expenses → savings → debt flows (see README system logic)
* [ ] Create projection based on:

  * [ ] Paycheck schedule
  * [ ] Recurring expenses
  * [ ] Planned savings + investments
  * [ ] Debt autopayments
* [ ] Display expected available balance at end of month
* [ ] Highlight budget overruns or shortfalls

---

## 📊 Phase 7: Visualizations

* [ ] Create circular progress graphs:

  * [ ] Income vs Expenses
  * [ ] Goal progress per savings category
* [ ] Add net worth line chart (time series)
* [ ] Add breakdown by category with pie/bar charts
* [ ] Add chart toggle/filter options

---

## 🎨 Phase 8: UI/UX Polish

* [ ] Refine spacing, font sizes, and layout responsiveness
* [ ] Add icons for categories and navigation
* [ ] Add subtle animations or transitions
* [ ] Finalize mobile view and test install as PWA

---

✅ Final milestone: A beautiful, functional budget app that replaces spreadsheets, supports forecasting, and looks great on web and mobile.
