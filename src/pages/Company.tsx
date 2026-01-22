import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Users } from "lucide-react";
import heroPainting from "@/assets/hero-painting.jpg";

const companyInfo = [
  { label: "会社名", value: "株式会社 COLORS" },
  { label: "代表者", value: "代表取締役 山田 太郎" },
  { label: "設立", value: "2014年4月" },
  { label: "資本金", value: "1,000万円" },
  { label: "従業員数", value: "15名" },
  { label: "所在地", value: "〒812-0000 福岡県福岡市博多区XX町X-X-X XXビル 3F" },
  { label: "電話番号", value: "0120-XXX-XXX" },
  { label: "営業時間", value: "9:00〜18:00（日祝定休）" },
  { label: "事業内容", value: "塗装工事、リフォーム工事、防水工事、解体工事" },
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

        {/* Vision */}
        <section className="py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6">
                  塗り広げるのは
                  <br />
                  <span className="text-gradient">お客様の笑える未来です。</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  私たちCOLORSは、単なる塗装・リフォーム会社ではありません。
                  お客様の大切な住まいや店舗を、心を込めて美しく蘇らせることで、
                  そこで過ごす時間をより豊かに、より笑顔あふれるものにしたい。
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  その想いを胸に、一つひとつの現場に真摯に向き合い、
                  確かな技術と丁寧な仕事で、お客様の期待を超える仕上がりをお届けします。
                </p>
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
                      〒812-0000<br />
                      福岡県福岡市博多区XX町X-X-X XXビル 3F
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-light to-orange-light flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">お電話</h3>
                    <p className="text-muted-foreground">0120-XXX-XXX</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-light to-orange-light flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">営業時間</h3>
                    <p className="text-muted-foreground">9:00〜18:00（日祝定休）</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-muted rounded-3xl h-80 flex items-center justify-center"
              >
                <p className="text-muted-foreground">Google Map</p>
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
