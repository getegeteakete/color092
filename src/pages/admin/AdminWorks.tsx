import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Eye, EyeOff, Image, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Work {
  id: string;
  title: string;
  category: string;
  location: string;
  image_urls: string[];
  published: boolean;
  created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  painting: "塗装",
  reform: "リフォーム",
};

const AdminWorks = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { loadWorks(); }, []);

  const loadWorks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("works")
        .select("id, title, category, location, image_urls, published, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setWorks(data ?? []);
    } catch {
      toast({ title: "読み込みエラー", description: "施工実績の取得に失敗しました。", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePublish = async (work: Work) => {
    try {
      const { error } = await supabase
        .from("works")
        .update({ published: !work.published })
        .eq("id", work.id);
      if (error) throw error;
      setWorks((prev) => prev.map((w) => w.id === work.id ? { ...w, published: !w.published } : w));
      toast({ title: work.published ? "非公開にしました" : "公開しました" });
    } catch {
      toast({ title: "更新エラー", variant: "destructive" });
    }
  };

  const deleteWork = async (id: string) => {
    try {
      const { error } = await supabase.from("works").delete().eq("id", id);
      if (error) throw error;
      setWorks((prev) => prev.filter((w) => w.id !== id));
      toast({ title: "削除しました" });
    } catch {
      toast({ title: "削除エラー", variant: "destructive" });
    }
  };

  const filtered = works.filter((w) =>
    w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">施工実績</h1>
            <p className="text-muted-foreground mt-1">公開・非公開を含む全投稿 {works.length} 件</p>
          </div>
          <Button onClick={() => navigate("/admin/works/new")} className="btn-gradient w-fit">
            <Plus className="w-4 h-4 mr-2" />新規投稿
          </Button>
        </div>

        {/* 検索 */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="タイトル・場所で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground border border-dashed rounded-2xl">
            {searchQuery ? "検索結果がありません" : "施工実績がまだありません。「新規投稿」から追加してください。"}
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((work, index) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary/20 transition-colors"
              >
                {/* サムネイル */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {work.image_urls?.[0] ? (
                    <img src={work.image_urls[0]} alt={work.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* 情報 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                      {CATEGORY_LABELS[work.category] ?? work.category}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      work.published
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                    }`}>
                      {work.published ? "公開中" : "非公開"}
                    </span>
                  </div>
                  <h3 className="font-medium mt-1 truncate">{work.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {work.location && `${work.location} ・ `}
                    {new Date(work.created_at).toLocaleDateString("ja-JP")}
                  </p>
                </div>

                {/* アクション */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => togglePublish(work)}
                    title={work.published ? "非公開にする" : "公開する"}
                  >
                    {work.published
                      ? <Eye className="w-4 h-4 text-green-600" />
                      : <EyeOff className="w-4 h-4 text-muted-foreground" />
                    }
                  </Button>
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => navigate(`/admin/works/edit/${work.id}`)}
                    title="編集"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" title="削除">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                        <AlertDialogDescription>
                          「{work.title}」を削除します。この操作は取り消せません。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteWork(work.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          削除する
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminWorks;
