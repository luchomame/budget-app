import { relations } from "drizzle-orm/relations";
import { spendingAccounts, allocations, paychecks, expenses, debtPayments, debts, savingsDeposits, savingsAccounts, investmentContributions, investmentAccounts, recurringCharges, transactions } from "./schema";

export const allocationsRelations = relations(allocations, ({one}) => ({
	spendingAccount: one(spendingAccounts, {
		fields: [allocations.accountId],
		references: [spendingAccounts.accountId]
	}),
	paycheck: one(paychecks, {
		fields: [allocations.paycheckId],
		references: [paychecks.paycheckId]
	}),
}));

export const spendingAccountsRelations = relations(spendingAccounts, ({many}) => ({
	allocations: many(allocations),
	expenses: many(expenses),
	debtPayments: many(debtPayments),
	savingsDeposits: many(savingsDeposits),
	investmentContributions: many(investmentContributions),
	recurringCharges: many(recurringCharges),
	transactions: many(transactions),
}));

export const paychecksRelations = relations(paychecks, ({many}) => ({
	allocations: many(allocations),
}));

export const expensesRelations = relations(expenses, ({one}) => ({
	spendingAccount: one(spendingAccounts, {
		fields: [expenses.accountId],
		references: [spendingAccounts.accountId]
	}),
}));

export const debtPaymentsRelations = relations(debtPayments, ({one}) => ({
	spendingAccount: one(spendingAccounts, {
		fields: [debtPayments.accountId],
		references: [spendingAccounts.accountId]
	}),
	debt: one(debts, {
		fields: [debtPayments.debtId],
		references: [debts.debtId]
	}),
}));

export const debtsRelations = relations(debts, ({many}) => ({
	debtPayments: many(debtPayments),
}));

export const savingsDepositsRelations = relations(savingsDeposits, ({one}) => ({
	spendingAccount: one(spendingAccounts, {
		fields: [savingsDeposits.accountId],
		references: [spendingAccounts.accountId]
	}),
	savingsAccount: one(savingsAccounts, {
		fields: [savingsDeposits.savingsAccountId],
		references: [savingsAccounts.savingsAccountId]
	}),
}));

export const savingsAccountsRelations = relations(savingsAccounts, ({many}) => ({
	savingsDeposits: many(savingsDeposits),
}));

export const investmentContributionsRelations = relations(investmentContributions, ({one}) => ({
	spendingAccount: one(spendingAccounts, {
		fields: [investmentContributions.accountId],
		references: [spendingAccounts.accountId]
	}),
	investmentAccount: one(investmentAccounts, {
		fields: [investmentContributions.investmentId],
		references: [investmentAccounts.investmentId]
	}),
}));

export const investmentAccountsRelations = relations(investmentAccounts, ({many}) => ({
	investmentContributions: many(investmentContributions),
}));

export const recurringChargesRelations = relations(recurringCharges, ({one}) => ({
	spendingAccount: one(spendingAccounts, {
		fields: [recurringCharges.accountId],
		references: [spendingAccounts.accountId]
	}),
}));

export const transactionsRelations = relations(transactions, ({one}) => ({
	spendingAccount: one(spendingAccounts, {
		fields: [transactions.sourceAccountId],
		references: [spendingAccounts.accountId]
	}),
}));