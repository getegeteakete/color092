import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "お問い合わせを受け付けました",
      description: "担当者より折り返しご連絡いたします。",
    });

    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

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
              <span className="section-label">Contact</span>
              <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">お問い合わせ</h1>
              <p className="text-muted-foreground text-lg">
                塗装・リフォームに関するご相談、お見積もりは無料です。
                お気軽にお問い合わせください。
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold mb-8">お問い合わせ先</h2>

                <div className="space-y-6 mb-12">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-light to-orange-light flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">お電話でのお問い合わせ</h3>
                      <p className="text-2xl font-bold text-primary">0120-XXX-XXX</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        受付時間：9:00〜18:00（日祝定休）
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-light to-orange-light flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">メールでのお問い合わせ</h3>
                      <p className="text-muted-foreground">info@colors-official.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-light to-orange-light flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">所在地</h3>
                      <p className="text-muted-foreground">
                        〒812-0000<br />
                        福岡県福岡市博多区XX町X-X-X XXビル 3F
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-light to-orange-light flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">営業時間</h3>
                      <p className="text-muted-foreground">9:00〜18:00（日祝定休）</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="bg-secondary/50 rounded-3xl p-8">
                  <h2 className="text-2xl font-bold mb-6">お問い合わせフォーム</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          お名前 <span className="text-destructive">*</span>
                        </label>
                        <Input
                          id="name"
                          name="name"
                          required
                          placeholder="山田 太郎"
                          className="bg-card"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">
                          電話番号 <span className="text-destructive">*</span>
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          placeholder="090-1234-5678"
                          className="bg-card"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        メールアドレス <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="example@email.com"
                        className="bg-card"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        お問い合わせ内容
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        className="w-full h-10 px-3 rounded-lg border border-input bg-card text-sm"
                      >
                        <option value="">選択してください</option>
                        <option value="estimate">お見積もり依頼</option>
                        <option value="consultation">ご相談</option>
                        <option value="insurance">災害保険について</option>
                        <option value="other">その他</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        メッセージ <span className="text-destructive">*</span>
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        placeholder="お問い合わせ内容をご記入ください"
                        className="bg-card"
                      />
                    </div>

                    <p className="text-sm text-muted-foreground">
                      <a href="/privacy" className="text-primary hover:underline">
                        プライバシーポリシー
                      </a>
                      に同意の上、送信してください。
                    </p>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-gradient"
                    >
                      {isSubmitting ? (
                        "送信中..."
                      ) : (
                        <>
                          送信する
                          <Send className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
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

export default Contact;
