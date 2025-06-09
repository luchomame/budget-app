import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
    layout("routes/layout.tsx", [
    index("routes/home/index.tsx"),
    route("drizzle", "routes/drizzle.tsx"),
    route("accounts", "routes/accounts/index.tsx"),
    route("debts", "routes/debts/index.tsx"),
    route("expenses", "routes/expenses/index.tsx"),
    route("investments", "routes/investments/index.tsx"),
    route("paychecks", "routes/paychecks/index.tsx"),
    route("recurring", "routes/recurring/index.tsx"),
    route("savings", "routes/savings/index.tsx"),
    ])
] satisfies RouteConfig;


