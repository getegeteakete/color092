import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Shield, Flame, Wind, CloudSnow, Zap, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const coverageTypes = [
  { icon: Flame, label: "火災" },
  { icon: Wind, label: "風災" },
  { icon: CloudSnow, label: "雹・雪災" },
  { icon: Zap, label: "落雷" },
];

const Insurance = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative py-24 bg-gradient-to-br from-teal to-teal/80 text-white overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
          </div>
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <span className="text-sm font-medium tracking-widest uppercase text-white/80">
                Insurance
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">
                災害による被害、<br />火災保険で修繕できる可能性があります
              </h1>
              <p className="text-white/90 text-lg">
                火災保険を活用して、修繕費用を抑えることができる可能性があります。
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6">
                  火災保険は「火災」だけじゃない！
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  火災保険は、火災だけでなく、風災、雹・雪災・落雷など、
                  さまざまな災害による被害を補償対象としています。
                  つまり、台風や強風による屋根の破損、雹による外壁の傷み、
                  落雷による設備の故障なども、火災保険で修繕できる可能性があります。
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  個人宅だけでなく、商業ビルや収益物件にも適用可能です。
                  被害調査は無料なので、お気軽にご相談ください！
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  {coverageTypes.map((type) => (
                    <div
                      key={type.label}
                      className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-xl"
                    >
                      <type.icon className="w-8 h-8 text-teal" />
                      <span className="text-sm font-medium">{type.label}</span>
                    </div>
                  ))}
                </div>

                <Link to="/contact" className="btn-gradient inline-flex items-center gap-2">
                  無料相談する
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex justify-center"
              >
                <div className="relative">
                  <div className="w-80 h-80 rounded-full bg-gradient-to-br from-teal/20 to-teal/10 flex items-center justify-center">
                    <div className="w-60 h-60 rounded-full bg-gradient-to-br from-teal/30 to-teal/20 flex items-center justify-center">
                      <Shield className="w-32 h-32 text-teal" />
                    </div>
                  </div>
                  {/* Floating Icons */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute -top-4 right-4 w-16 h-16 rounded-full bg-teal/20 flex items-center justify-center"
                  >
                    <Flame className="w-8 h-8 text-teal" />
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                    className="absolute bottom-4 -left-4 w-14 h-14 rounded-full bg-teal/20 flex items-center justify-center"
                  >
                    <Wind className="w-7 h-7 text-teal" />
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                    className="absolute top-1/2 -right-6 w-12 h-12 rounded-full bg-teal/20 flex items-center justify-center"
                  >
                    <CloudSnow className="w-6 h-6 text-teal" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Flow */}
        <section className="py-24 bg-section-gradient">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="section-label">Flow</span>
              <h2 className="section-title">保険申請の流れ</h2>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {[
                { step: "01", title: "無料調査", desc: "まずは無料で被害状況を調査いたします。" },
                { step: "02", title: "書類作成", desc: "保険申請に必要な書類を作成いたします。" },
                { step: "03", title: "保険会社へ申請", desc: "保険会社へ申請を行います。" },
                { step: "04", title: "保険金受領", desc: "審査が通れば保険金を受け取れます。" },
                { step: "05", title: "工事施工", desc: "保険金を使って修繕工事を行います。" },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 mb-8 last:mb-0"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-teal text-white flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                    {index < 4 && <div className="flex-1 w-0.5 bg-teal/30 mt-4" />}
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Insurance;
