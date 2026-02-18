import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, ChevronDown } from "lucide-react";
import heroPainting from "@/assets/hero-painting.jpg";
import { ColorGlow } from "@/components/ui/color-glow";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-hero-gradient overflow-hidden">
      {/* Background Decorations - 多色グロウ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <ColorGlow intensity="light" size="xl" className="top-0 left-0" />
        <ColorGlow intensity="light" size="lg" className="bottom-0 right-0" />
      </div>

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              塗り広げるのは <span className="text-gradient">お客様の笑える未来です。</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-4">
              福岡県の塗装のことなら私たちCOLORSにお任せください。
            </p>
            <p className="text-muted-foreground mb-4">
              お客様のご状況に合わせた最適なご提案をさせていただきます。
            </p>
            <p className="text-muted-foreground mb-8">
              まずはお気軽にご相談ください。
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="btn-gradient inline-flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                お問い合わせ
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                to="/works"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 font-medium transition-all hover:scale-105"
                style={{
                  borderColor: "hsl(var(--accent-4))",
                  color: "hsl(var(--accent-4))",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "hsl(var(--accent-4))";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "hsl(var(--accent-4))";
                }}
              >
                施工実績を見る
              </Link>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-3xl transform rotate-3 opacity-30"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--accent-1) / 0.2), hsl(var(--accent-3) / 0.2), hsl(var(--accent-5) / 0.2))",
                }}
              />
              <img
                src={heroPainting}
                alt="COLORS 塗装作業風景"
                className="relative rounded-3xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs tracking-widest">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
};
