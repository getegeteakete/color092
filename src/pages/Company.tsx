import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Users } from "lucide-react";
import heroPainting from "@/assets/hero-painting.jpg";

const companyInfo = [
  { label: "会社名", value: "株式会社COLORS" },
  { label: "代表者", value: "竹原 悟史" },
  { label: "電話番号", value: "090 6120 2995" },
  { label: "住所", value: "〒811-0202　福岡県福岡市東区和白1丁目1番35号" },
  { label: "事業内容", value: "塗装・リフォーム" },
];

const Company = () => {
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
              <span className="section-label">Company</span>
              <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">会社概要</h1>
              <p className="text-muted-foreground text-lg">
                COLORSは、お客様の「笑顔」を第一に考え、
                誠実で丁寧なサービスをお届けします。
              </p>
            </motion.div>
          </div>
        </section>

        {/* 代表の想い */}
        <section className="py-24 bg-card">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="section-label">Message</span>
              <h2 className="section-title">代表の想い</h2>
            </motion.div>
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <p className="text-muted-foreground leading-relaxed">
                  私たちの会社は、地元福岡で長年にわたり、塗装やリフォームを通じて多くのお客様の暮らしや仕事の環境を支えてきました。
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  建物や車は、ただの物ではなく、お客様の大切な財産です。
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  私たちは、その財産を守り、さらに価値を高めるために、誠心誠意を込めた仕事を続けています。
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  私たちが大切にしているのは、細部にまでこだわる職人の技と、お客様一人ひとりのご要望に寄り添う柔軟なプランニングです。単に塗装をするだけでなく、塗装後も長く安心していただけるような、心のこもったサービスを提供することを使命としています。
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  「地域に貢献し、皆様の暮らしをより良いものにしたい」という思いで、この地で活動を続けてきました。
                  これからも、皆様のご期待に応えられるよう、技術の向上とサービスの改善に努めてまいります。今後ともどうぞよろしくお願いいたします。
                </p>
                <div className="pt-6 text-right">
                  <p className="text-lg font-bold">竹原 悟史</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-br from-pink/20 to-accent/20 rounded-3xl transform rotate-2" />
                <img
                  src={heroPainting}
                  alt="COLORS チーム"
                  className="relative rounded-3xl shadow-xl w-full h-auto object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Company Info */}
        <section className="py-24 bg-section-gradient">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="section-label">Information</span>
              <h2 className="section-title">会社情報</h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto bg-card rounded-3xl shadow-lg overflow-hidden"
            >
              <table className="w-full">
                <tbody>
                  {companyInfo.map((item, index) => (
                    <tr
                      key={item.label}
                      className={index !== companyInfo.length - 1 ? "border-b border-border" : ""}
                    >
                      <th className="py-5 px-6 text-left text-sm font-medium text-muted-foreground bg-secondary/50 w-1/3">
                        {item.label}
                      </th>
                      <td className="py-5 px-6 text-sm">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

        {/* Access */}
        <section className="py-24 bg-card">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="section-label">Access</span>
              <h2 className="section-title">アクセス</h2>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-light to-orange-light flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">所在地</h3>
                    <p className="text-muted-foreground">
                      〒811-0202<br />
                      福岡県福岡市東区和白1丁目1番35号
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-light to-orange-light flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">お電話</h3>
                    <p className="text-muted-foreground">090-6120-2995</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-light to-orange-light flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">営業時間</h3>
                    <p className="text-muted-foreground">月〜金 9:00〜17:00</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl overflow-hidden shadow-lg h-80"
              >
                <iframe
                  src="https://www.google.com/maps?q=福岡県福岡市東区和白1丁目1番35号&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="株式会社COLORS 所在地"
                  className="w-full h-full"
                />
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Company;
