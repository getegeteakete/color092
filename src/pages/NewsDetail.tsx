import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsItem {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  published_at: string | null;
  created_at: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  "お知らせ":     "bg-secondary text-secondary-foreground",
  "キャンペーン": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  "メディア":     "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
};

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const { data } = await supabase
          .from("news")
          .select("*")
          .eq("id", id)
          .eq("published", true)
          .single();
        setItem(data);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  const dateStr = item
    ? new Date(item.published_at ?? item.created_at).toLocaleDateString("ja-JP", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {isLoading ? (
          <div className="flex justify-center py-32">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        ) : !item ? (
          <div className="container mx-auto px-4 py-32 text-center">
            <p className="text-muted-foreground text-lg mb-6">お知らせが見つかりません。</p>
            <Button asChild variant="outline">
              <Link to="/news"><ArrowLeft className="w-4 h-4 mr-2" />一覧に戻る</Link>
            </Button>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-12 max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              {/* パンくず */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                <Link to="/" className="hover:text-primary transition-colors">ホーム</Link>
                <span>/</span>
                <Link to="/news" className="hover:text-primary transition-colors">お知らせ</Link>
                <span>/</span>
                <span className="text-foreground line-clamp-1">{item.title}</span>
              </div>

              {/* メタ */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${CATEGORY_COLORS[item.category] ?? "bg-secondary text-secondary-foreground"}`}>
                  {item.category}
                </span>
                <time className="text-sm text-muted-foreground">{dateStr}</time>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">{item.title}</h1>

              {/* 本文 */}
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-8">
                {item.content ? (
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    {item.content.split("\n").map((line, i) => (
                      <p key={i} className="leading-relaxed text-foreground">
                        {line || <br />}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">{item.excerpt}</p>
                )}
              </div>

              <div className="pt-4 border-t border-border">
                <Button asChild variant="outline">
                  <Link to="/news"><ArrowLeft className="w-4 h-4 mr-2" />お知らせ一覧に戻る</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default NewsDetail;
