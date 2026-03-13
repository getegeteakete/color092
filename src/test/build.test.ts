import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { resolve } from "path";

const DIST = resolve(__dirname, "../../dist");
const DIST_ASSETS = resolve(DIST, "assets");

// ─── ビルド成果物チェック ────────────────────────────────────────────────────
describe("ビルド成果物チェック", () => {
  it("dist/ ディレクトリが存在する", () => {
    expect(existsSync(DIST)).toBe(true);
  });

  it("index.html が出力されている", () => {
    expect(existsSync(resolve(DIST, "index.html"))).toBe(true);
  });

  it("assets/ ディレクトリが出力されている", () => {
    expect(existsSync(DIST_ASSETS)).toBe(true);
  });

  it("CSS ファイルが 1 件以上出力されている", () => {
    const files = readdirSync(DIST_ASSETS);
    const cssFiles = files.filter((f) => f.endsWith(".css"));
    expect(cssFiles.length).toBeGreaterThanOrEqual(1);
  });

  it("JS ファイルが 5 件以上出力されている（コード分割確認）", () => {
    const files = readdirSync(DIST_ASSETS);
    const jsFiles = files.filter((f) => f.endsWith(".js"));
    expect(jsFiles.length).toBeGreaterThanOrEqual(5);
  });

  it("vendor-react チャンクが出力されている", () => {
    const files = readdirSync(DIST_ASSETS);
    expect(files.some((f) => f.startsWith("vendor-react"))).toBe(true);
  });

  it("vendor-data チャンクが出力されている（Supabase/React Query）", () => {
    const files = readdirSync(DIST_ASSETS);
    expect(files.some((f) => f.startsWith("vendor-data"))).toBe(true);
  });

  it("vendor-radix チャンクが出力されている", () => {
    const files = readdirSync(DIST_ASSETS);
    expect(files.some((f) => f.startsWith("vendor-radix"))).toBe(true);
  });

  it("管理画面が独立したチャンクとして出力されている", () => {
    const files = readdirSync(DIST_ASSETS);
    expect(files.some((f) => f.startsWith("AdminDashboard"))).toBe(true);
    expect(files.some((f) => f.startsWith("AdminList"))).toBe(true);
    expect(files.some((f) => f.startsWith("AdminDetail"))).toBe(true);
  });

  it("index.html に type=module の script タグが含まれる", () => {
    const html = readFileSync(resolve(DIST, "index.html"), "utf-8");
    expect(html).toContain('type="module"');
  });

  it("index.html が SPA として正しく構成されている（<div id=root>）", () => {
    const html = readFileSync(resolve(DIST, "index.html"), "utf-8");
    expect(html).toContain('id="root"');
  });

  it("メインの JS バンドルが 500KB 未満（分割確認）", () => {
    const files = readdirSync(DIST_ASSETS);
    const mainJs = files.find((f) => f.startsWith("index-") && f.endsWith(".js"));
    if (mainJs) {
      const stats = statSync(resolve(DIST_ASSETS, mainJs));
      expect(stats.size).toBeLessThan(500 * 1024); // 500KB
    }
  });
});

// ─── vercel.json 設定チェック ────────────────────────────────────────────────
describe("vercel.json 設定チェック", () => {
  const vercelPath = resolve(__dirname, "../../vercel.json");

  it("vercel.json が存在する", () => {
    expect(existsSync(vercelPath)).toBe(true);
  });

  it("SPA の rewrites が設定されている", () => {
    const config = JSON.parse(readFileSync(vercelPath, "utf-8"));
    expect(config.rewrites).toBeDefined();
    expect(Array.isArray(config.rewrites)).toBe(true);
    const catchAll = config.rewrites.find(
      (r: { source: string; destination: string }) =>
        r.source === "/(.*)" && r.destination === "/index.html"
    );
    expect(catchAll).toBeDefined();
  });

  it("framework が vite に設定されている", () => {
    const config = JSON.parse(readFileSync(vercelPath, "utf-8"));
    expect(config.framework).toBe("vite");
  });

  it("outputDirectory が dist に設定されている", () => {
    const config = JSON.parse(readFileSync(vercelPath, "utf-8"));
    expect(config.outputDirectory).toBe("dist");
  });
});
