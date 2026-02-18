import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface RainbowRingCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

/**
 * ホバー時に虹色のリングが表示されるカードコンポーネント
 */
export const RainbowRingCard = ({ 
  children, 
  className,
  hoverEffect = true 
}: RainbowRingCardProps) => {
  return (
    <div
      className={cn(
        "relative rounded-3xl bg-card border border-border transition-all duration-300",
        hoverEffect && "group rainbow-ring",
        className
      )}
    >
      {children}
      
      {/* ホバー時のシャドウ（多色） */}
      {hoverEffect && (
        <div
          className={cn(
            "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10",
            "blur-xl"
          )}
          style={{
            boxShadow: `
              0 0 20px hsl(var(--accent-1) / 0.2),
              0 0 40px hsl(var(--accent-2) / 0.15),
              0 0 60px hsl(var(--accent-3) / 0.1),
              0 0 80px hsl(var(--accent-4) / 0.1),
              0 0 100px hsl(var(--accent-5) / 0.1),
              0 0 120px hsl(var(--accent-6) / 0.1)
            `,
          }}
        />
      )}
    </div>
  );
};
