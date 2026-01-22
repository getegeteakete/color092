import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Paintbrush, Hammer, Home, Car, Building, Wrench } from "lucide-react";
import paintingWork from "@/assets/painting-work.jpg";
import reformInterior from "@/assets/reform-interior.jpg";

const services = [
  {
    id: "coating",
    icon: Paintbrush,
    title: "塗装",
    description:
      "住宅や施設の外壁・内装から車体塗装まで幅広く対応しています。建物や車体の素材やデザインに合わせた最適なプランをご提案し、プロの職人が細部まで丁寧に施工します。お客様の大切な空間や車をリフレッシュしませんか？",
    image: paintingWork,
    subServices: [
      { icon: Home, label: "住宅外壁塗装" },
      { icon: Building, label: "店舗・施設塗装" },
      { icon: Car, label: "車体塗装" },
      { icon: Wrench, label: "屋根塗装" },
    ],
  },
  {
    id: "reform",
    icon: Hammer,
    title: "リフォーム",
    description:
      "内装・外装問わず、お客様のご要望やスタイルに合わせた最適なプランをご提案し、使い勝手やデザイン性を向上させるリフォームを行っています。古くなった設備の交換から、間取りの変更、外観のリニューアルまで幅広く対応可能です。",
    image: reformInterior,
    subServices: [
      { icon: Home, label: "内装リフォーム" },
      { icon: Building, label: "外装リフォーム" },
      { icon: Wrench, label: "設備交換" },
      { icon: Hammer, label: "解体工事" },
    ],
  },
];

const Service = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative py-24 bg-hero-gradient overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-pink/10 blur-3xl" />
          </div>
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <span className="section-label">Service</span>
              <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">事業内容</h1>
              <p className="text-muted-foreground text-lg">
                塗装からリフォームまで、住まいと暮らしを
                トータルでサポートいたします。
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services */}
        <section className="py-24 bg-card">
          <div className="container mx-auto px-4 space-y-32">
            {services.map((service, index) => (
              <div key={service.id} id={`service-${service.id}`}>
                <div
                  className={`grid lg:grid-cols-2 gap-16 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Image */}
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className={index % 2 === 1 ? "lg:order-2" : ""}
                  >
                    <div className="relative">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${
                          index % 2 === 0
                            ? "from-pink/20 to-transparent"
                            : "from-accent/20 to-transparent"
                        } rounded-3xl transform ${
                          index % 2 === 0 ? "-rotate-3" : "rotate-3"
                        }`}
                      />
                      <img
                        src={service.image}
                        alt={service.title}
                        className="relative rounded-3xl shadow-xl w-full h-auto object-cover"
                      />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className={index % 2 === 1 ? "lg:order-1" : ""}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink to-accent flex items-center justify-center">
                        <service.icon className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold">{service.title}</h2>
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-8">
                      {service.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      {service.subServices.map((sub) => (
                        <div
                          key={sub.label}
                          className="flex items-center gap-3 p-4 bg-secondary rounded-xl"
                        >
                          <sub.icon className="w-5 h-5 text-primary" />
                          <span className="text-sm font-medium">{sub.label}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="py-24 bg-section-gradient">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="section-label">Flow</span>
              <h2 className="section-title">ご依頼の流れ</h2>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {[
                { step: "01", title: "お問い合わせ", desc: "まずはお電話またはお問い合わせフォームよりご連絡ください。" },
                { step: "02", title: "現地調査・お見積もり", desc: "専門スタッフが現地にお伺いし、詳細な調査とお見積もりをいたします。" },
                { step: "03", title: "ご契約", desc: "お見積もり内容にご納得いただけましたら、ご契約となります。" },
                { step: "04", title: "施工", desc: "プロの職人が丁寧に施工いたします。" },
                { step: "05", title: "完了・アフターサポート", desc: "施工完了後も、長期的なサポート体制で安心をお届けします。" },
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
                    <div className="number-badge">{item.step}</div>
                    {index < 4 && <div className="flex-1 w-0.5 bg-gradient-to-b from-pink to-accent mt-4" />}
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

export default Service;
