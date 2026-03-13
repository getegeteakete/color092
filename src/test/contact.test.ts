import { describe, it, expect, vi } from "vitest";

// ─── お問い合わせフォーム バリデーション ─────────────────────────────────────
interface ContactPayload {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  return /^[\d\-+() ]{7,20}$/.test(phone);
}

function validateContactPayload(p: ContactPayload): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!p.name.trim())    errors.push("名前は必須です");
  if (!p.phone.trim())   errors.push("電話番号は必須です");
  else if (!isValidPhone(p.phone)) errors.push("電話番号の形式が正しくありません");
  if (!p.email.trim())   errors.push("メールアドレスは必須です");
  else if (!isValidEmail(p.email)) errors.push("メールアドレスの形式が正しくありません");
  if (!p.message.trim()) errors.push("メッセージは必須です");
  return { valid: errors.length === 0, errors };
}

describe("お問い合わせフォーム バリデーション", () => {
  describe("正常系", () => {
    it("全必須項目が入力済みなら valid", () => {
      const r = validateContactPayload({
        name: "田中太郎",
        phone: "090-6120-2995",
        email: "tanaka@example.com",
        subject: "estimate",
        message: "外壁塗装の見積もりをお願いしたいです。",
      });
      expect(r.valid).toBe(true);
      expect(r.errors).toHaveLength(0);
    });

    it("subject は任意なので空でも valid", () => {
      const r = validateContactPayload({
        name: "田中太郎", phone: "090-1234-5678",
        email: "t@example.com", subject: "", message: "テスト",
      });
      expect(r.valid).toBe(true);
    });
  });

  describe("必須チェック", () => {
    it("名前が空なら invalid", () => {
      const r = validateContactPayload({ name: "", phone: "090-1234-5678", email: "a@b.com", subject: "", message: "test" });
      expect(r.valid).toBe(false);
      expect(r.errors).toContain("名前は必須です");
    });

    it("電話番号が空なら invalid", () => {
      const r = validateContactPayload({ name: "田中", phone: "", email: "a@b.com", subject: "", message: "test" });
      expect(r.valid).toBe(false);
      expect(r.errors).toContain("電話番号は必須です");
    });

    it("メールが空なら invalid", () => {
      const r = validateContactPayload({ name: "田中", phone: "090-1234-5678", email: "", subject: "", message: "test" });
      expect(r.valid).toBe(false);
      expect(r.errors).toContain("メールアドレスは必須です");
    });

    it("メッセージが空なら invalid", () => {
      const r = validateContactPayload({ name: "田中", phone: "090-1234-5678", email: "a@b.com", subject: "", message: "" });
      expect(r.valid).toBe(false);
      expect(r.errors).toContain("メッセージは必須です");
    });
  });

  describe("形式チェック", () => {
    it("不正なメールアドレスは invalid", () => {
      const invalids = ["notmail", "a@", "@b.com", "a b@c.com"];
      invalids.forEach((email) => {
        expect(isValidEmail(email)).toBe(false);
      });
    });

    it("正常なメールアドレスは valid", () => {
      const valids = ["user@example.com", "user+tag@sub.domain.co.jp", "123@456.org"];
      valids.forEach((email) => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    it("正常な電話番号形式は valid", () => {
      const valids = ["090-6120-2995", "0120-123-456", "09012345678", "+81-90-1234-5678"];
      valids.forEach((phone) => {
        expect(isValidPhone(phone)).toBe(true);
      });
    });
  });

  describe("送信ペイロード生成", () => {
    it("FormData から正しい payload を生成できる", () => {
      const fd = new Map([
        ["name", "田中太郎"],
        ["phone", "090-1234-5678"],
        ["email", "tanaka@example.com"],
        ["subject", "estimate"],
        ["message", "お見積りをお願いします。"],
      ]);

      const payload = {
        name: (fd.get("name") as string) ?? "",
        phone: (fd.get("phone") as string) ?? "",
        email: (fd.get("email") as string) ?? "",
        subject: (fd.get("subject") as string) ?? "",
        message: (fd.get("message") as string) ?? "",
      };

      expect(payload.name).toBe("田中太郎");
      expect(payload.email).toBe("tanaka@example.com");
      expect(payload.subject).toBe("estimate");
    });
  });
});
