import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";
import { getAccentColor, getAccentColorClass, getIconColor, ACCENT_COLORS } from "@/lib/color-utils";

// ─── cn() ───────────────────────────────────────────────────────────────────
describe("cn()", () => {
  it("単一クラスをそのまま返す", () => {
    expect(cn("text-red-500")).toBe("text-red-500");
  });

  it("複数クラスを結合する", () => {
    expect(cn("px-4", "py-2", "rounded")).toBe("px-4 py-2 rounded");
  });

  it("Tailwind の競合するクラスを正しくマージする（後勝ち）", () => {
    expect(cn("p-4", "p-8")).toBe("p-8");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  it("falsy 値を無視する", () => {
    expect(cn("base", false && "hidden", undefined, null, "end")).toBe("base end");
  });

  it("条件付きクラスを処理する", () => {
    const isActive = true;
    expect(cn("btn", isActive && "btn-active")).toBe("btn btn-active");
    const isDisabled = false;
    expect(cn("btn", isDisabled && "btn-disabled")).toBe("btn");
  });
});

// ─── color-utils ────────────────────────────────────────────────────────────
describe("getAccentColor()", () => {
  it("インデックスに対応したアクセントカラーを返す", () => {
    expect(getAccentColor(0)).toBe("accent1");
    expect(getAccentColor(1)).toBe("accent2");
    expect(getAccentColor(5)).toBe("accent6");
  });

  it("6 を超えるインデックスはローテーションする", () => {
    expect(getAccentColor(6)).toBe("accent1");
    expect(getAccentColor(7)).toBe("accent2");
    expect(getAccentColor(12)).toBe("accent1");
  });

  it("常に ACCENT_COLORS の中の値を返す", () => {
    for (let i = 0; i < 20; i++) {
      expect(ACCENT_COLORS).toContain(getAccentColor(i));
    }
  });
});

describe("getAccentColorClass()", () => {
  it("DEFAULT バリアントで text- クラスを返す", () => {
    expect(getAccentColorClass(0)).toBe("text-accent1");
    expect(getAccentColorClass(1)).toBe("text-accent2");
  });

  it("soft バリアントで bg-*-soft クラスを返す", () => {
    expect(getAccentColorClass(0, "soft")).toBe("bg-accent1-soft");
  });

  it("gradient バリアントで bg-*-gradient クラスを返す", () => {
    expect(getAccentColorClass(0, "gradient")).toBe("bg-accent1-gradient");
  });
});

describe("getIconColor()", () => {
  it("数値インデックスを渡すと対応するアクセントカラーを返す", () => {
    expect(getIconColor(0)).toBe("accent1");
    expect(getIconColor(3)).toBe("accent4");
  });

  it("文字列を渡すと常に ACCENT_COLORS の中の値を返す", () => {
    const categories = ["外壁塗装", "屋根塗装", "防水工事", "内装リフォーム", ""];
    categories.forEach((cat) => {
      expect(ACCENT_COLORS).toContain(getIconColor(cat));
    });
  });

  it("同じ文字列は常に同じカラーを返す（決定的）", () => {
    expect(getIconColor("外壁塗装")).toBe(getIconColor("外壁塗装"));
    expect(getIconColor("屋根塗装")).toBe(getIconColor("屋根塗装"));
  });
});
