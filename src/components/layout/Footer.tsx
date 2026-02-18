import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from "lucide-react";
import { ColorGlow } from "@/components/ui/color-glow";
import { GradientDivider } from "@/components/ui/gradient-divider";

const navLinks = [
  { label: "HOME", path: "/" },
  { label: "施工実績", path: "/works" },
  { label: "事業内容", path: "/service" },
  { label: "お知らせ", path: "/news" },
  { label: "災害保険", path: "/insurance" },
  { label: "会社概要", path: "/company" },
  { label: "お問い合わせ", path: "/contact" },
  { label: "AI仮見積もりLP", path: "/lp/ai-estimate" },
];

export const Footer = () => {
  return (
    <footer className="bg-foreground text-card">
      {/* CTA Section - 多色グロウ背景 */}
      <div className="relative py-16 overflow-hidden">
        {/* 多色グロウ背景 */}
        <div className="absolute inset-0">
          <ColorGlow intensity="medium" size="xl" className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div 
          className="absolute inset-0 opacity-80"
          style={{
            background: "linear-gradient(135deg, hsl(var(--accent-1) / 0.3), hsl(var(--accent-2) / 0.3), hsl(var(--accent-3) / 0.3), hsl(var(--accent-4) / 0.3), hsl(var(--accent-5) / 0.3), hsl(var(--accent-6) / 0.3))",
          }}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            まずはお気軽にご相談ください
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            お見積もりは無料です。お客様のご状況に合わせた最適なご提案をさせていただきます。
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white px-8 py-4 rounded-full font-medium hover:bg-white/90 transition-all hover:scale-105"
            style={{
              color: "hsl(var(--accent-4))",
            }}
          >
            無料相談・お見積もり
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <img
                src="/rogo.png"
                alt="COLORS ロゴ"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-card/70 text-sm leading-relaxed mb-6">
              福岡県を拠点に、塗装を中心としたリフォームサービスを提供する専門会社です。
              地域に密着し、多くのお客様の信頼を得ながら、住宅や店舗の外壁・内装の塗装をはじめとする幅広いサービスを展開しています。
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-card/10 flex items-center justify-center hover:bg-card/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-card/10 flex items-center justify-center hover:bg-card/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-bold mb-6">ナビゲーション</h3>
            <ul className="space-y-3">
              {navLinks.map((link, index) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-card/70 hover:text-card transition-colors text-sm relative group"
                    style={{
                      transition: "color 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      const accentIndex = (index % 6) + 1;
                      e.currentTarget.style.color = `hsl(var(--accent-${accentIndex}))`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "";
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6">お問い合わせ</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone 
                  className="w-5 h-5 mt-0.5"
                  style={{ color: "hsl(var(--accent-1))" }}
                />
                <div>
                  <p className="text-sm text-card/70">お電話でのお問い合わせ</p>
                  <p className="font-bold">090-6120-2995</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail 
                  className="w-5 h-5 mt-0.5"
                  style={{ color: "hsl(var(--accent-3))" }}
                />
                <div>
                  <p className="text-sm text-card/70">メールでのお問い合わせ</p>
                  <p className="text-sm">info@colors-official.com</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock 
                  className="w-5 h-5 mt-0.5"
                  style={{ color: "hsl(var(--accent-5))" }}
                />
                <div>
                  <p className="text-sm text-card/70">営業時間</p>
                  <p className="text-sm">月〜金 9:00〜17:00</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-lg font-bold mb-6">アクセス</h3>
            <div className="flex items-start gap-3">
              <MapPin 
                className="w-5 h-5 mt-0.5"
                style={{ color: "hsl(var(--accent-6))" }}
              />
              <div>
                <p className="text-sm text-card/70 mb-2">本社所在地</p>
                <p className="text-sm leading-relaxed">
                  〒811-0202<br />
                  福岡県福岡市東区和白1丁目1番35号
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative">
        <GradientDivider thickness="thin" />
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-card/50">
            <p>© 2024 COLORS. All rights reserved.</p>
            <div className="flex gap-6">
              <Link 
                to="/privacy" 
                className="hover:text-card transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "hsl(var(--accent-2))";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "";
                }}
              >
                プライバシーポリシー
              </Link>
              <Link 
                to="/terms" 
                className="hover:text-card transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "hsl(var(--accent-4))";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "";
                }}
              >
                利用規約
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
