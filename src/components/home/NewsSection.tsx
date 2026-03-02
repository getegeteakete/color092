import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const newsItems = [
  {
    id: 1,
    date: "2026.01.27",
    category: "お知らせ",
    title: "HPリニューアル",
  },
];

export const NewsSection = () => {
  return (
    <section className="bg-section-gradient">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
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
        </div>

        <div className="space-y-4">
          {newsItems.map((item, index) => (
            <div key={item.id}>
              <Link
                to={`/news/${item.id}`}
                className="group block bg-card rounded-2xl card-padding hover:shadow-lg transition-shadow"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
