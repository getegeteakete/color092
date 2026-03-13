import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── 管理者ログインロジック ───────────────────────────────────────────────────
function tryAdminLogin(inputPassword: string, envPassword: string | undefined): boolean {
  const adminPassword = envPassword || "admin123";
  return inputPassword === adminPassword;
}

// ─── ProtectedRoute 認証チェック ─────────────────────────────────────────────
function isAuthenticated(storage: Record<string, string>): boolean {
  return !!storage["admin_authenticated"];
}

describe("管理者ログイン", () => {
  describe("パスワード照合", () => {
    it("正しいパスワードで認証成功", () => {
      expect(tryAdminLogin("admin123", undefined)).toBe(true);
    });

    it("間違ったパスワードで認証失敗", () => {
      expect(tryAdminLogin("wrong", undefined)).toBe(false);
    });

    it("空のパスワードで認証失敗", () => {
      expect(tryAdminLogin("", undefined)).toBe(false);
    });

    it("環境変数のパスワードが優先される", () => {
      expect(tryAdminLogin("custom_pass", "custom_pass")).toBe(true);
      expect(tryAdminLogin("admin123", "custom_pass")).toBe(false);
    });

    it("大文字小文字を区別する", () => {
      expect(tryAdminLogin("Admin123", undefined)).toBe(false);
      expect(tryAdminLogin("ADMIN123", undefined)).toBe(false);
    });
  });
});

describe("ProtectedRoute: 認証チェック", () => {
  it("sessionStorage に admin_authenticated がなければ未認証", () => {
    expect(isAuthenticated({})).toBe(false);
  });

  it("sessionStorage に admin_authenticated があれば認証済み", () => {
    expect(isAuthenticated({ admin_authenticated: "true" })).toBe(true);
  });

  it("admin_authenticated が空文字なら未認証", () => {
    expect(isAuthenticated({ admin_authenticated: "" })).toBe(false);
  });
});

// ─── ステータス定義 ───────────────────────────────────────────────────────────
describe("ステータス管理", () => {
  const VALID_STATUSES = ["仮見積", "予約済", "現地調査完了", "本見積提出", "成約", "失注"] as const;
  type Status = typeof VALID_STATUSES[number];

  it("ステータスが 6 種類ある", () => {
    expect(VALID_STATUSES).toHaveLength(6);
  });

  it("成約・失注は最終ステータス（他と区別可能）", () => {
    const finalStatuses: Status[] = ["成約", "失注"];
    expect(finalStatuses.every((s) => VALID_STATUSES.includes(s))).toBe(true);
  });

  it("ステータスの進捗順序が正しい（仮見積 → 成約）", () => {
    expect(VALID_STATUSES.indexOf("仮見積")).toBeLessThan(VALID_STATUSES.indexOf("成約"));
    expect(VALID_STATUSES.indexOf("予約済")).toBeLessThan(VALID_STATUSES.indexOf("現地調査完了"));
  });

  // 見積もりのソートロジック
  it("日付降順ソート: 新しい方が先", () => {
    const estimates = [
      { id: "a", created_at: "2024-01-01T00:00:00Z", estimate_min: 300000 },
      { id: "b", created_at: "2024-03-15T00:00:00Z", estimate_min: 500000 },
      { id: "c", created_at: "2024-02-10T00:00:00Z", estimate_min: 200000 },
    ];
    const sorted = [...estimates].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    expect(sorted[0].id).toBe("b");
    expect(sorted[2].id).toBe("a");
  });

  it("金額昇順ソート: 安い方が先", () => {
    const estimates = [
      { id: "a", estimate_min: 300000 },
      { id: "b", estimate_min: 500000 },
      { id: "c", estimate_min: 200000 },
    ];
    const sorted = [...estimates].sort((a, b) => a.estimate_min - b.estimate_min);
    expect(sorted[0].id).toBe("c");
    expect(sorted[2].id).toBe("b");
  });

  // 検索フィルターロジック
  it("顧客名で検索できる", () => {
    const estimates = [
      { id: "1", customer_name: "田中太郎", customer_phone: "090-1111-2222", customer_email: "tanaka@test.com", building_type: "戸建て" },
      { id: "2", customer_name: "山田花子", customer_phone: "080-3333-4444", customer_email: "yamada@test.com", building_type: "アパート" },
    ];
    const query = "田中";
    const filtered = estimates.filter((e) =>
      e.customer_name?.toLowerCase().includes(query) ||
      e.customer_phone?.includes(query) ||
      e.customer_email?.toLowerCase().includes(query) ||
      e.building_type.includes(query)
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("1");
  });

  it("建物種別で検索できる", () => {
    const estimates = [
      { id: "1", customer_name: undefined, customer_phone: undefined, customer_email: undefined, building_type: "戸建て" },
      { id: "2", customer_name: undefined, customer_phone: undefined, customer_email: undefined, building_type: "アパート" },
    ];
    const query = "アパート";
    const filtered = estimates.filter((e) =>
      e.customer_name?.toLowerCase().includes(query) ||
      e.customer_phone?.includes(query) ||
      e.customer_email?.toLowerCase().includes(query) ||
      e.building_type.includes(query)
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("2");
  });
});
