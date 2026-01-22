import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const Privacy = () => {
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
              <span className="section-label">Privacy</span>
              <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">プライバシーポリシー</h1>
              <p className="text-muted-foreground text-lg">
                株式会社COLORS（以下「当社」）は、お客様の個人情報の保護を重要な責務と認識し、
                個人情報の保護に関する法律（個人情報保護法）を遵守し、適切に取り扱います。
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="prose prose-slate max-w-none"
              >
                <div className="bg-card rounded-3xl p-8 md:p-12 shadow-lg border border-border space-y-8">
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Shield className="w-6 h-6 text-primary" />
                      1. 個人情報の取得について
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      当社は、以下の場合に個人情報を取得いたします。
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>お問い合わせフォームからのお問い合わせ時</li>
                      <li>AI仮見積もりフォームの入力時</li>
                      <li>予約フォームの入力時</li>
                      <li>電話やメールでのお問い合わせ時</li>
                      <li>現地調査やサービス提供時</li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      取得する個人情報の種類には、氏名、住所、電話番号、メールアドレス、建物情報、写真等が含まれます。
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Shield className="w-6 h-6 text-primary" />
                      2. 個人情報の利用目的
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      当社は、取得した個人情報を以下の目的で利用いたします。
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>お見積もりの作成およびご提案</li>
                      <li>施工・サービスの提供</li>
                      <li>お問い合わせへの対応</li>
                      <li>予約の管理および確認連絡</li>
                      <li>サービス改善のための分析</li>
                      <li>新サービス・キャンペーン等のご案内（同意いただいた場合）</li>
                      <li>法令に基づく対応</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Shield className="w-6 h-6 text-primary" />
                      3. 個人情報の管理
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      当社は、個人情報の正確性を保ち、これを安全に管理するため、セキュリティシステムの維持・管理体制の整備・社員教育の徹底等の必要な措置を講じ、個人情報の紛失、破壊、改ざん及び漏洩などのリスクに対して、適切なセキュリティ対策を実施します。
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Shield className="w-6 h-6 text-primary" />
                      4. 個人情報の第三者提供
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      当社は、お客様よりお預かりした個人情報を適切に管理し、次のいずれかに該当する場合を除き、個人情報を第三者に開示いたしません。
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>お客様の同意がある場合</li>
                      <li>法令に基づき開示することが必要である場合</li>
                      <li>人の生命、身体又は財産の保護のために必要がある場合</li>
                      <li>業務委託先への提供（必要な範囲内で、適切な管理を徹底）</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Shield className="w-6 h-6 text-primary" />
                      5. 個人情報の開示・訂正・削除
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      お客様ご本人から、個人情報の開示・訂正・削除のご請求があった場合、ご本人であることを確認させていただいた上で、速やかに対応いたします。
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      個人情報の開示・訂正・削除のご請求は、下記のお問い合わせ先までご連絡ください。
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Shield className="w-6 h-6 text-primary" />
                      6. Cookie（クッキー）について
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      当社のウェブサイトでは、サービス向上のためCookieを使用する場合があります。Cookieは、お客様のコンピュータに保存される小さなテキストファイルです。お客様はブラウザの設定により、Cookieの使用を拒否することができます。
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Shield className="w-6 h-6 text-primary" />
                      7. プライバシーポリシーの変更
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      当社は、必要に応じて、このプライバシーポリシーの内容を変更することがあります。変更後のプライバシーポリシーは、当社ウェブサイトに掲載した時点で効力を生じるものとします。
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Shield className="w-6 h-6 text-primary" />
                      8. お問い合わせ
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      個人情報の取り扱いに関するお問い合わせは、下記までご連絡ください。
                    </p>
                    <div className="bg-secondary/50 rounded-lg p-6 space-y-2">
                      <p className="font-bold">株式会社COLORS</p>
                      <p className="text-sm text-muted-foreground">代表者：竹原 悟史</p>
                      <p className="text-sm text-muted-foreground">〒811-0202　福岡県福岡市東区和白1丁目1番35号</p>
                      <p className="text-sm text-muted-foreground">電話番号：090-6120-2995</p>
                      <p className="text-sm text-muted-foreground">受付時間：月〜金 9:00〜17:00</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <p className="text-sm text-muted-foreground text-right">
                      制定日：2024年1月1日<br />
                      最終改定日：2024年1月1日
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
