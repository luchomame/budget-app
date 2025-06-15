import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { Label } from "~/components/ui/label";
import FAB from "~/components/FAB";

type props = {
  filterSheetOpen: boolean;
  setFilterSheetOpen: (open: boolean) => void;
  type: "all" | "recurring" | "one-time";
  range: string;
  updateFilter: (type: "all" | "recurring" | "one-time", range: string) => void;
};

export default function FilterSheet({
  filterSheetOpen,
  setFilterSheetOpen,
  type,
  range,
  updateFilter,
}: props) {
  return (
    <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
      <SheetTrigger asChild>
        <FAB
          onClick={() => setFilterSheetOpen(true)}
          Icon={SlidersHorizontal}
        />
      </SheetTrigger>

      <SheetContent side="bottom" className="p-6 max-w-md mx-auto">
        <SheetHeader className="flex flex-col items-center justify-between text-left">
          <SheetTitle className="text-xl font-semibold">
            Filter Paychecks
          </SheetTitle>
          <Separator className="" />

          <SheetDescription className="sr-only">
            Filter paychecks by type and range
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Type</Label>
            <div className="flex gap-2">
              <Button
                variant={type === "all" ? "default" : "outline"}
                onClick={() => updateFilter("all", range)}
              >
                All
              </Button>
              <Button
                variant={type === "recurring" ? "default" : "outline"}
                onClick={() => updateFilter("recurring", range)}
              >
                Recurring
              </Button>
              <Button
                variant={type === "one-time" ? "default" : "outline"}
                onClick={() => updateFilter("one-time", range)}
              >
                One-Time
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Range</Label>
            <div className="flex flex-wrap gap-2">
              {["30d", "60d", "6m", "1y", "2y"].map((r) => (
                <Button
                  key={r}
                  variant={range === r ? "default" : "outline"}
                  onClick={() => updateFilter(type, r)}
                >
                  {r}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
