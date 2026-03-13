import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { ChevronRight } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  published_at: string | null;
  created_at: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  "お知らせ":     "bg-secondary text-secondary-foreground",
  "キャンペーン": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  "メディア":     "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
};

const News = () => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from("news")
          .select("id, title, category, excerpt, published_at, created_at")
          .eq("published", true)
          .order("published_at", { ascending: false });
        setItems(data ?? []);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
              <span className="section-label">News</span>
              <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">お知らせ</h1>
              <p className="text-muted-foreground text-lg">COLORSからのお知らせや最新情報をお届けします。</p>
            </motion.div>
          </div>
        </section>

        {/* 一覧 */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {isLoading ? (
                <div className="flex justify-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <p className="text-lg">お知らせはまだありません。</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item, index) => {
                    const dateStr = formatDate(item.published_at ?? item.created_at);
                    const [year, rest] = dateStr.split(".");
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.08 }}
                      >
                        <Link
                          to={`/news/${item.id}`}
                          className="group block bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all"
                        >
                          <div className="flex flex-col md:flex-row md:items-start gap-4">
                            <div className="flex items-center gap-4 md:w-52 flex-shrink-0">
                              <time className="text-lg font-bold text-primary">
                                {year}<span className="text-sm">.{rest}</span>
                              </time>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[item.category] ?? "bg-secondary text-secondary-foreground"}`}>
                                {item.category}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                                {item.title}
                              </h2>
                              {item.excerpt && (
                                <p className="text-muted-foreground text-sm line-clamp-2">{item.excerpt}</p>
                              )}
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 hidden md:block self-center" />
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default News;
