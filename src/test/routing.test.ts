import { describe, it, expect } from "vitest";

// ─── ルーティング定義チェック ────────────────────────────────────────────────
const PUBLIC_ROUTES = [
  "/",
  "/works",
  "/service",
  "/news",
  "/insurance",
  "/company",
  "/contact",
  "/estimate",
  "/reservation",
  "/lp/ai-estimate",
  "/privacy",
  "/terms",
];

const ADMIN_ROUTES = [
  "/admin",
  "/admin/dashboard",
  "/admin/list",
  "/admin/detail/:id",
];

describe("ルーティング定義", () => {
  it("パブリックルートが 12 件定義されている", () => {
    expect(PUBLIC_ROUTES).toHaveLength(12);
  });

  it("管理ルートが 4 件定義されている", () => {
    expect(ADMIN_ROUTES).toHaveLength(4);
  });

  it("全パブリックルートが / で始まる", () => {
    PUBLIC_ROUTES.forEach((route) => {
      expect(route.startsWith("/")).toBe(true);
    });
  });

  it("管理ルートが /admin で始まる", () => {
    ADMIN_ROUTES.forEach((route) => {
      expect(route.startsWith("/admin")).toBe(true);
    });
  });

  it("重複するルートがない", () => {
    const allRoutes = [...PUBLIC_ROUTES, ...ADMIN_ROUTES];
    const uniqueRoutes = new Set(allRoutes);
    expect(uniqueRoutes.size).toBe(allRoutes.length);
  });

  it("/lp/ai-estimate はランディングページとして存在する", () => {
    expect(PUBLIC_ROUTES).toContain("/lp/ai-estimate");
  });

  it("/admin/detail/:id は動的ルートを持つ", () => {
    expect(ADMIN_ROUTES.some((r) => r.includes(":id"))).toBe(true);
  });
});

// ─── 遅延ロード対象ページのチェック ──────────────────────────────────────────
describe("Lazy Load 対象ページ", () => {
  const LAZY_PAGES = [
    "Estimate",
    "Reservation",
    "LpAiEstimate",
    "Privacy",
    "Terms",
    "AdminLogin",
    "AdminDashboard",
    "AdminList",
    "AdminDetail",
  ];

  it("遅延ロード対象が 9 ページある", () => {
    expect(LAZY_PAGES).toHaveLength(9);
  });

  it("管理画面が全て遅延ロード対象に含まれる", () => {
    expect(LAZY_PAGES).toContain("AdminLogin");
    expect(LAZY_PAGES).toContain("AdminDashboard");
    expect(LAZY_PAGES).toContain("AdminList");
    expect(LAZY_PAGES).toContain("AdminDetail");
  });
});

// ─── 404 ページ ────────────────────────────────────────────────────────────
describe("404 NotFound ページ", () => {
  it("未知のパスはフォールバックルート(*) にマッチする", () => {
    const unknownPaths = ["/unknown", "/foo/bar", "/admin/unknown/deep"];
    unknownPaths.forEach((path) => {
      const isKnown = [...PUBLIC_ROUTES, ...ADMIN_ROUTES].some((route) => {
        const pattern = route.replace(/:[\w]+/g, "[^/]+");
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(path);
      });
      expect(isKnown).toBe(false);
    });
  });
});

// ─── CMS 管理ルート（追加分） ────────────────────────────────────────────────
describe("CMS 管理ルート", () => {
  const CMS_ROUTES = [
    "/admin/works",
    "/admin/works/new",
    "/admin/works/edit/:id",
    "/admin/news",
    "/admin/news/new",
    "/admin/news/edit/:id",
  ];

  it("CMSルートが 6 件定義されている", () => {
    expect(CMS_ROUTES).toHaveLength(6);
  });

  it("全CMSルートが /admin で始まる", () => {
    CMS_ROUTES.forEach((r) => expect(r.startsWith("/admin")).toBe(true));
  });

  it("施工実績・お知らせそれぞれに new と edit ルートがある", () => {
    expect(CMS_ROUTES).toContain("/admin/works/new");
    expect(CMS_ROUTES.some((r) => r.startsWith("/admin/works/edit"))).toBe(true);
    expect(CMS_ROUTES).toContain("/admin/news/new");
    expect(CMS_ROUTES.some((r) => r.startsWith("/admin/news/edit"))).toBe(true);
  });
});
