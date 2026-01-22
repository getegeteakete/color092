import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ChevronRight } from "lucide-react";

export const InsuranceSection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-teal to-teal/80 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-medium tracking-widest uppercase text-white/80">
              Insurance
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
              その工事、災害保険を<br />使えるかも！
            </h2>
            
            <p className="text-white/90 leading-relaxed mb-4">
              火災保険は、火災だけでなく、風災、雹・雪災・落雷など、元の状態にするための保険です。
            </p>
            <p className="text-white/90 leading-relaxed mb-4">
              個人宅だけでなく、商業ビルや収益物件にも適用可能です。
            </p>
            <p className="text-white/90 leading-relaxed mb-8">
              被害調査は無料なのでお気軽にご相談ください！
            </p>

            <Link
              to="/insurance"
              className="inline-flex items-center gap-2 bg-white text-teal px-8 py-4 rounded-full font-medium hover:bg-white/90 transition-colors"
            >
              詳しくみる
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-64 h-64 rounded-full bg-white/10 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-white/10 flex items-center justify-center">
                  <Shield className="w-24 h-24 text-white" />
                </div>
              </div>
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"
              >
                <span className="text-2xl">🔥</span>
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"
              >
                <span className="text-2xl">💨</span>
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                className="absolute top-1/2 -right-8 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"
              >
                <span className="text-xl">❄️</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
