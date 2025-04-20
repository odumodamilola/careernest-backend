import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  iconBgColor?: string;
  iconColor?: string;
}

export function StatusCard({
  title,
  value,
  icon,
  change,
  iconBgColor = "bg-primary-50",
  iconColor = "text-primary-600"
}: StatusCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${iconBgColor}`}>
            <div className={iconColor}>{icon}</div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className="text-sm font-medium text-muted-foreground truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold">
                {value}
              </div>
              
              {change && (
                <div 
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    change.isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {change.isPositive ? (
                    <ArrowUpIcon className="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="self-center flex-shrink-0 h-5 w-5 text-red-500" />
                  )}
                  <span className="sr-only">
                    {change.isPositive ? "Increased by" : "Decreased by"}
                  </span>
                  {change.value}%
                </div>
              )}
            </dd>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
