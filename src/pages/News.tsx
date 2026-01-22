import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const newsItems = [
  {
    id: 13,
    date: "2024.10.08",
    category: "お知らせ",
    title: "ホームページをリニューアルしました",
    excerpt: "この度、COLORSのホームページをリニューアルいたしました。より見やすく、使いやすいサイトを目指してまいります。",
  },
  {
    id: 12,
    date: "2024.10.08",
    category: "お知らせ",
    title: "スマートフォンから閲覧可能になりました",
    excerpt: "スマートフォンやタブレットからも快適にご覧いただけるよう、レスポンシブデザインに対応いたしました。",
  },
  {
    id: 11,
    date: "2024.10.08",
    category: "お知らせ",
    title: "施工事例ページを更新しました",
    excerpt: "最新の施工事例を追加いたしました。塗装・リフォームをご検討の方はぜひご覧ください。",
  },
];

const News = () => {
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
              <span className="section-label">News</span>
              <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">お知らせ</h1>
              <p className="text-muted-foreground text-lg">
                COLORSからのお知らせや最新情報をお届けします。
              </p>
            </motion.div>
          </div>
        </section>

        {/* News List */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              {newsItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/news/${item.id}`}
                    className="group block bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex items-center gap-4 md:w-48 flex-shrink-0">
                        <time className="text-lg font-bold text-primary">
                          {item.date.split(".")[0]}
                          <span className="text-sm">.{item.date.split(".").slice(1).join(".")}</span>
                        </time>
                        <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </h2>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {item.excerpt}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 hidden md:block" />
                    </div>
                  </Link>
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

export default News;
