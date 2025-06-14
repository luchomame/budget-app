import { Separator } from "~/components/ui/separator";
import { Pencil, CalendarIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import type { Paycheck } from "../helper";
import type { FetcherWithComponents } from "react-router";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

type props = {
  fetcher: FetcherWithComponents<any>;
  editSheetOpen: boolean;
  setEditSheetOpen: (open: boolean) => void;
  selectedPaycheck: Paycheck | null;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
};

export default function EditSheet({
  fetcher,
  editSheetOpen,
  setEditSheetOpen,
  selectedPaycheck,
  isEditing,
  setIsEditing,
}: props) {
  const [frequency, setFrequency] = useState(selectedPaycheck?.frequency ?? "");
  const [isRecurring, setIsRecurring] = useState<boolean>(
    selectedPaycheck?.isRecurring ?? false
  );
  const [depositDate, setDepositDate] = useState<string>(
    selectedPaycheck?.depositDate ?? ""
  );
  const [employer, setEmployer] = useState(selectedPaycheck?.employer ?? "");
  const [amount, setAmount] = useState(
    Number(selectedPaycheck?.amount ?? 0).toFixed(2)
  );

  const isDirty =
    employer.trimEnd() !== (selectedPaycheck?.employer?.trimEnd() ?? "") ||
    // checking amount in on change()
    Number(amount).toFixed(2) !==
      Number(selectedPaycheck?.amount ?? 0).toFixed(2) ||
    isRecurring !== (selectedPaycheck?.isRecurring ?? false) ||
    frequency !== (selectedPaycheck?.frequency ?? "") ||
    depositDate !== (selectedPaycheck?.depositDate ?? "");

  // reset vals after new paycheck is selected. wanna keep useStates clean and in sync with selectedPaycheck
  const resetValues = () => {
    if (selectedPaycheck) {
      setIsRecurring(selectedPaycheck.isRecurring ?? false);
      setFrequency(selectedPaycheck.frequency ?? "");
      setDepositDate(selectedPaycheck.depositDate ?? "");
      setEmployer(selectedPaycheck.employer ?? "");
      setAmount(Number(selectedPaycheck.amount ?? 0).toFixed(2));
    }
  };

  useEffect(() => {
    resetValues();
  }, [selectedPaycheck, isEditing]);

  return (
    <Sheet
      open={editSheetOpen}
      onOpenChange={() => {
        setEditSheetOpen(!editSheetOpen);
        setIsEditing(false);
      }}
    >
      <SheetContent side="right" className="p-6">
        <SheetHeader className="flex flex-col items-center justify-between text-left">
          <SheetTitle className="text-xl font-semibold">
            Paycheck Details
          </SheetTitle>
          <Separator className="mb-4" />

          <SheetDescription>View and edit paycheck details</SheetDescription>
        </SheetHeader>

        <fetcher.Form method="post">
          <Input
            type="hidden"
            name="paycheckId"
            value={selectedPaycheck?.paycheckId}
          />

          <div className="space-y-4 text-sm">
            <div>
              <div className="text-muted-foreground text-sm mb-1">Employer</div>
              {!isEditing ? (
                <div className="text-base">{selectedPaycheck?.employer}</div>
              ) : (
                <Input
                  name="employer"
                  value={employer}
                  onChange={(e) => setEmployer(e.target.value)}
                />
              )}
            </div>

            <div>
              <div className="text-muted-foreground text-sm mb-1">Amount</div>
              {!isEditing ? (
                <div className="tabular-nums text-base">${amount}</div>
              ) : (
                <Input
                  name="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              )}
            </div>

            <div>
              <div className="text-muted-foreground text-sm mb-1">Type</div>

              {!isEditing ? (
                <div>
                  <div className="text-base">
                    {selectedPaycheck?.isRecurring ? "Recurring" : "One-Time"}
                  </div>
                </div>
              ) : (
                <span className="flex items-center gap-2 py-2 ">
                  <Checkbox
                    id="is_recurring"
                    checked={isRecurring}
                    onCheckedChange={(checked) =>
                      setIsRecurring(checked === true)
                    }
                  />
                  {/* do full width to make selecting more forgiving */}
                  <Label htmlFor="is_recurring" className="text-md w-full">
                    Is Recurring
                  </Label>
                  <Input
                    type="hidden"
                    name="is_recurring"
                    value={isRecurring ? "true" : "false"}
                  />
                </span>
              )}
            </div>

            {isRecurring && (
              <div>
                <div className="text-muted-foreground text-sm mb-1">
                  Frequency
                </div>
                {!isEditing ? (
                  <div className="text-base">{selectedPaycheck?.frequency}</div>
                ) : (
                  <>
                    <Select
                      value={frequency}
                      onValueChange={(val) => {
                        setFrequency(val);
                      }}
                    >
                      <SelectTrigger id="frequency" className="text-md">
                        <span>
                          {frequency
                            ? frequency.charAt(0).toUpperCase() +
                              frequency.slice(1)
                            : "Select frequency"}
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Biweekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="semimonthly">Semimonthly</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input type="hidden" name="frequency" value={frequency} />
                  </>
                )}
              </div>
            )}

            <div>
              <div className="text-muted-foreground text-sm mb-1">
                Deposit Date
              </div>
              {!isEditing ? (
                <div className="text-base">{selectedPaycheck?.depositDate}</div>
              ) : (
                // TODO: this date picker works but the area where the calendar pops up is tiny. requires you to put in date rn.
                // find more mobile friendly solution
                <span className="relative w-3/4">
                  <Input
                    type="date"
                    id="deposit_date"
                    name="deposit_date"
                    value={depositDate}
                    onChange={(e) => setDepositDate(e.target.value)}
                    className="w-3/4"
                  />
                </span>
              )}
            </div>
          </div>
          {isEditing && (
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              {/* <Button type="submit">Save</Button> */}
              <Button type="submit" disabled={!isDirty}>
                Save
              </Button>
            </div>
          )}
        </fetcher.Form>

        <Button
          variant="outline"
          size="fab"
          className="fixed bottom-6 right-6 rounded-full shadow-md bg-primary text-primary-foreground"
          onClick={() => {
            setIsEditing(true);
          }}
          hidden={isEditing}
        >
          <Pencil style={{ width: "20px", height: "20px" }} />
        </Button>
      </SheetContent>
    </Sheet>
  );
}
