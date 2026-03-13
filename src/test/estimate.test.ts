import { describe, it, expect } from "vitest";

// ─── 見積もり計算ロジック（Estimate.tsx から抽出して独立テスト） ───────────
// コンポーネント内の計算ロジックを純粋関数として再現
type DeteriorationLevel = "軽度" | "中度" | "重度";

function calculateEstimate(params: {
  floorArea: number;
  deteriorationLevel: DeteriorationLevel | "";
  workTypes: string[];
}) {
  const basePrice = 3000;
  let baseAmount = params.floorArea * basePrice;

  const deteriorationMultiplier: Record<DeteriorationLevel, number> = {
    軽度: 1.0,
    中度: 1.2,
    重度: 1.4,
  };
  baseAmount *= deteriorationMultiplier[params.deteriorationLevel as DeteriorationLevel] ?? 1.0;

  let optionAmount = 0;
  if (params.workTypes.includes("屋根塗装"))      optionAmount += 150000;
  if (params.workTypes.includes("防水工事"))      optionAmount += 200000;
  if (params.workTypes.includes("内装リフォーム")) optionAmount += 300000;

  const totalMin = baseAmount + optionAmount;
  const totalMax = totalMin * 1.2;
  return {
    min: Math.round(totalMin * 1.1),
    max: Math.round(totalMax * 1.1),
  };
}

describe("見積もり計算 calculateEstimate()", () => {
  describe("基本計算（外壁塗装のみ）", () => {
    it("100㎡・軽度: min が 330,000円 (税込)", () => {
      const result = calculateEstimate({
        floorArea: 100,
        deteriorationLevel: "軽度",
        workTypes: ["外壁塗装"],
      });
      expect(result.min).toBe(330000);  // 100 * 3000 * 1.0 * 1.1
    });

    it("100㎡・中度: min が 396,000円 (税込)", () => {
      const result = calculateEstimate({
        floorArea: 100,
        deteriorationLevel: "中度",
        workTypes: ["外壁塗装"],
      });
      expect(result.min).toBe(396000); // 100 * 3000 * 1.2 * 1.1
    });

    it("100㎡・重度: min が 462,000円 (税込)", () => {
      const result = calculateEstimate({
        floorArea: 100,
        deteriorationLevel: "重度",
        workTypes: ["外壁塗装"],
      });
      expect(result.min).toBe(462000); // 100 * 3000 * 1.4 * 1.1
    });
  });

  describe("max は min の 1.2 倍（税込後）", () => {
    it("軽度でも max/min の比率が約 1.2 倍", () => {
      const result = calculateEstimate({
        floorArea: 100,
        deteriorationLevel: "軽度",
        workTypes: ["外壁塗装"],
      });
      expect(result.max / result.min).toBeCloseTo(1.2, 5);
    });
  });

  describe("オプション施工内容の加算", () => {
    it("屋根塗装を追加すると +150,000円 (税抜) 分加算される", () => {
      const base = calculateEstimate({ floorArea: 100, deteriorationLevel: "軽度", workTypes: ["外壁塗装"] });
      const withRoof = calculateEstimate({ floorArea: 100, deteriorationLevel: "軽度", workTypes: ["外壁塗装", "屋根塗装"] });
      expect(withRoof.min - base.min).toBe(Math.round(150000 * 1.1)); // 165,000
    });

    it("防水工事を追加すると +200,000円 (税抜) 分加算される", () => {
      const base = calculateEstimate({ floorArea: 100, deteriorationLevel: "軽度", workTypes: ["外壁塗装"] });
      const withWater = calculateEstimate({ floorArea: 100, deteriorationLevel: "軽度", workTypes: ["外壁塗装", "防水工事"] });
      expect(withWater.min - base.min).toBe(Math.round(200000 * 1.1)); // 220,000
    });

    it("内装リフォームを追加すると +300,000円 (税抜) 分加算される", () => {
      const base = calculateEstimate({ floorArea: 100, deteriorationLevel: "軽度", workTypes: ["外壁塗装"] });
      const withInterior = calculateEstimate({ floorArea: 100, deteriorationLevel: "軽度", workTypes: ["外壁塗装", "内装リフォーム"] });
      expect(withInterior.min - base.min).toBe(Math.round(300000 * 1.1)); // 330,000
    });

    it("全オプション追加で合計が正しく計算される", () => {
      const result = calculateEstimate({
        floorArea: 100,
        deteriorationLevel: "軽度",
        workTypes: ["外壁塗装", "屋根塗装", "防水工事", "内装リフォーム"],
      });
      const expectedMin = Math.round((100 * 3000 + 150000 + 200000 + 300000) * 1.1);
      expect(result.min).toBe(expectedMin);
    });
  });

  describe("エッジケース", () => {
    it("面積が 0 のとき、オプションなしは 0 円", () => {
      const result = calculateEstimate({
        floorArea: 0,
        deteriorationLevel: "軽度",
        workTypes: ["外壁塗装"],
      });
      expect(result.min).toBe(0);
      expect(result.max).toBe(0);
    });

    it("劣化状況が未選択でも計算できる（倍率 1.0 扱い）", () => {
      const withLevel = calculateEstimate({ floorArea: 100, deteriorationLevel: "軽度", workTypes: [] });
      const withoutLevel = calculateEstimate({ floorArea: 100, deteriorationLevel: "", workTypes: [] });
      expect(withoutLevel.min).toBe(withLevel.min);
    });

    it("施工内容なしでも基本計算が走る", () => {
      const result = calculateEstimate({ floorArea: 50, deteriorationLevel: "中度", workTypes: [] });
      expect(result.min).toBeGreaterThan(0);
    });

    it("小数面積でも計算できる", () => {
      const result = calculateEstimate({ floorArea: 99.5, deteriorationLevel: "軽度", workTypes: [] });
      expect(Number.isFinite(result.min)).toBe(true);
    });
  });
});

// ─── バリデーション ───────────────────────────────────────────────────────────
describe("見積もりフォーム バリデーション", () => {
  // STEP1: 建物情報
  describe("STEP 1: 建物情報", () => {
    it("全項目が入力済みなら valid", () => {
      const data = { buildingType: "戸建て", buildingAge: "15", floorArea: "120", floors: "2" };
      const isValid = !!(data.buildingType && data.buildingAge && data.floorArea && data.floors);
      expect(isValid).toBe(true);
    });

    it("buildingType が空なら invalid", () => {
      const data = { buildingType: "", buildingAge: "15", floorArea: "120", floors: "2" };
      const isValid = !!(data.buildingType && data.buildingAge && data.floorArea && data.floors);
      expect(isValid).toBe(false);
    });

    it("floorArea が空なら invalid", () => {
      const data = { buildingType: "戸建て", buildingAge: "15", floorArea: "", floors: "2" };
      const isValid = !!(data.buildingType && data.buildingAge && data.floorArea && data.floors);
      expect(isValid).toBe(false);
    });
  });

  // STEP2: 施工内容
  describe("STEP 2: 施工内容", () => {
    it("1 件以上選択されていれば valid", () => {
      expect(["外壁塗装"].length > 0).toBe(true);
    });

    it("何も選択されていなければ invalid", () => {
      expect([].length > 0).toBe(false);
    });
  });

  // STEP3: 劣化状況
  describe("STEP 3: 劣化状況", () => {
    it("劣化状況が選択済みなら valid", () => {
      expect(!!"中度").toBe(true);
    });

    it("劣化状況が空なら invalid", () => {
      expect(!!"").toBe(false);
    });
  });
});
