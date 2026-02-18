import { cn } from "@/lib/utils";

interface GradientDividerProps {
  className?: string;
  thickness?: "thin" | "medium" | "thick";
  orientation?: "horizontal" | "vertical";
}

/**
 * 多色グラデーションの区切り線コンポーネント
 */
export const GradientDivider = ({ 
  className,
  thickness = "thin",
  orientation = "horizontal"
}: GradientDividerProps) => {
  const thicknessMap = {
    thin: orientation === "horizontal" ? "h-0.5" : "w-0.5",
    medium: orientation === "horizontal" ? "h-1" : "w-1",
    thick: orientation === "horizontal" ? "h-2" : "w-2",
  };

  return (
    <div
      className={cn(
        thicknessMap[thickness],
        orientation === "horizontal" ? "w-full" : "h-full",
        className
      )}
      style={{
        background: orientation === "horizontal"
          ? "linear-gradient(to right, hsl(var(--accent-1)), hsl(var(--accent-2)), hsl(var(--accent-3)), hsl(var(--accent-4)), hsl(var(--accent-5)), hsl(var(--accent-6)))"
          : "linear-gradient(to bottom, hsl(var(--accent-1)), hsl(var(--accent-2)), hsl(var(--accent-3)), hsl(var(--accent-4)), hsl(var(--accent-5)), hsl(var(--accent-6)))",
      }}
    />
  );
};
