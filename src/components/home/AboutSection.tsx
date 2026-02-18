import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import paintingWork from "@/assets/painting-work.jpg";

export const AboutSection = () => {
  return (
    <section className="bg-section-gradient overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="absolute -top-8 -left-8 w-full h-full bg-gradient-to-br from-pink/30 to-accent/30 rounded-3xl" />
            <img
              src={paintingWork}
              alt="塗装作業"
              className="relative rounded-3xl shadow-xl w-full h-auto object-cover"
            />
            {/* Decorative Elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br from-pink to-accent opacity-50" />
          </div>

          {/* Content */}
          <div>
            <span className="section-label">About us</span>
            <h2 className="section-title mb-6">COLORSについて</h2>
            
            <p className="text-muted-foreground leading-relaxed mb-6">
              私たちは福岡県を拠点に、塗装を中心としたリフォームサービスを提供する専門会社です。
              地域に密着し、多くのお客様の信頼を得ながら、住宅や店舗の外壁・内装の塗装をはじめとする幅広いサービスを展開しています。
            </p>
            
            <p className="text-muted-foreground leading-relaxed mb-8">
              お客様一人ひとりのニーズに寄り添い、最適なプランをご提案。
              確かな技術と丁寧な施工で、お客様の大切な空間を美しく蘇らせます。
            </p>

            <Link
              to="/company"
              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
            >
              詳しくみる
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
