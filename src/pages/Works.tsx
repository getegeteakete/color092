import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

// 施工実績がそろったらここにデータを追加すると一覧表示に切り替わります
// 形式: { id: number; title: string; date: string; category: "1"|"2"; categoryLabel: string }
const worksData: Array<{
  id: number;
  title: string;
  date: string;
  category: string;
  categoryLabel: string;
}> = [];

const categories = [
  { id: "all", label: "すべて" },
  { id: "1", label: "塗装" },
  { id: "2", label: "リフォーム" },
];

const Works = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const isPreparing = worksData.length === 0;
  const filteredWorks =
    !isPreparing && activeCategory === "all"
      ? worksData
      : worksData.filter((work) => work.category === activeCategory);

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
              <span className="section-label">Works</span>
              <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">施工実績</h1>
              <p className="text-muted-foreground text-lg">
                福岡県内外で数多くの塗装・リフォームを手がけ、
                多くのお客様にご満足いただいております。
              </p>
            </motion.div>
          </div>
        </section>

        {isPreparing ? (
          <section className="py-16 bg-card">
            <div className="container mx-auto px-4">
              <div className="rounded-2xl bg-muted/50 border border-border py-20 px-6 text-center max-w-2xl mx-auto">
                <p className="text-muted-foreground text-xl">現在準備中</p>
                <p className="text-muted-foreground/80 text-sm mt-3">
                  施工実績がそろい次第、掲載してまいります。
                </p>
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* Filter - データ追加時に表示 */}
            <section className="py-8 bg-card border-b border-border">
              <div className="container mx-auto px-4">
                <div className="flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                        activeCategory === category.id
                          ? "btn-gradient"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Works Grid - データ追加時に表示 */}
            <section className="py-16 bg-card">
              <div className="container mx-auto px-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredWorks.map((work, index) => (
                    <motion.div
                      key={work.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="group block">
                        <div className="relative overflow-hidden rounded-2xl mb-4 h-56 bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground text-sm">施工実績</span>
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-card/90 backdrop-blur-sm rounded-full text-xs font-medium">
                              {work.categoryLabel}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <time className="text-sm text-muted-foreground">{work.date}</time>
                          <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                            {work.title}
                          </h3>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
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
