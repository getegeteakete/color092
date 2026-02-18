import { cn } from "@/lib/utils";

interface ColorGlowProps {
  className?: string;
  intensity?: "light" | "medium" | "strong";
  size?: "sm" | "md" | "lg" | "xl";
}

/**
 * 多色のグロウ背景を生成するコンポーネント
 * セクション背景に使用
 */
export const ColorGlow = ({ 
  className, 
  intensity = "light",
  size = "lg" 
}: ColorGlowProps) => {
  const intensityMap = {
    light: "opacity-20",
    medium: "opacity-30",
    strong: "opacity-40",
  };

  const sizeMap = {
    sm: "w-32 h-32",
    md: "w-64 h-64",
    lg: "w-96 h-96",
    xl: "w-[500px] h-[500px]",
  };

  return (
    <div className={cn("absolute pointer-events-none", className)}>
      {/* 6色のグロウを配置 */}
      <div 
        className={cn(
          "absolute rounded-full blur-3xl",
          sizeMap[size],
          intensityMap[intensity],
          "bg-accent1-gradient top-0 left-0"
        )}
      />
      <div 
        className={cn(
          "absolute rounded-full blur-3xl",
          sizeMap[size],
          intensityMap[intensity],
          "bg-accent2-gradient top-1/4 right-0"
        )}
      />
      <div 
        className={cn(
          "absolute rounded-full blur-3xl",
          sizeMap[size],
          intensityMap[intensity],
          "bg-accent3-gradient top-1/2 left-1/4"
        )}
      />
      <div 
        className={cn(
          "absolute rounded-full blur-3xl",
          sizeMap[size],
          intensityMap[intensity],
          "bg-accent4-gradient bottom-0 right-1/4"
        )}
      />
      <div 
        className={cn(
          "absolute rounded-full blur-3xl",
          sizeMap[size],
          intensityMap[intensity],
          "bg-accent5-gradient bottom-1/4 left-0"
        )}
      />
      <div 
        className={cn(
          "absolute rounded-full blur-3xl",
          sizeMap[size],
          intensityMap[intensity],
          "bg-accent6-gradient top-3/4 right-1/3"
        )}
      />
    </div>
  );
};
