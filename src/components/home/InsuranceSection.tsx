import { Link } from "react-router-dom";
import { Shield, ChevronRight } from "lucide-react";

export const InsuranceSection = () => {
  return (
    <section className="bg-gradient-to-br from-teal to-teal/80 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-medium tracking-widest uppercase text-white/80">
              Insurance
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
              災害による被害、<br />火災保険で修繕できる可能性があります
            </h2>
            
            <p className="text-white/90 leading-relaxed mb-4">
              火災保険は、火災だけでなく、風災、雹・雪災・落雷など、元の状態に復旧するための保険です。
            </p>
            <p className="text-white/90 leading-relaxed mb-4">
              個人宅だけでなく、商業ビルや収益物件にも適用可能です。
            </p>
            <p className="text-white/90 leading-relaxed mb-8">
              被害調査は無料です。お気軽にご相談ください。
            </p>

            <Link
              to="/insurance"
              className="inline-flex items-center gap-2 bg-white text-teal px-8 py-4 rounded-full font-medium hover:bg-white/90 transition-colors"
            >
              詳しくみる
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 rounded-full bg-white/10 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-white/10 flex items-center justify-center">
                  <Shield className="w-24 h-24 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
