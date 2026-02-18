import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./button";
import { ReactNode } from "react";

interface GradientButtonProps extends Omit<ButtonProps, "variant"> {
  children: ReactNode;
  variant?: "multicolor" | "accent-1" | "accent-2" | "accent-3" | "accent-4" | "accent-5" | "accent-6";
}

/**
 * 多色グラデーションボタンコンポーネント
 */
export const GradientButton = ({ 
  children, 
  className,
  variant = "multicolor",
  ...props 
}: GradientButtonProps) => {
  const gradientMap = {
    "multicolor": "linear-gradient(135deg, hsl(var(--accent-1)), hsl(var(--accent-2)), hsl(var(--accent-3)), hsl(var(--accent-4)), hsl(var(--accent-5)), hsl(var(--accent-6)))",
    "accent-1": "linear-gradient(135deg, hsl(var(--accent-1)), hsl(var(--accent-1-gradient)))",
    "accent-2": "linear-gradient(135deg, hsl(var(--accent-2)), hsl(var(--accent-2-gradient)))",
    "accent-3": "linear-gradient(135deg, hsl(var(--accent-3)), hsl(var(--accent-3-gradient)))",
    "accent-4": "linear-gradient(135deg, hsl(var(--accent-4)), hsl(var(--accent-4-gradient)))",
    "accent-5": "linear-gradient(135deg, hsl(var(--accent-5)), hsl(var(--accent-5-gradient)))",
    "accent-6": "linear-gradient(135deg, hsl(var(--accent-6)), hsl(var(--accent-6-gradient)))",
  };

  return (
    <Button
      {...props}
      className={cn(
        "relative overflow-hidden text-white font-medium transition-all duration-300",
        "hover:scale-105 hover:shadow-lg",
        variant === "multicolor" && "bg-gradient-to-r from-accent1 via-accent2 via-accent3 via-accent4 via-accent5 to-accent6",
        className
      )}
      style={{
        background: variant === "multicolor" 
          ? gradientMap.multicolor 
          : gradientMap[variant],
        backgroundSize: variant === "multicolor" ? "200% 200%" : "100% 100%",
        ...(variant === "multicolor" && {
          animation: "gradient-shift 3s ease infinite",
        }),
      }}
    >
      {children}
    </Button>
  );
};
