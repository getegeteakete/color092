/**
 * ペンキスプラッシュ装飾レイヤー
 * 画面の隅に配置される装飾要素（背景レイヤー）
 */

export const PaintDecoration = () => {
  return (
    <div className="paint-layer">
      {/* 左上スプラッシュ - Accent 1 (Cyan) */}
      <svg
        className="paint top-left"
        width="300"
        height="300"
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="blur1">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>
        {/* メインスプラッシュ */}
        <path
          d="M80 40 C100 30, 130 35, 150 50 C170 65, 180 90, 175 115 C170 140, 155 160, 135 170 C115 180, 90 175, 75 160 C60 145, 55 120, 65 100 C75 80, 85 60, 80 40 Z"
          fill="hsl(var(--accent-1))"
          filter="url(#blur1)"
        />
        {/* 垂れた部分 */}
        <path
          d="M120 180 L125 220 L130 200 L135 230 L140 180 Z"
          fill="hsl(var(--accent-1))"
          filter="url(#blur1)"
        />
        {/* 小さな飛沫 */}
        <circle cx="200" cy="80" r="25" fill="hsl(var(--accent-1))" filter="url(#blur1)" />
        <circle cx="220" cy="120" r="18" fill="hsl(var(--accent-1))" filter="url(#blur1)" />
        <ellipse cx="190" cy="140" rx="20" ry="15" fill="hsl(var(--accent-1))" filter="url(#blur1)" />
      </svg>

      {/* 右下スプラッシュ - Accent 4 (Pink) */}
      <svg
        className="paint bottom-right"
        width="350"
        height="350"
        viewBox="0 0 350 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="blur2">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>
        </defs>
        {/* メインスプラッシュ */}
        <path
          d="M250 250 C270 240, 300 250, 320 270 C340 290, 330 320, 310 340 C290 330, 270 310, 250 300 C230 290, 220 270, 230 250 C240 230, 250 240, 250 250 Z"
          fill="hsl(var(--accent-4))"
          filter="url(#blur2)"
        />
        {/* 大きな塊 */}
        <ellipse cx="280" cy="300" rx="45" ry="55" fill="hsl(var(--accent-4))" filter="url(#blur2)" />
        {/* 垂れた部分 */}
        <path
          d="M300 320 L305 350 L310 330 L315 350 L320 320 Z"
          fill="hsl(var(--accent-4))"
          filter="url(#blur2)"
        />
        {/* 小さな飛沫 */}
        <circle cx="200" cy="280" r="22" fill="hsl(var(--accent-4))" filter="url(#blur2)" />
        <ellipse cx="180" cy="300" rx="25" ry="20" fill="hsl(var(--accent-4))" filter="url(#blur2)" />
      </svg>

      {/* 左下小ドット群 - Accent 2 (Blue) */}
      <svg
        className="paint bottom-left small"
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="blur3">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
        </defs>
        <circle cx="50" cy="150" r="20" fill="hsl(var(--accent-2))" filter="url(#blur3)" />
        <circle cx="80" cy="170" r="15" fill="hsl(var(--accent-2))" filter="url(#blur3)" />
        <circle cx="40" cy="180" r="12" fill="hsl(var(--accent-2))" filter="url(#blur3)" />
        <circle cx="70" cy="190" r="18" fill="hsl(var(--accent-2))" filter="url(#blur3)" />
        <path
          d="M30 160 L35 175 L40 165 L45 180 L50 160 Z"
          fill="hsl(var(--accent-2))"
          filter="url(#blur3)"
        />
      </svg>

      {/* 右上アクセント - Accent 5 (Amber) */}
      <svg
        className="paint top-right"
        width="250"
        height="250"
        viewBox="0 0 250 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="blur4">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>
        <path
          d="M200 30 C220 20, 240 40, 250 60 C240 80, 230 100, 210 110 C190 120, 170 115, 160 95 C150 75, 160 55, 180 45 C190 40, 195 35, 200 30 Z"
          fill="hsl(var(--accent-5))"
          filter="url(#blur4)"
        />
        <ellipse cx="220" cy="80" rx="25" ry="30" fill="hsl(var(--accent-5))" filter="url(#blur4)" />
        <path
          d="M180 50 L185 70 L190 60 L195 75 L200 50 Z"
          fill="hsl(var(--accent-5))"
          filter="url(#blur4)"
        />
      </svg>

      {/* 中央下部アクセント - Accent 3 (Violet) */}
      <svg
        className="paint center-bottom small"
        width="180"
        height="180"
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="blur5">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
          </filter>
        </defs>
        <circle cx="90" cy="150" r="30" fill="hsl(var(--accent-3))" filter="url(#blur5)" />
        <path
          d="M70 140 L75 160 L80 150 L85 165 L90 140 Z"
          fill="hsl(var(--accent-3))"
          filter="url(#blur5)"
        />
        <circle cx="110" cy="160" r="18" fill="hsl(var(--accent-3))" filter="url(#blur5)" />
      </svg>
    </div>
  );
};
