import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

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

        <div className="rounded-2xl bg-muted/50 border border-border py-16 px-6 text-center">
          <p className="text-muted-foreground text-lg">現在準備中</p>
          <p className="text-muted-foreground/80 text-sm mt-2">
            施工実績がそろい次第、掲載してまいります。
          </p>
        </div>
      </div>
    </section>
  );
};
