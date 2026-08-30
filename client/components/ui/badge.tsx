import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full text-xs font-medium px-2.5 py-0.5 border transition-colors select-none",
  {
    variants: {
      variant: {
        default: "bg-neutral-900 text-white border-neutral-900",
        secondary: "bg-neutral-100 text-neutral-800 border-neutral-200/70",
        success: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        warning: "bg-amber-50 text-amber-700 border-amber-200/80",
        destructive: "bg-rose-50 text-rose-700 border-rose-200/80",
        outline: "bg-transparent text-neutral-700 border-neutral-200",
      },
    },
    defaultVariants: {
      variant: "secondary",
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
