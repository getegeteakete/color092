import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X, Loader2, GripVertical } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface WorkForm {
  title: string;
  category: string;
  location: string;
  description: string;
  image_urls: string[];
  published: boolean;
}

const EMPTY_FORM: WorkForm = {
  title: "",
  category: "painting",
  location: "",
  description: "",
  image_urls: [],
  published: false,
};

const AdminWorksEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const isEdit = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<WorkForm>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isEdit) loadWork();
  }, [id]);

  const loadWork = async () => {
    try {
      const { data, error } = await supabase
        .from("works").select("*").eq("id", id).single();
      if (error) throw error;
      setForm({
        title: data.title ?? "",
        category: data.category ?? "painting",
        location: data.location ?? "",
        description: data.description ?? "",
        image_urls: data.image_urls ?? [],
        published: data.published ?? false,
      });
    } catch {
      toast({ title: "読み込みエラー", variant: "destructive" });
      navigate("/admin/works");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    const newUrls: string[] = [];
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const ext = file.name.split(".").pop();
        const path = `works/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("cms-images")
          .upload(path, file, { cacheControl: "3600", upsert: false });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("cms-images").getPublicUrl(path);
        newUrls.push(data.publicUrl);
      }
      setForm((prev) => ({ ...prev, image_urls: [...prev.image_urls, ...newUrls] }));
      toast({ title: `${newUrls.length}枚アップロードしました` });
    } catch {
      toast({ title: "アップロード失敗", description: "Storageバケット「cms-images」を作成してください。", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({ ...prev, image_urls: prev.image_urls.filter((_, i) => i !== index) }));
  };

  const handleSave = async (publishNow?: boolean) => {
    if (!form.title.trim()) {
      toast({ title: "タイトルを入力してください", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        ...form,
        published: publishNow !== undefined ? publishNow : form.published,
        updated_at: new Date().toISOString(),
      };
      if (isEdit) {
        const { error } = await supabase.from("works").update(payload).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("works").insert({ ...payload, created_at: new Date().toISOString() });
        if (error) throw error;
      }
      toast({ title: isEdit ? "更新しました" : "投稿しました" });
      navigate("/admin/works");
    } catch {
      toast({ title: "保存エラー", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
  
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
  
    );
  }

  return (

      <div className="max-w-3xl space-y-8">
        {/* ヘッダー */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/works")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{isEdit ? "施工実績を編集" : "施工実績を新規投稿"}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">公開サイトの「施工実績」ページに表示されます</p>
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
              placeholder="例：福岡市東区 K様邸 外壁・屋根塗装"
            />
          </div>

          {/* カテゴリ・場所 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>カテゴリ</Label>
              <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="painting">塗装</SelectItem>
                  <SelectItem value="reform">リフォーム</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">施工場所</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                placeholder="例：福岡市東区"
              />
            </div>
          </div>

          {/* 説明 */}
          <div className="space-y-2">
            <Label htmlFor="description">施工内容・説明</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="施工内容、使用塗料、施工期間、お客様の声などを入力してください。"
              rows={6}
            />
          </div>

          {/* 画像アップロード */}
          <div className="space-y-3">
            <Label>施工写真（複数可）</Label>
            <input
              ref={fileInputRef}
              type="file" accept="image/*" multiple
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files)}
            />
            <Button
              type="button" variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full h-20 border-dashed"
            >
              {isUploading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />アップロード中...</>
              ) : (
                <><Upload className="w-4 h-4 mr-2" />クリックまたはドラッグで画像を追加</>
              )}
            </Button>

            {form.image_urls.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {form.image_urls.map((url, i) => (
                  <div key={i} className="relative group aspect-square">
                    <img src={url} alt={`施工写真 ${i + 1}`} className="w-full h-full object-cover rounded-lg" />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded font-medium">
                        メイン
                      </span>
                    )}
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">最初の画像がメイン表示に使われます。</p>
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
          <Button variant="outline" onClick={() => navigate("/admin/works")} disabled={isSaving}>
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

  );
};

export default AdminWorksEdit;
