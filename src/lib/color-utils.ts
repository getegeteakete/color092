/**
 * 6色のアクセントカラーをローテーションするヘルパー関数
 */

export const ACCENT_COLORS = [
  "accent1",
  "accent2",
  "accent3",
  "accent4",
  "accent5",
  "accent6",
] as const;

export type AccentColor = typeof ACCENT_COLORS[number];

/**
 * インデックスに基づいてアクセントカラーを取得
 */
export const getAccentColor = (index: number): AccentColor => {
  return ACCENT_COLORS[index % ACCENT_COLORS.length];
};

/**
 * アクセントカラーのTailwindクラス名を取得
 */
export const getAccentColorClass = (index: number, variant: "DEFAULT" | "soft" | "gradient" = "DEFAULT"): string => {
  const color = getAccentColor(index);
  return variant === "DEFAULT" 
    ? `text-${color}` 
    : variant === "soft"
    ? `bg-${color}-soft`
    : `bg-${color}-gradient`;
};

/**
 * アイコンの色を取得（カテゴリごとに色分け）
 */
export const getIconColor = (category: string | number): AccentColor => {
  if (typeof category === "number") {
    return getAccentColor(category);
  }
  // 文字列のハッシュ値で色を決定
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return getAccentColor(Math.abs(hash));
};
