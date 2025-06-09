import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
    layout("routes/layout.tsx", [
    index("routes/home/index.tsx"),
    route("drizzle", "routes/drizzle.tsx")
    ])
] satisfies RouteConfig;


