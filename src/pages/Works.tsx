import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import beforeAfter from "@/assets/before-after.jpg";
import paintingWork from "@/assets/painting-work.jpg";
import reformInterior from "@/assets/reform-interior.jpg";
import heroPainting from "@/assets/hero-painting.jpg";

const categories = [
  { id: "all", label: "すべて" },
  { id: "1", label: "塗装" },
  { id: "2", label: "リフォーム" },
];

const worksData = [
  {
    id: 37,
    title: "屋上の防水工事をご依頼いただきました。",
    date: "2024.11.01",
    category: "2",
    categoryLabel: "リフォーム",
    image: beforeAfter,
  },
  {
    id: 30,
    title: "倉庫内不用品処分、リフォームをご依頼頂きました",
    date: "2024.10.08",
    category: "2",
    categoryLabel: "リフォーム",
    image: reformInterior,
  },
  {
    id: 29,
    title: "座敷スペースをテーブル席に変更するリフォームのご依頼をいただきました。",
    date: "2024.10.08",
    category: "2",
    categoryLabel: "リフォーム",
    image: paintingWork,
  },
  {
    id: 28,
    title: "一般住宅のトイレのリフォームをご依頼いただきました",
    date: "2024.10.08",
    category: "2",
    categoryLabel: "リフォーム",
    image: beforeAfter,
  },
  {
    id: 26,
    title: "倉庫全体の塗装をご依頼頂きました",
    date: "2024.10.08",
    category: "1",
    categoryLabel: "塗装",
    image: heroPainting,
  },
  {
    id: 25,
    title: "車体塗装をご依頼いただきました",
    date: "2024.10.08",
    category: "1",
    categoryLabel: "塗装",
    image: paintingWork,
  },
  {
    id: 23,
    title: "倉庫内の空きスペースに、食品加工所を造作させていただきました",
    date: "2024.10.08",
    category: "2",
    categoryLabel: "リフォーム",
    image: reformInterior,
  },
  {
    id: 22,
    title: "キッチンカー外装依頼を頂きました。内部の衛生面にもこだわり空気触媒を施工しています",
    date: "2024.10.08",
    category: "1",
    categoryLabel: "塗装",
    image: heroPainting,
  },
];

const Works = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredWorks =
    activeCategory === "all"
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

        {/* Filter */}
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

        {/* Works Grid */}
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
                  <Link to={`/works/${work.id}`} className="group block">
                    <div className="relative overflow-hidden rounded-2xl mb-4">
                      <img
                        src={work.image}
                        alt={work.title}
                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
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

export default Works;
