import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-muted text-muted-foreground",
        info: "bg-[#F0EDFE] text-primary border border-primary/20",
        success: "bg-[#defbe6] text-[#24a148] border border-[#24a148]/20",
        warning: "bg-[#fef9e0] text-[#946500] border border-[#f1c21b]/40",
        destructive: "bg-[#fff1f1] text-destructive border border-destructive/20",
        outline: "text-foreground border border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
