-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "paychecks" (
	"paycheck_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employer" text,
	"amount" numeric DEFAULT '0' NOT NULL,
	"is_recurring" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "allocations" (
	"allocation_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"paycheck_id" uuid,
	"account_id" uuid,
	"percentage" numeric DEFAULT '0',
	"amount" numeric DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "spending_accounts" (
	"account_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"balance" numeric DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"expense_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid,
	"amount" numeric DEFAULT '0' NOT NULL,
	"category" text,
	"note" text,
	"date" date DEFAULT now() NOT NULL,
	"is_recurring" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "debts" (
	"debt_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"type" text,
	"balance" numeric DEFAULT '0',
	"payment_schedule" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "debt_payments" (
	"debt_payment_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"debt_id" uuid,
	"account_id" uuid,
	"amount" numeric DEFAULT '0' NOT NULL,
	"date" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "savings_goals" (
	"goal_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"target_amount" numeric DEFAULT '0',
	"current_amount" numeric DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "savings_accounts" (
	"savings_account_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"type" text,
	"balance" numeric DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "savings_deposits" (
	"deposit_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"savings_account_id" uuid,
	"account_id" uuid,
	"amount" numeric DEFAULT '0',
	"date" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "investment_accounts" (
	"investment_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"type" text,
	"balance" numeric DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "investment_contributions" (
	"deposit_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"investment_id" uuid,
	"account_id" uuid,
	"note" text,
	"amount" numeric DEFAULT '0',
	"date" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recurring_charges" (
	"recurring_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"description" text,
	"amount" numeric DEFAULT '0',
	"interval_label" text,
	"interval_days" integer DEFAULT 0,
	"account_id" uuid,
	"start_date" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"transaction_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"source_account_id" uuid,
	"target_id" uuid,
	"amount" numeric DEFAULT '0',
	"date" date DEFAULT now(),
	"category" text,
	"notes" text
);
--> statement-breakpoint
ALTER TABLE "allocations" ADD CONSTRAINT "allocations_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."spending_accounts"("account_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "allocations" ADD CONSTRAINT "allocations_paycheck_id_fkey" FOREIGN KEY ("paycheck_id") REFERENCES "public"."paychecks"("paycheck_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."spending_accounts"("account_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "debt_payments" ADD CONSTRAINT "debt_payments_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."spending_accounts"("account_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "debt_payments" ADD CONSTRAINT "debt_payments_debt_id_fkey" FOREIGN KEY ("debt_id") REFERENCES "public"."debts"("debt_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savings_deposits" ADD CONSTRAINT "savings_deposits_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."spending_accounts"("account_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savings_deposits" ADD CONSTRAINT "savings_deposits_savings_account_id_fkey" FOREIGN KEY ("savings_account_id") REFERENCES "public"."savings_accounts"("savings_account_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investment_contributions" ADD CONSTRAINT "investment_contributions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."spending_accounts"("account_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investment_contributions" ADD CONSTRAINT "investment_contributions_investment_id_fkey" FOREIGN KEY ("investment_id") REFERENCES "public"."investment_accounts"("investment_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_charges" ADD CONSTRAINT "recurring_charges_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."spending_accounts"("account_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_source_account_id_fkey" FOREIGN KEY ("source_account_id") REFERENCES "public"."spending_accounts"("account_id") ON DELETE no action ON UPDATE no action;
*/