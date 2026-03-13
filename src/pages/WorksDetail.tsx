import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Image, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Work {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  image_urls: string[];
  created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  painting: "塗装",
  reform: "リフォーム",
};

const WorksDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [work, setWork] = useState<Work | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const { data } = await supabase
          .from("works")
          .select("*")
          .eq("id", id)
          .eq("published", true)
          .single();
        setWork(data);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {isLoading ? (
          <div className="flex justify-center py-32">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        ) : !work ? (
          <div className="container mx-auto px-4 py-32 text-center">
            <p className="text-muted-foreground text-lg mb-6">施工実績が見つかりません。</p>
            <Button asChild variant="outline"><Link to="/works"><ArrowLeft className="w-4 h-4 mr-2" />一覧に戻る</Link></Button>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              {/* パンくず */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                <Link to="/" className="hover:text-primary transition-colors">ホーム</Link>
                <span>/</span>
                <Link to="/works" className="hover:text-primary transition-colors">施工実績</Link>
                <span>/</span>
                <span className="text-foreground">{work.title}</span>
              </div>

              {/* メタ情報 */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-secondary rounded-full text-sm font-medium">
                  {CATEGORY_LABELS[work.category] ?? work.category}
                </span>
                {work.location && (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />{work.location}
                  </span>
                )}
                <time className="text-sm text-muted-foreground">
                  {new Date(work.created_at).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })}
                </time>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-8">{work.title}</h1>

              {/* メイン画像 */}
              {work.image_urls?.length > 0 ? (
                <div className="space-y-3 mb-8">
                  <div className="rounded-2xl overflow-hidden bg-muted aspect-video">
                    <img
                      src={work.image_urls[selectedImg]}
                      alt={work.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {work.image_urls.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {work.image_urls.map((url, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedImg(i)}
                          className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                            selectedImg === i ? "border-primary" : "border-transparent"
                          }`}
                        >
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl bg-muted aspect-video flex items-center justify-center mb-8">
                  <Image className="w-12 h-12 text-muted-foreground" />
                </div>
              )}

              {/* 説明 */}
              {work.description && (
                <div className="bg-card border border-border rounded-2xl p-6 mb-8">
                  <h2 className="font-bold text-lg mb-3">施工概要</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{work.description}</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-border">
                <Button asChild variant="outline">
                  <Link to="/works"><ArrowLeft className="w-4 h-4 mr-2" />施工実績一覧に戻る</Link>
                </Button>
                <Button asChild className="btn-gradient">
                  <Link to="/estimate">無料見積もりを依頼する</Link>
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

export default WorksDetail;
