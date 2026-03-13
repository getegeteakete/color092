import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Image } from "lucide-react";

interface Work {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  image_urls: string[];
  published_at: string | null;
  created_at: string;
}

const CATEGORIES = [
  { id: "all",      label: "すべて" },
  { id: "painting", label: "塗装" },
  { id: "reform",   label: "リフォーム" },
];

const CATEGORY_LABELS: Record<string, string> = {
  painting: "塗装",
  reform: "リフォーム",
};

const Works = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from("works")
          .select("id, title, category, description, location, image_urls, published_at, created_at")
          .eq("published", true)
          .order("created_at", { ascending: false });
        setWorks(data ?? []);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filtered = activeCategory === "all"
    ? works
    : works.filter((w) => w.category === activeCategory);

  const isPreparing = !isLoading && works.length === 0;

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
              <span className="section-label">Works</span>
              <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">施工実績</h1>
              <p className="text-muted-foreground text-lg">
                福岡県内外で数多くの塗装・リフォームを手がけ、多くのお客様にご満足いただいております。
              </p>
            </motion.div>
          </div>
        </section>

        {isLoading ? (
          <section className="py-16 bg-card">
            <div className="container mx-auto px-4 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
          </section>
        ) : isPreparing ? (
          <section className="py-16 bg-card">
            <div className="container mx-auto px-4">
              <div className="rounded-2xl bg-muted/50 border border-border py-20 px-6 text-center max-w-2xl mx-auto">
                <p className="text-muted-foreground text-xl">現在準備中</p>
                <p className="text-muted-foreground/80 text-sm mt-3">施工実績がそろい次第、掲載してまいります。</p>
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* フィルター */}
            <section className="py-8 bg-card border-b border-border">
              <div className="container mx-auto px-4">
                <div className="flex flex-wrap gap-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                        activeCategory === cat.id
                          ? "btn-gradient"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* グリッド */}
            <section className="py-16 bg-card">
              <div className="container mx-auto px-4">
                {filtered.length === 0 ? (
                  <p className="text-center text-muted-foreground py-12">
                    このカテゴリの施工実績はまだありません。
                  </p>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map((work, index) => (
                      <motion.div
                        key={work.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link to={`/works/${work.id}`} className="group block">
                          <div className="relative overflow-hidden rounded-2xl mb-4 h-56 bg-muted">
                            {work.image_urls?.[0] ? (
                              <img
                                src={work.image_urls[0]}
                                alt={work.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Image className="w-10 h-10 text-muted-foreground" />
                              </div>
                            )}
                            <div className="absolute top-4 left-4">
                              <span className="px-3 py-1 bg-card/90 backdrop-blur-sm rounded-full text-xs font-medium">
                                {CATEGORY_LABELS[work.category] ?? work.category}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <time className="text-sm text-muted-foreground">
                              {new Date(work.created_at).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })}
                            </time>
                            {work.location && (
                              <p className="text-xs text-muted-foreground">{work.location}</p>
                            )}
                            <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                              {work.title}
                            </h3>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Works;
