import { Button } from "./ui/button";
import { cn } from "~/lib/utils";

type Props = {
  onClick: () => void;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
} & React.ComponentPropsWithoutRef<typeof Button>;

export default function FAB({ onClick, Icon, className, ...props }: Props) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50 p-0 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center w-14 h-14 ",
        className
      )}
      variant="ghost"
      {...props}
    >
      <Icon className="!w-6 !h-6" />
    </Button>
  );
}
