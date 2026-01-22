import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Camera,
  Video,
  Calendar,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  X,
  TrendingUp,
  Clock,
  MapPin,
  Shield,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";

const problems = [
  {
    icon: AlertCircle,
    title: "問い合わせが多い",
    description: "電話やメールでの問い合わせが多く、対応に時間がかかる",
  },
  {
    icon: X,
    title: "現地調査が無駄になる",
    description: "金額が合わず、せっかくの現地調査が無駄になってしまう",
  },
  {
    icon: TrendingUp,
    title: "金額の目安がわからず不安",
    description: "見積もり前に費用がわからず、相談を躊躇してしまう",
  },
];

const solutions = [
  {
    icon: Sparkles,
    title: "AI仮見積",
    description: "建物情報を入力するだけで、AIが自動で概算見積もりを算出",
  },
  {
    icon: Camera,
    title: "写真診断",
    description: "写真をアップロードして、より正確な見積もりを取得",
  },
  {
    icon: Video,
    title: "Zoom相談",
    description: "オンラインで気軽に相談。来店の手間が不要",
  },
  {
    icon: Calendar,
    title: "自動予約",
    description: "見積もり完了後、すぐに予約まで完結",
  },
];

const flowSteps = [
  {
    number: "01",
    title: "仮見積",
    description: "AIで概算金額を算出",
  },
  {
    number: "02",
    title: "写真送信",
    description: "任意で写真をアップロード",
  },
  {
    number: "03",
    title: "金額確認",
    description: "概算見積もりを確認",
  },
  {
    number: "04",
    title: "予約",
    description: "現地調査またはZoom相談を予約",
  },
  {
    number: "05",
    title: "本見積",
    description: "現地調査後に正式見積もり",
  },
];

const trustFactors = [
  {
    icon: CheckCircle2,
    title: "無料",
    description: "AI仮見積もりは完全無料",
  },
  {
    icon: Shield,
    title: "営業なし",
    description: "しつこい営業は一切ありません",
  },
  {
    icon: MapPin,
    title: "地元密着",
    description: "福岡県で長年実績",
  },
  {
    icon: Award,
    title: "実績",
    description: "多くのお客様にご利用いただいています",
  },
];

const LpAiEstimate = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* ヒーロー */}
      <section className="relative min-h-screen flex items-center bg-hero-gradient overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-pink/10 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              AIで仮見積。
              <br />
              <span className="text-gradient">来店前に費用がわかる</span>
              <br />
              新しいリフォーム相談
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              現地調査の前に、概算金額と相談予約まで完結。
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link to="/estimate" className="btn-gradient inline-flex items-center gap-2 text-lg px-10 py-6">
                AI仮見積を試す
                <ChevronRight className="w-6 h-6" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 課題提示 */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="section-label">Problem</span>
            <h2 className="section-title mb-4">こんなお悩みありませんか？</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {problems.map((problem, index) => {
              const Icon = problem.icon;
              return (
                <motion.div
                  key={problem.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-3xl p-8 shadow-lg border border-border text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-light to-orange-light flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{problem.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {problem.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 解決策 */}
      <section className="py-24 bg-hero-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="section-label">Solution</span>
            <h2 className="section-title mb-4">AI仮見積システムで解決</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              来店や訪問の手間を減らし、スムーズなご相談を実現します
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {solutions.map((solution, index) => {
              const Icon = solution.icon;
              return (
                <motion.div
                  key={solution.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-card rounded-3xl p-6 shadow-lg card-hover border border-border"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-light to-orange-light flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{solution.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {solution.description}
                  </p>
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 利用の流れ */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="section-label">Flow</span>
            <h2 className="section-title mb-4">利用の流れ</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              簡単5ステップで、仮見積から予約まで完結
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
              {flowSteps.map((step, index) => (
                <div key={step.number} className="contents">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="w-full md:w-auto"
                  >
                    <div className="bg-card rounded-2xl p-6 shadow-md border border-border text-center h-full">
                      <div className="number-badge mb-4 mx-auto">{step.number}</div>
                      <h4 className="text-base font-bold mb-2">{step.title}</h4>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </motion.div>
                  {index < flowSteps.length - 1 && (
                    <ArrowRight className="hidden md:block w-6 h-6 text-primary flex-shrink-0 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 安心要素 */}
      <section className="py-24 bg-hero-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="section-label">Trust</span>
            <h2 className="section-title mb-4">安心してご利用ください</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {trustFactors.map((factor, index) => {
              const Icon = factor.icon;
              return (
                <motion.div
                  key={factor.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-3xl p-6 shadow-lg border border-border text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-light to-orange-light flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{factor.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {factor.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-pink via-primary to-accent text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              まずは無料で仮見積もりを試してみませんか？
            </h2>
            <p className="text-white/90 text-lg mb-8 leading-relaxed">
              AIが自動で概算見積もりを算出します。
              <br />
              来店や訪問の手間を減らし、スムーズなご相談を実現します。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/estimate"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary px-10 py-6 rounded-full font-medium hover:bg-white/90 transition-colors text-lg"
              >
                <Sparkles className="w-6 h-6" />
                無料で仮見積を試す
              </Link>
              <Link
                to="/reservation"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border-2 border-white/30 px-10 py-6 rounded-full font-medium hover:bg-white/20 transition-colors text-lg"
              >
                <Calendar className="w-6 h-6" />
                相談予約する
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>無料で利用可能</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>しつこい営業なし</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>仮見積は目安です</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* フッター（簡易版） */}
      <footer className="bg-foreground text-card py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img
              src="/rogo.png"
              alt="COLORS ロゴ"
              className="h-10 w-auto object-contain"
            />
          </div>
          <p className="text-card/70 text-sm mb-4">
            福岡県を拠点に、塗装を中心としたリフォームサービスを提供
          </p>
          <p className="text-card/50 text-xs">
            © 2024 COLORS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LpAiEstimate;
