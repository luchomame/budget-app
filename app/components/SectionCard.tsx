import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
  CardFooter,
} from "@/components/ui/card";

type SectionCardProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export function SectionCard({
  title,
  description,
  action,
  children,
  footer,
}: SectionCardProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        {title && (
          <CardTitle className="text-2xl font-semibold @[250px]/card:text-3xl">
            {title}
          </CardTitle>
        )}
        {description && <CardDescription>{description}</CardDescription>}
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && (
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}
