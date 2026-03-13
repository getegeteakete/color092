import { describe, it, expect } from "vitest";

// ─── 予約フォーム バリデーションロジック ────────────────────────────────────
type ReservationType = "現地調査" | "Zoomオンライン相談";

interface ReservationFormData {
  type: ReservationType | "";
  date: Date | undefined;
  time: string;
  address: string;
  notes: string;
}

function validateReservationForm(formData: ReservationFormData): { valid: boolean; reason?: string } {
  if (!formData.type) return { valid: false, reason: "予約種別が未選択" };
  if (!formData.date) return { valid: false, reason: "希望日が未選択" };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (formData.date < today) return { valid: false, reason: "過去の日付" };

  if (!formData.time) return { valid: false, reason: "希望時間が未選択" };

  if (formData.type === "現地調査" && !formData.address.trim()) {
    return { valid: false, reason: "住所が未入力" };
  }

  return { valid: true };
}

const FUTURE_DATE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1週間後
const PAST_DATE   = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 1週間前

describe("予約フォーム バリデーション", () => {
  describe("全項目正常", () => {
    it("現地調査: 全入力済みは valid", () => {
      const r = validateReservationForm({
        type: "現地調査",
        date: FUTURE_DATE,
        time: "10:00",
        address: "福岡市東区和白1-1-35",
        notes: "",
      });
      expect(r.valid).toBe(true);
    });

    it("Zoom相談: 住所なしでも valid", () => {
      const r = validateReservationForm({
        type: "Zoomオンライン相談",
        date: FUTURE_DATE,
        time: "14:00",
        address: "",
        notes: "",
      });
      expect(r.valid).toBe(true);
    });
  });

  describe("必須チェック", () => {
    it("予約種別が未選択なら invalid", () => {
      const r = validateReservationForm({ type: "", date: FUTURE_DATE, time: "10:00", address: "", notes: "" });
      expect(r.valid).toBe(false);
      expect(r.reason).toBe("予約種別が未選択");
    });

    it("日付が未選択なら invalid", () => {
      const r = validateReservationForm({ type: "現地調査", date: undefined, time: "10:00", address: "福岡市", notes: "" });
      expect(r.valid).toBe(false);
      expect(r.reason).toBe("希望日が未選択");
    });

    it("時間が未選択なら invalid", () => {
      const r = validateReservationForm({ type: "現地調査", date: FUTURE_DATE, time: "", address: "福岡市", notes: "" });
      expect(r.valid).toBe(false);
      expect(r.reason).toBe("希望時間が未選択");
    });

    it("現地調査で住所が空なら invalid", () => {
      const r = validateReservationForm({ type: "現地調査", date: FUTURE_DATE, time: "10:00", address: "", notes: "" });
      expect(r.valid).toBe(false);
      expect(r.reason).toBe("住所が未入力");
    });

    it("現地調査で住所がスペースのみなら invalid", () => {
      const r = validateReservationForm({ type: "現地調査", date: FUTURE_DATE, time: "10:00", address: "   ", notes: "" });
      expect(r.valid).toBe(false);
    });
  });

  describe("日付チェック", () => {
    it("過去の日付なら invalid", () => {
      const r = validateReservationForm({ type: "現地調査", date: PAST_DATE, time: "10:00", address: "福岡市", notes: "" });
      expect(r.valid).toBe(false);
      expect(r.reason).toBe("過去の日付");
    });

    it("当日は valid（今日の 0:00:00 以降）", () => {
      const today = new Date();
      today.setHours(12, 0, 0, 0); // 今日の正午
      const r = validateReservationForm({ type: "Zoomオンライン相談", date: today, time: "13:00", address: "", notes: "" });
      expect(r.valid).toBe(true);
    });
  });

  describe("タイムスロット一覧", () => {
    const TIME_SLOTS = [
      "09:00","09:30","10:00","10:30","11:00","11:30",
      "12:00","12:30","13:00","13:30","14:00","14:30",
      "15:00","15:30","16:00","16:30","17:00","17:30",
    ];

    it("タイムスロットが 18 件ある", () => {
      expect(TIME_SLOTS).toHaveLength(18);
    });

    it("全スロットが HH:MM 形式", () => {
      const HH_MM = /^\d{2}:\d{2}$/;
      TIME_SLOTS.forEach((slot) => {
        expect(slot).toMatch(HH_MM);
      });
    });

    it("最初は 09:00、最後は 17:30", () => {
      expect(TIME_SLOTS[0]).toBe("09:00");
      expect(TIME_SLOTS[TIME_SLOTS.length - 1]).toBe("17:30");
    });
  });
});
