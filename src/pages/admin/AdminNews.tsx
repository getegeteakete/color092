import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Eye, EyeOff, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface NewsItem {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  "お知らせ":     "bg-secondary text-secondary-foreground",
  "キャンペーン": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  "メディア":     "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
};

const AdminNews = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { loadNews(); }, []);

  const loadNews = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("news")
        .select("id, title, category, excerpt, published, published_at, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setItems(data ?? []);
    } catch {
      toast({ title: "読み込みエラー", description: "お知らせの取得に失敗しました。", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePublish = async (item: NewsItem) => {
    try {
      const now = new Date().toISOString();
      const update: Record<string, unknown> = { published: !item.published };
      if (!item.published && !item.published_at) update.published_at = now;
      const { error } = await supabase.from("news").update(update).eq("id", item.id);
      if (error) throw error;
      setItems((prev) => prev.map((n) => n.id === item.id ? {
        ...n,
        published: !n.published,
        published_at: n.published_at ?? (update.published_at as string | null ?? null),
      } : n));
      toast({ title: item.published ? "非公開にしました" : "公開しました" });
    } catch {
      toast({ title: "更新エラー", variant: "destructive" });
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase.from("news").delete().eq("id", id);
      if (error) throw error;
      setItems((prev) => prev.filter((n) => n.id !== id));
      toast({ title: "削除しました" });
    } catch {
      toast({ title: "削除エラー", variant: "destructive" });
    }
  };

  const filtered = items.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.category.includes(searchQuery)
  );

  const formatDate = (iso: string | null) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
  };

  return (

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">お知らせ</h1>
            <p className="text-muted-foreground mt-1">全 {items.length} 件（公開中 {items.filter((n) => n.published).length} 件）</p>
          </div>
          <Button onClick={() => navigate("/admin/news/new")} className="btn-gradient w-fit">
            <Plus className="w-4 h-4 mr-2" />新規投稿
          </Button>
        </div>

        {/* 検索 */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="タイトル・カテゴリで検索..."
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
            {searchQuery ? "検索結果がありません" : "お知らせがまだありません。「新規投稿」から追加してください。"}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">タイトル</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">カテゴリ</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">公開日</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">状態</th>
                  <th className="px-4 py-3 w-32"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium line-clamp-1">{item.title}</p>
                        {item.excerpt && (
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.excerpt}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${CATEGORY_COLORS[item.category] ?? "bg-secondary text-secondary-foreground"}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {formatDate(item.published_at)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        item.published
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                      }`}>
                        {item.published ? "公開中" : "下書き"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => togglePublish(item)} title={item.published ? "非公開にする" : "公開する"}>
                          {item.published
                            ? <Eye className="w-4 h-4 text-green-600" />
                            : <EyeOff className="w-4 h-4 text-muted-foreground" />
                          }
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/news/edit/${item.id}`)} title="編集">
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
                                「{item.title}」を削除します。この操作は取り消せません。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>キャンセル</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteItem(item.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                削除する
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

  );
};

export default AdminNews;
