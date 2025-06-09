import { SiteHeader } from "~/components/dashboard/site-header";
import { SectionCard } from "~/components/SectionCard";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";

export default function Page() {
  // "*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"
  return (
    <>
      <SiteHeader header="Paychecks" />
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {/* Add Paycheck Section */}
        <SectionCard
          title="Add Paycheck"
          description="Enter paycheck info and add it to your records"
          action={<Button variant="default">Submit</Button>}
        >
          <form className="flex flex-col gap-4">
            <Input placeholder="Employer" />
            <Input type="number" placeholder="Amount" />
            <div className="flex items-center gap-2">
              <Checkbox id="is_recurring" />
              <label htmlFor="is_recurring" className="text-sm">
                Recurring
              </label>
            </div>
            <Button variant="default">Submit</Button>
          </form>
        </SectionCard>

        {/* Recurring Paychecks Table */}
        <SectionCard
          title="Recurring Paychecks"
          description="Paychecks set to repeat automatically"
        >
          <div className="text-sm text-muted-foreground">
            {/* Placeholder content */}
            No recurring paychecks yet.
          </div>
        </SectionCard>

        {/* One-Time Paychecks Table */}
        <SectionCard
          title="One-Time Paychecks"
          description="Single-instance paychecks"
        >
          <div className="text-sm text-muted-foreground">
            {/* Placeholder content */}
            No one-time paychecks recorded.
          </div>
        </SectionCard>
      </div>
    </>
  );
}
