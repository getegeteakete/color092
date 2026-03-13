import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Image } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Work {
  id: string;
  title: string;
  category: string;
  location: string;
  image_urls: string[];
  created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  painting: "塗装",
  reform: "リフォーム",
};

export const WorksSection = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from("works")
          .select("id, title, category, location, image_urls, created_at")
          .eq("published", true)
          .order("created_at", { ascending: false })
          .limit(3);
        setWorks(data ?? []);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

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
          <Link to="/works" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all whitespace-nowrap">
            一覧を見る<ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : works.length === 0 ? (
          <div className="rounded-2xl bg-muted/50 border border-border py-16 px-6 text-center">
            <p className="text-muted-foreground text-lg">現在準備中</p>
            <p className="text-muted-foreground/80 text-sm mt-2">施工実績がそろい次第、掲載してまいります。</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {works.map((work) => (
              <Link key={work.id} to={`/works/${work.id}`} className="group block">
                <div className="relative overflow-hidden rounded-2xl mb-3 h-48 bg-muted">
                  {work.image_urls?.[0] ? (
                    <img
                      src={work.image_urls[0]}
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-card/90 backdrop-blur-sm rounded-full text-xs font-medium">
                      {CATEGORY_LABELS[work.category] ?? work.category}
                    </span>
                  </div>
                </div>
                <div>
                  {work.location && <p className="text-xs text-muted-foreground mb-1">{work.location}</p>}
                  <p className="font-medium line-clamp-2 group-hover:text-primary transition-colors text-sm">
                    {work.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
