import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const Terms = () => {
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
              <span className="section-label">Terms</span>
              <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">利用規約</h1>
              <p className="text-muted-foreground text-lg">
                本規約は、株式会社COLORS（以下「当社」）が提供するサービス（以下「本サービス」）の利用条件を定めるものです。
                本サービスをご利用いただく際は、本規約に同意いただいたものとみなします。
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
                      <FileText className="w-6 h-6 text-primary" />
                      第1条（適用）
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      本規約は、当社が提供する本サービスの利用に関する条件を定めるものです。本サービスを利用することにより、利用者は本規約に同意したものとみなされます。
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-primary" />
                      第2条（定義）
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      本規約において、次の各号に掲げる用語の意義は、当該各号に定めるところによります。
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>「本サービス」とは、当社が提供する塗装・リフォームに関するサービス、AI仮見積もりサービス、予約サービス等をいいます。</li>
                      <li>「利用者」とは、本サービスを利用する個人または法人をいいます。</li>
                      <li>「当社」とは、株式会社COLORSをいいます。</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-primary" />
                      第3条（AI仮見積もりについて）
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      本サービスで提供するAI仮見積もりは、入力いただいた情報に基づく概算見積もりであり、実際の見積もり金額とは異なる場合があります。
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>AI仮見積もりは無料でご利用いただけます。</li>
                      <li>AI仮見積もりの結果は目安であり、正式な見積もりではありません。</li>
                      <li>正式な見積もりは、現地調査後に確定いたします。</li>
                      <li>当社は、AI仮見積もりの結果について一切の責任を負いません。</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-primary" />
                      第4条（予約について）
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      本サービスを通じて予約いただいた現地調査やZoom相談について、以下の事項を定めます。
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>予約確定後、当社より確認のご連絡をさせていただきます。</li>
                      <li>予約の変更・キャンセルは、お電話（090-6120-2995）までご連絡ください。</li>
                      <li>Zoomオンライン相談の場合、予約確定後にミーティングURLをお送りします。</li>
                      <li>無断キャンセルや連絡なしの不参加は、今後のご利用に影響する場合があります。</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-primary" />
                      第5条（禁止事項）
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      利用者は、本サービスの利用にあたり、以下の行為を行ってはなりません。
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>虚偽の情報を入力する行為</li>
                      <li>法令または公序良俗に違反する行為</li>
                      <li>犯罪行為に関連する行為</li>
                      <li>当社または第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                      <li>本サービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
                      <li>その他、当社が不適切と判断する行為</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-primary" />
                      第6条（本サービスの提供の停止等）
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      当社は、以下のいずれかの事由があると判断した場合、利用者に事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-4">
                      <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                      <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
                      <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                      <li>その他、当社が本サービスの提供が困難と判断した場合</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-primary" />
                      第7条（保証の否認および免責）
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      当社は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      当社は、本サービスに起因して利用者に生じたあらゆる損害について一切の責任を負いません。ただし、本サービスに関する当社と利用者との間の契約（本規約を含みます。）が消費者契約法に定める消費者契約となる場合、この免責規定は適用されません。
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-primary" />
                      第8条（サービス内容の変更等）
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      当社は、利用者に通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによって利用者に生じた損害について一切の責任を負いません。
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-primary" />
                      第9条（利用規約の変更）
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      当社は、必要と判断した場合には、利用者に通知することなくいつでも本規約を変更することができるものとします。なお、本規約の変更後、本サービスの利用を開始した場合には、当該利用者に対して変更後の規約が適用されるものとします。
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-primary" />
                      第10条（準拠法・裁判管轄）
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      本規約の解釈にあたっては、日本法を準拠法とします。
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-primary" />
                      お問い合わせ
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      本規約に関するお問い合わせは、下記までご連絡ください。
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

export default Terms;
