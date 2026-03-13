import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface NewsItem {
  id: string;
  title: string;
  category: string;
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
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
};

export const NewsSection = () => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from("news")
          .select("id, title, category, published_at, created_at")
          .eq("published", true)
          .order("published_at", { ascending: false })
          .limit(5);
        setItems(data ?? []);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="bg-section-gradient">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="section-label">News</span>
            <h2 className="section-title">お知らせ</h2>
          </div>
          <Link to="/news" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all whitespace-nowrap">
            一覧をみる<ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">お知らせはまだありません。</div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const dateStr = formatDate(item.published_at ?? item.created_at);
              const [year, rest] = dateStr.split(".");
              return (
                <div key={item.id}>
                  <Link
                    to={`/news/${item.id}`}
                    className="group block bg-card rounded-2xl card-padding hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <time className="text-lg font-bold text-primary">
                          {year}<span className="text-sm">.{rest}</span>
                        </time>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[item.category] ?? "bg-secondary text-secondary-foreground"}`}>
                          {item.category}
                        </span>
                      </div>
                      <h3 className="flex-1 font-medium group-hover:text-primary transition-colors">{item.title}</h3>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
