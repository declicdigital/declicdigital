import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const tornPaperClip = "polygon(2% 8%, 5% 2%, 9% 6%, 14% 1%, 19% 5%, 24% 0%, 30% 4%, 35% 1%, 40% 6%, 46% 2%, 52% 5%, 57% 0%, 63% 4%, 68% 1%, 74% 6%, 79% 2%, 85% 5%, 90% 1%, 95% 7%, 98% 3%, 100% 10%, 99% 18%, 100% 28%, 98% 38%, 100% 48%, 99% 58%, 100% 68%, 98% 78%, 100% 88%, 99% 95%, 96% 98%, 92% 94%, 87% 99%, 82% 95%, 76% 100%, 70% 96%, 64% 99%, 58% 95%, 52% 100%, 46% 96%, 40% 99%, 34% 95%, 28% 100%, 22% 96%, 16% 99%, 10% 95%, 5% 100%, 2% 96%, 0% 92%, 1% 82%, 0% 72%, 2% 62%, 0% 52%, 1% 42%, 0% 32%, 2% 22%, 0% 12%)";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
