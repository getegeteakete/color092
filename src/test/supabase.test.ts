import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ─── Supabase 初期化ロジック ──────────────────────────────────────────────────
function buildSupabaseConfig(
  url: string | undefined,
  key: string | undefined
): { url: string; key: string; isPlaceholder: boolean } {
  const PLACEHOLDER_URL = "https://placeholder.supabase.co";
  const PLACEHOLDER_KEY = "placeholder-key";
  const resolvedUrl = url || PLACEHOLDER_URL;
  const resolvedKey = key || PLACEHOLDER_KEY;
  return {
    url: resolvedUrl,
    key: resolvedKey,
    isPlaceholder: resolvedUrl === PLACEHOLDER_URL || resolvedKey === PLACEHOLDER_KEY,
  };
}

describe("Supabase 設定ロジック", () => {
  it("環境変数が設定済みなら本物の URL/KEY を使う", () => {
    const cfg = buildSupabaseConfig(
      "https://dvndekddoomokbvdwisa.supabase.co",
      "real-anon-key"
    );
    expect(cfg.isPlaceholder).toBe(false);
    expect(cfg.url).toBe("https://dvndekddoomokbvdwisa.supabase.co");
  });

  it("URL が未設定ならプレースホルダーにフォールバック", () => {
    const cfg = buildSupabaseConfig(undefined, "real-key");
    expect(cfg.isPlaceholder).toBe(true);
  });

  it("KEY が未設定ならプレースホルダーにフォールバック", () => {
    const cfg = buildSupabaseConfig("https://real.supabase.co", undefined);
    expect(cfg.isPlaceholder).toBe(true);
  });

  it("両方未設定ならプレースホルダーにフォールバック", () => {
    const cfg = buildSupabaseConfig(undefined, undefined);
    expect(cfg.isPlaceholder).toBe(true);
  });
});

// ─── localStorage フォールバック（Supabase 未設定時） ────────────────────────
describe("見積もり localStorage フォールバック", () => {
  const mockStorage: Record<string, string> = {};

  beforeEach(() => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  });

  function saveEstimateLocal(
    storage: Record<string, string>,
    estimate: object
  ): string {
    const id = `local_${Date.now()}`;
    storage["last_estimate"] = JSON.stringify({ id, ...estimate });
    return id;
  }

  function loadEstimateLocal(storage: Record<string, string>) {
    const raw = storage["last_estimate"];
    return raw ? JSON.parse(raw) : null;
  }

  it("見積もりを保存できる", () => {
    const id = saveEstimateLocal(mockStorage, {
      building_type: "戸建て",
      estimate_min: 330000,
      estimate_max: 396000,
    });
    expect(id).toMatch(/^local_\d+$/);
    expect(mockStorage["last_estimate"]).toBeTruthy();
  });

  it("保存した見積もりを読み込める", () => {
    saveEstimateLocal(mockStorage, { building_type: "戸建て", estimate_min: 330000, estimate_max: 396000 });
    const loaded = loadEstimateLocal(mockStorage);
    expect(loaded).not.toBeNull();
    expect(loaded.building_type).toBe("戸建て");
    expect(loaded.estimate_min).toBe(330000);
  });

  it("何も保存されていなければ null を返す", () => {
    expect(loadEstimateLocal(mockStorage)).toBeNull();
  });

  it("ID が local_ プレフィックスを持つ", () => {
    const id = saveEstimateLocal(mockStorage, {});
    expect(id.startsWith("local_")).toBe(true);
  });
});
