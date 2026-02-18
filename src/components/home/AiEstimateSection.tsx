import { Link } from "react-router-dom";
import { 
  Zap, 
  Camera, 
  Paintbrush, 
  Calendar,
  ChevronRight,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { RainbowRingCard } from "@/components/ui/rainbow-ring-card";
import { GradientDivider } from "@/components/ui/gradient-divider";

const featureCards = [
  {
    icon: Zap,
    title: "AI仮見積診断",
    description: "建物情報を入力するだけで、AIが自動で概算見積もりを算出します。",
  },
  {
    icon: Camera,
    title: "写真アップロード診断",
    description: "建物の写真をアップロードして、より正確な見積もりを取得できます。",
  },
  {
    icon: Paintbrush,
    title: "塗装・リフォームAI診断",
    description: "将来的に拡張予定の高度なAI診断機能です。",
    comingSoon: true,
  },
  {
    icon: Calendar,
    title: "現地調査／ZOOM相談予約",
    description: "現地調査やオンライン相談の予約を簡単に行えます。",
  },
];

const steps = [
  {
    number: "01",
    title: "AI仮見積スタート",
    description: "簡単な情報入力から始めます",
  },
  {
    number: "02",
    title: "建物情報入力",
    description: "建物の種類やサイズを入力",
  },
  {
    number: "03",
    title: "写真アップロード",
    description: "任意で写真をアップロード",
  },
  {
    number: "04",
    title: "概算見積確認",
    description: "AIが算出した概算を確認",
  },
  {
    number: "05",
    title: "現地調査 or ZOOM予約",
    description: "詳細な見積もりや相談を予約",
  },
];

export const AiEstimateSection = () => {
  return (
    <section id="ai-estimate-area" className="bg-card">
      <div className="container mx-auto px-4">
        {/* セクションタイトル */}
        <div className="text-center mb-16">
          <span className="section-label">AI Estimate</span>
          <h2 className="section-title mb-4">
            <span className="text-gradient">AI仮見積もり</span>・現地調査予約システム
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            お問い合わせ前に、まずはAIで概算を。<br />
            来店や訪問の手間を減らし、スムーズなご相談を実現します。
          </p>
        </div>

        {/* 機能紹介カード */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {featureCards.map((card, index) => {
            const accentIndex = index % 6;
            const accentNum = accentIndex + 1;
            return (
              <div key={card.title}>
                <RainbowRingCard className="card-padding shadow-lg">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{
                      background: `linear-gradient(135deg, hsl(var(--accent-${accentNum}-soft)), hsl(var(--accent-${accentNum})))`,
                    }}
                  >
                    <card.icon 
                      className="w-7 h-7"
                      style={{
                        color: `hsl(var(--accent-${accentNum}))`,
                      }}
                    />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {card.description}
                  </p>
                  {card.comingSoon && (
                    <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      準備中
                    </span>
                  )}
                </RainbowRingCard>
              </div>
            );
          })}
        </div>

        {/* 利用の流れ（STEP UI） */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center mb-12">利用の流れ</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
            {steps.map((step, index) => (
              <div key={step.number} className="contents">
                <div className="w-full md:w-auto">
                  <div className="bg-card rounded-2xl p-6 shadow-md border border-border text-center h-full">
                    <div 
                      className="inline-flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold text-white mb-4 mx-auto"
                      style={{
                        background: `linear-gradient(135deg, hsl(var(--accent-${(index % 6) + 1})), hsl(var(--accent-${(index % 6) + 1}-gradient)))`,
                      }}
                    >
                      {step.number}
                    </div>
                    <h4 className="text-base font-bold mb-2">{step.title}</h4>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {/* 矢印（最後以外、PC表示のみ） */}
                {index < steps.length - 1 && (
                  <ArrowRight 
                    className="hidden md:block w-6 h-6 flex-shrink-0 mx-2"
                    style={{
                      color: `hsl(var(--accent-${(index % 6) + 1}))`,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTAエリア */}
        <div className="text-center mb-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/estimate"
              className="inline-flex items-center gap-2 btn-gradient px-8 py-4"
            >
              AI仮見積もりを試す
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              to="/reservation"
              className="inline-flex items-center gap-2 bg-white text-primary border-2 border-primary px-8 py-4 rounded-full font-medium hover:bg-primary hover:text-white transition-colors"
            >
              現地調査・ZOOM相談を予約する
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="mt-4">
            <Link
              to="/lp/ai-estimate"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
            >
              営業用LPページを見る
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 注意文 */}
        <div className="text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 
                className="w-4 h-4"
                style={{ color: "hsl(var(--accent-1))" }}
              />
              <span>無料で利用可能</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 
                className="w-4 h-4"
                style={{ color: "hsl(var(--accent-3))" }}
              />
              <span>しつこい営業なし</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 
                className="w-4 h-4"
                style={{ color: "hsl(var(--accent-5))" }}
              />
              <span>仮見積は目安です</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
