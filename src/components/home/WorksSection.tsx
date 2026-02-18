import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import beforeAfter from "@/assets/before-after.jpg";
import paintingWork from "@/assets/painting-work.jpg";
import reformInterior from "@/assets/reform-interior.jpg";

const works = [
  {
    id: 1,
    title: "屋上の防水工事をご依頼いただきました。",
    date: "2024.11.01",
    category: "施工実績",
    image: beforeAfter,
  },
  {
    id: 2,
    title: "倉庫内不用品処分、リフォームをご依頼頂きました",
    date: "2024.10.08",
    category: "施工実績",
    image: reformInterior,
  },
  {
    id: 3,
    title: "座敷スペースをテーブル席に変更するリフォームのご依頼をいただきました。",
    date: "2024.10.08",
    category: "施工実績",
    image: paintingWork,
  },
  {
    id: 4,
    title: "一般住宅のトイレのリフォームをご依頼いただきました",
    date: "2024.10.08",
    category: "施工実績",
    image: beforeAfter,
  },
];

export const WorksSection = () => {
  return (
    <section className="bg-card">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="section-label">Works</span>
            <h2 className="section-title">施工実績</h2>
            <p className="text-muted-foreground mt-4 max-w-xl">
              福岡県内外で数多くの塗装・リフォームを手がけ、多くのお客様にご満足いただいております。
            </p>
          </div>
          <Link
            to="/works"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all whitespace-nowrap"
          >
            一覧を見る
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {works.map((work, index) => (
            <div key={work.id}>
              <Link to={`/works/${work.id}`} className="group block">
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-primary font-medium">{work.category}</span>
                    <span className="text-muted-foreground">{work.date}</span>
                  </div>
                  <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {work.title}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
