import { motion } from "framer-motion";

const features = [
  {
    number: "01",
    icon: Sparkles,
    title: "オーダーメイドの提案",
    description:
      "私たちはお客様一人ひとりのニーズに合わせたオーダーメイドのリフォームプランをご提案します。生活スタイルや予算に応じた最適なプランを提供し、デザイン性と機能性を兼ね備えた空間を実現します。",
  },
  {
    number: "02",
    icon: Layers,
    title: "幅広い対応力",
    description:
      "内装・外装のリフォームから、設備の交換、間取りの変更まで、幅広い施工に対応可能です。住宅だけでなく、店舗や施設のリフォームにも対応し、さまざまなニーズにお応えします。",
  },
  {
    number: "03",
    icon: HeartHandshake,
    title: "安心のアフターサポート",
    description:
      "施工が完了した後も、長期的にお客様の安心をサポートいたします。定期的なメンテナンスやアフターケアを行い、長く快適にお過ごしいただけるようサポート体制を整えています。",
  },
];

export const FeatureSection = () => {
  return (
    <section className="pt-8 md:pt-24 pb-12 md:pb-24 bg-hero-gradient">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-16"
        >
          <span className="section-label">Feature</span>
          <h2 className="section-title">COLORSの特徴</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-card rounded-3xl p-6 md:p-8 shadow-lg card-hover"
            >
              {/* Number Badge */}
              <div className="number-badge mb-6">{feature.number}</div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
