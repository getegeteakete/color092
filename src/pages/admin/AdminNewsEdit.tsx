import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface NewsForm {
  title: string;
  category: string;
  excerpt: string;
  content: string;
  published: boolean;
  published_at: Date | undefined;
}

const EMPTY_FORM: NewsForm = {
  title: "",
  category: "お知らせ",
  excerpt: "",
  content: "",
  published: false,
  published_at: undefined,
};

const AdminNewsEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const isEdit = !!id;

  const [form, setForm] = useState<NewsForm>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEdit) loadNews();
  }, [id]);

  const loadNews = async () => {
    try {
      const { data, error } = await supabase
        .from("news").select("*").eq("id", id).single();
      if (error) throw error;
      setForm({
        title: data.title ?? "",
        category: data.category ?? "お知らせ",
        excerpt: data.excerpt ?? "",
        content: data.content ?? "",
        published: data.published ?? false,
        published_at: data.published_at ? new Date(data.published_at) : undefined,
      });
    } catch {
      toast({ title: "読み込みエラー", variant: "destructive" });
      navigate("/admin/news");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (publishNow?: boolean) => {
    if (!form.title.trim()) {
      toast({ title: "タイトルを入力してください", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const shouldPublish = publishNow !== undefined ? publishNow : form.published;
      const payload = {
        title: form.title,
        category: form.category,
        excerpt: form.excerpt,
        content: form.content,
        published: shouldPublish,
        published_at: form.published_at
          ? form.published_at.toISOString()
          : (shouldPublish ? new Date().toISOString() : null),
        updated_at: new Date().toISOString(),
      };
      if (isEdit) {
        const { error } = await supabase.from("news").update(payload).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("news").insert({ ...payload, created_at: new Date().toISOString() });
        if (error) throw error;
      }
      toast({ title: isEdit ? "更新しました" : "投稿しました" });
      navigate("/admin/news");
    } catch {
      toast({ title: "保存エラー", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl space-y-8">
        {/* ヘッダー */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/news")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{isEdit ? "お知らせを編集" : "お知らせを新規投稿"}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">公開サイトの「お知らせ」ページに表示されます</p>
          </div>
        </div>

        <div className="space-y-6 bg-card border border-border rounded-2xl p-6">
          {/* タイトル */}
          <div className="space-y-2">
            <Label htmlFor="title">タイトル <span className="text-destructive">*</span></Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="例：外壁塗装 春のキャンペーンのお知らせ"
            />
          </div>

          {/* カテゴリ・公開日 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>カテゴリ</Label>
              <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="お知らせ">お知らせ</SelectItem>
                  <SelectItem value="キャンペーン">キャンペーン</SelectItem>
                  <SelectItem value="メディア">メディア</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>公開日</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.published_at && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.published_at
                      ? format(form.published_at, "yyyy年M月d日", { locale: ja })
                      : "日付を選択（省略可）"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.published_at}
                    onSelect={(d) => setForm((p) => ({ ...p, published_at: d }))}
                    locale={ja}
                  />
                  {form.published_at && (
                    <div className="p-2 border-t">
                      <Button
                        variant="ghost" size="sm" className="w-full text-muted-foreground"
                        onClick={() => setForm((p) => ({ ...p, published_at: undefined }))}
                      >
                        日付をクリア
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* 概要（一覧表示用） */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">概要（一覧ページに表示する短い説明）</Label>
            <Textarea
              id="excerpt"
              value={form.excerpt}
              onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
              placeholder="例：今年も春のお得なキャンペーンを開催します！この機会にぜひ外壁塗装をご検討ください。"
              rows={2}
            />
          </div>

          {/* 本文 */}
          <div className="space-y-2">
            <Label htmlFor="content">本文</Label>
            <Textarea
              id="content"
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              placeholder={`詳細な内容を入力してください。\n\n改行はそのまま反映されます。`}
              rows={12}
              className="font-mono text-sm leading-relaxed"
            />
            <p className="text-xs text-muted-foreground">空白行で段落が分かれます</p>
          </div>

          {/* 公開設定 */}
          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
            <div>
              <p className="font-medium">公開する</p>
              <p className="text-sm text-muted-foreground">オンにすると公開サイトに表示されます</p>
            </div>
            <Switch
              checked={form.published}
              onCheckedChange={(v) => setForm((p) => ({ ...p, published: v }))}
            />
          </div>
        </div>

        {/* 保存ボタン */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => navigate("/admin/news")} disabled={isSaving}>
            キャンセル
          </Button>
          {!form.published && (
            <Button variant="outline" onClick={() => handleSave(false)} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              下書き保存
            </Button>
          )}
          <Button onClick={() => handleSave()} className="btn-gradient" disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {form.published ? "更新する" : "公開して投稿"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNewsEdit;
