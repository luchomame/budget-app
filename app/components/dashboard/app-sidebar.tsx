"use client";

import * as React from "react";
import {
  IconCamera,
  IconCreditCardPay,
  IconBuildingBank,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconChartLine,
  IconHelp,
  IconInnerShadowTop,
  IconReceiptDollar,
  IconReport,
  IconSearch,
  IconSettings,
  IconPigMoney,
  IconHome,
  IconHours24,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/dashboard/nav-documents";
import { NavMain } from "@/components/dashboard/nav-main";
import { NavSecondary } from "@/components/dashboard/nav-secondary";
import { NavUser } from "@/components/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useFlags } from "launchdarkly-react-client-sdk";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: IconHome,
    },
    {
      title: "Accounts",
      url: "/accounts",
      icon: IconBuildingBank,
    },
    {
      title: "Debts",
      url: "/debts",
      icon: IconCreditCardPay,
    },
    {
      title: "Investments",
      url: "/investments",
      icon: IconChartLine,
    },
    {
      title: "Paychecks",
      url: "/paychecks",
      icon: IconReceiptDollar,
    },
    {
      title: "Recurring",
      url: "/recurring",
      icon: IconHours24,
    },
    {
      title: "Savings",
      url: "/savings",
      icon: IconPigMoney,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [navMain, setNavMain] = React.useState(data.navMain);
  const {
    enableAccountsRoute,
    enableDebtRoute,
    enableExpensesRoute,
    enableInvestmentsRoute,
    enablePaychecksRoute,
    enableRecurringRoute,
    enableSavingsRoute,
  } = useFlags();

  const applyFlags = () => {
    // make a new data.navmain array based on the flags
    const navMain = data.navMain.filter((item) => {
      if (item.title === "Accounts" && !enableAccountsRoute) return false;
      if (item.title === "Debts" && !enableDebtRoute) return false;
      if (item.title === "Expenses" && !enableExpensesRoute) return false;
      if (item.title === "Investments" && !enableInvestmentsRoute) return false;
      if (item.title === "Paychecks" && !enablePaychecksRoute) return false;
      if (item.title === "Recurring" && !enableRecurringRoute) return false;
      if (item.title === "Savings" && !enableSavingsRoute) return false;
      return true;
    });
    setNavMain(navMain);
  };

  React.useEffect(() => {
    applyFlags();
  }, [enableAccountsRoute]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
