import { pgTable, foreignKey, uuid, numeric, text, boolean, timestamp, date, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const allocations = pgTable("allocations", {
	allocationId: uuid("allocation_id").defaultRandom().primaryKey().notNull(),
	paycheckId: uuid("paycheck_id"),
	accountId: uuid("account_id"),
	percentage: numeric().default('0'),
	amount: numeric().default('0'),
}, (table) => [
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [spendingAccounts.accountId],
			name: "allocations_account_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.paycheckId],
			foreignColumns: [paychecks.paycheckId],
			name: "allocations_paycheck_id_fkey"
		}).onDelete("cascade"),
]);

export const spendingAccounts = pgTable("spending_accounts", {
	accountId: uuid("account_id").defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	type: text().notNull(),
	balance: numeric().default('0'),
});

export const paychecks = pgTable("paychecks", {
	paycheckId: uuid("paycheck_id").defaultRandom().primaryKey().notNull(),
	employer: text(),
	amount: numeric().default('0').notNull(),
	isRecurring: boolean("is_recurring").default(false),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	depositDate: date("deposit_date"),
	frequency: text(),
	expectedDay: text("expected_day"),
});

export const expenses = pgTable("expenses", {
	expenseId: uuid("expense_id").defaultRandom().primaryKey().notNull(),
	accountId: uuid("account_id"),
	amount: numeric().default('0').notNull(),
	category: text(),
	note: text(),
	date: date().defaultNow().notNull(),
	isRecurring: boolean("is_recurring").default(false),
}, (table) => [
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [spendingAccounts.accountId],
			name: "expenses_account_id_fkey"
		}).onDelete("set null"),
]);

export const debts = pgTable("debts", {
	debtId: uuid("debt_id").defaultRandom().primaryKey().notNull(),
	name: text(),
	type: text(),
	balance: numeric().default('0'),
	paymentSchedule: date("payment_schedule").defaultNow(),
});

export const debtPayments = pgTable("debt_payments", {
	debtPaymentId: uuid("debt_payment_id").defaultRandom().primaryKey().notNull(),
	debtId: uuid("debt_id"),
	accountId: uuid("account_id"),
	amount: numeric().default('0').notNull(),
	date: date().defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [spendingAccounts.accountId],
			name: "debt_payments_account_id_fkey"
		}),
	foreignKey({
			columns: [table.debtId],
			foreignColumns: [debts.debtId],
			name: "debt_payments_debt_id_fkey"
		}).onDelete("cascade"),
]);

export const savingsGoals = pgTable("savings_goals", {
	goalId: uuid("goal_id").defaultRandom().primaryKey().notNull(),
	name: text(),
	targetAmount: numeric("target_amount").default('0'),
	currentAmount: numeric("current_amount").default('0'),
});

export const savingsAccounts = pgTable("savings_accounts", {
	savingsAccountId: uuid("savings_account_id").defaultRandom().primaryKey().notNull(),
	name: text(),
	type: text(),
	balance: numeric().default('0'),
});

export const savingsDeposits = pgTable("savings_deposits", {
	depositId: uuid("deposit_id").defaultRandom().primaryKey().notNull(),
	savingsAccountId: uuid("savings_account_id"),
	accountId: uuid("account_id"),
	amount: numeric().default('0'),
	date: date().defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [spendingAccounts.accountId],
			name: "savings_deposits_account_id_fkey"
		}),
	foreignKey({
			columns: [table.savingsAccountId],
			foreignColumns: [savingsAccounts.savingsAccountId],
			name: "savings_deposits_savings_account_id_fkey"
		}),
]);

export const investmentAccounts = pgTable("investment_accounts", {
	investmentId: uuid("investment_id").defaultRandom().primaryKey().notNull(),
	name: text(),
	type: text(),
	balance: numeric().default('0'),
});

export const investmentContributions = pgTable("investment_contributions", {
	depositId: uuid("deposit_id").defaultRandom().primaryKey().notNull(),
	investmentId: uuid("investment_id"),
	accountId: uuid("account_id"),
	note: text(),
	amount: numeric().default('0'),
	date: date().defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [spendingAccounts.accountId],
			name: "investment_contributions_account_id_fkey"
		}),
	foreignKey({
			columns: [table.investmentId],
			foreignColumns: [investmentAccounts.investmentId],
			name: "investment_contributions_investment_id_fkey"
		}),
]);

export const recurringCharges = pgTable("recurring_charges", {
	recurringId: uuid("recurring_id").defaultRandom().primaryKey().notNull(),
	description: text(),
	amount: numeric().default('0'),
	intervalLabel: text("interval_label"),
	intervalDays: integer("interval_days").default(0),
	accountId: uuid("account_id"),
	startDate: date("start_date").defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [spendingAccounts.accountId],
			name: "recurring_charges_account_id_fkey"
		}),
]);

export const transactions = pgTable("transactions", {
	transactionId: uuid("transaction_id").defaultRandom().primaryKey().notNull(),
	type: text().notNull(),
	sourceAccountId: uuid("source_account_id"),
	targetId: uuid("target_id"),
	amount: numeric().default('0'),
	date: date().defaultNow(),
	category: text(),
	notes: text(),
}, (table) => [
	foreignKey({
			columns: [table.sourceAccountId],
			foreignColumns: [spendingAccounts.accountId],
			name: "transactions_source_account_id_fkey"
		}),
]);
