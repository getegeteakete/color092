import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, ChevronDown } from "lucide-react";
import heroPainting from "@/assets/hero-painting.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-hero-gradient overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-pink/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              塗り広げるのは
              <br />
              <span className="text-gradient">お客様の笑える未来です。</span>
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
              <Link to="/contact" className="btn-gradient inline-flex items-center justify-center gap-2">
                お問い合わせ
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                to="/works"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-primary text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
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
              <div className="absolute inset-0 bg-gradient-to-br from-pink/20 to-accent/20 rounded-3xl transform rotate-3" />
              <img
                src={heroPainting}
                alt="COLORS 塗装作業風景"
                className="relative rounded-3xl shadow-2xl w-full h-auto object-cover"
              />
              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute -bottom-6 -left-6 bg-card rounded-2xl shadow-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink to-accent flex items-center justify-center">
                    <span className="text-white font-bold text-lg">10+</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">実績年数</p>
                    <p className="font-bold text-foreground">年以上の経験</p>
                  </div>
                </div>
              </motion.div>
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
