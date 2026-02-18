import { useEffect, useRef, useState } from "react";

/**
 * スクロール連動ペンキスプラッシュ装飾システム
 * IntersectionObserverを使用してスクロールに応じて表示
 */
interface PaintProps {
  pos: "top-left" | "bottom-right" | "bottom-left";
}

const Paint = ({ pos }: PaintProps) => {
  const paintRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { 
        threshold: 0.15,
        rootMargin: "200px"
      }
    );

    if (paintRef.current) {
      observer.observe(paintRef.current);
    }

    return () => {
      if (paintRef.current) {
        observer.unobserve(paintRef.current);
      }
    };
  }, []);

  // 色を直接指定（グラデーション）
  const getGradientColors = () => {
    if (pos === "top-left") {
      return { start: "#00d4ff", end: "#0099cc" }; // Cyan系
    } else if (pos === "bottom-right") {
      return { start: "#ff7a18", end: "#ffd200" }; // Orange/Yellow系
    } else {
      return { start: "#9b59b6", end: "#8e44ad" }; // Purple系
    }
  };

  const colors = getGradientColors();

  return (
    <div
      ref={paintRef}
      className={`paint paint-${pos} ${isVisible ? "show" : ""}`}
    >
      <svg
        width="220"
        height="220"
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`gradient-${pos}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>
        </defs>
        {/* メインスプラッシュ */}
        <path
          d="M120 60 C140 50, 170 55, 185 75 C200 95, 195 120, 180 140 C165 160, 140 165, 120 160 C100 155, 85 140, 80 120 C75 100, 85 80, 105 70 C115 65, 120 60, 120 60 Z"
          fill={`url(#gradient-${pos})`}
        />
        {/* 飛沫1 */}
        <circle cx="220" cy="90" r="28" fill={`url(#gradient-${pos})`} />
        {/* 飛沫2 */}
        <ellipse cx="200" cy="130" rx="25" ry="20" fill={`url(#gradient-${pos})`} />
        {/* 飛沫3 */}
        <circle cx="160" cy="180" r="22" fill={`url(#gradient-${pos})`} />
        {/* 垂れた部分 */}
        <path
          d="M140 200 L145 240 L150 220 L155 250 L160 200 Z"
          fill={`url(#gradient-${pos})`}
        />
        {/* 小さな飛沫群 */}
        <circle cx="80" cy="100" r="15" fill={`url(#gradient-${pos})`} />
        <circle cx="100" cy="80" r="12" fill={`url(#gradient-${pos})`} />
        <circle cx="70" cy="120" r="18" fill={`url(#gradient-${pos})`} />
      </svg>
    </div>
  );
};

export const PaintSystem = () => {
  return (
    <div className="paint-system">
      <Paint pos="top-left" />
      <Paint pos="bottom-right" />
      <Paint pos="bottom-left" />
    </div>
  );
};
