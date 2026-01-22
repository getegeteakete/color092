import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from "lucide-react";

const navLinks = [
  { label: "HOME", path: "/" },
  { label: "施工実績", path: "/works" },
  { label: "事業内容", path: "/service" },
  { label: "お知らせ", path: "/news" },
  { label: "災害保険", path: "/insurance" },
  { label: "会社概要", path: "/company" },
  { label: "お問い合わせ", path: "/contact" },
];

export const Footer = () => {
  return (
    <footer className="bg-foreground text-card">
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pink via-primary to-accent py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            まずはお気軽にご相談ください
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            お見積もりは無料です。お客様のご状況に合わせた最適なご提案をさせていただきます。
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-medium hover:bg-white/90 transition-colors"
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
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink to-accent flex items-center justify-center">
                <span className="text-lg font-bold text-white">C</span>
              </div>
              <span className="text-xl font-bold">COLORS</span>
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
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-card/70 hover:text-card transition-colors text-sm"
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
                <Phone className="w-5 h-5 mt-0.5 text-pink" />
                <div>
                  <p className="text-sm text-card/70">お電話でのお問い合わせ</p>
                  <p className="font-bold">0120-XXX-XXX</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5 text-pink" />
                <div>
                  <p className="text-sm text-card/70">メールでのお問い合わせ</p>
                  <p className="text-sm">info@colors-official.com</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-0.5 text-pink" />
                <div>
                  <p className="text-sm text-card/70">営業時間</p>
                  <p className="text-sm">9:00〜18:00（日祝定休）</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-lg font-bold mb-6">アクセス</h3>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-0.5 text-pink" />
              <div>
                <p className="text-sm text-card/70 mb-2">本社所在地</p>
                <p className="text-sm leading-relaxed">
                  〒812-0000<br />
                  福岡県福岡市博多区XX町X-X-X<br />
                  XXビル 3F
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-card/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-card/50">
            <p>© 2024 COLORS. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-card transition-colors">
                プライバシーポリシー
              </Link>
              <Link to="/terms" className="hover:text-card transition-colors">
                利用規約
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
