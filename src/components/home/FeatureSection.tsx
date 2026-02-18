import { RainbowRingCard } from "@/components/ui/rainbow-ring-card";

const features = [
  {
    number: "01",
    title: "オーダーメイドの提案",
    description:
      "私たちはお客様一人ひとりのニーズに合わせたオーダーメイドのリフォームプランをご提案します。生活スタイルや予算に応じた最適なプランを提供し、デザイン性と機能性を兼ね備えた空間を実現します。",
  },
  {
    number: "02",
    title: "幅広い対応力",
    description:
      "内装・外装のリフォームから、設備の交換、間取りの変更まで、幅広い施工に対応可能です。住宅だけでなく、店舗や施設のリフォームにも対応し、さまざまなニーズにお応えします。",
  },
  {
    number: "03",
    title: "安心のアフターサポート",
    description:
      "施工が完了した後も、長期的にお客様の安心をサポートいたします。定期的なメンテナンスやアフターケアを行い、長く快適にお過ごしいただけるようサポート体制を整えています。",
  },
];

export const FeatureSection = () => {
  return (
    <section className="bg-hero-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-16">
          <span className="section-label">Feature</span>
          <h2 className="section-title">
            <span className="text-gradient">COLORS</span>の特徴
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-8">
          {features.map((feature, index) => (
            <div key={feature.number}>
              <RainbowRingCard className="card-padding shadow-lg">
                {/* コンテンツラッパー - z-indexで前面に */}
                <div className="relative z-10">
                  {/* Number Badge - 色分け */}
                  <div 
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold text-white mb-6"
                    style={{
                      background: `linear-gradient(135deg, hsl(var(--accent-${index + 1})), hsl(var(--accent-${index + 1}-gradient)))`,
                    }}
                  >
                    {feature.number}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Effect - 多色グロウ（背景レイヤー） */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-0"
                  style={{
                    background: `linear-gradient(135deg, hsl(var(--accent-${index + 1}-soft)), hsl(var(--accent-${(index + 1) % 6 + 1}-soft)))`,
                  }}
                />
              </RainbowRingCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
