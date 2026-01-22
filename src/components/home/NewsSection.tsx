import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const newsItems = [
  {
    id: 13,
    date: "2024.10.08",
    category: "お知らせ",
    title: "ホームページをリニューアルしました",
  },
  {
    id: 12,
    date: "2024.10.08",
    category: "お知らせ",
    title: "スマートフォンから閲覧可能になりました",
  },
  {
    id: 11,
    date: "2024.10.08",
    category: "お知らせ",
    title: "施工事例ページを更新しました",
  },
];

export const NewsSection = () => {
  return (
    <section className="py-24 bg-section-gradient">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <span className="section-label">News</span>
            <h2 className="section-title">お知らせ</h2>
          </div>
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all whitespace-nowrap"
          >
            一覧をみる
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>

        <div className="space-y-4">
          {newsItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/news/${item.id}`}
                className="group block bg-card rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <time className="text-lg font-bold text-primary">
                      {item.date.split(".")[0]}
                      <span className="text-sm">.{item.date.split(".").slice(1).join(".")}</span>
                    </time>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="flex-1 font-medium group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
