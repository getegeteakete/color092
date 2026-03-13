import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Download, 
  Save,
  Building2,
  Calendar,
  Phone,
  Mail,
  FileText,
  Image as ImageIcon,
  Edit,
  CheckCircle2,
  XCircle,
  Video,
  MapPin
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type Status = "仮見積" | "予約済" | "現地調査完了" | "本見積提出" | "成約" | "失注";

interface Estimate {
  id: string;
  building_type: string;
  building_age: number;
  floor_area: number;
  floors: number;
  work_types: string[];
  deterioration_level: string;
  estimate_min: number;
  estimate_max: number;
  status: Status;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  memo?: string;
  sales_notes?: string;
  photo_urls?: string[];
  created_at: string;
  updated_at?: string;
}

interface Reservation {
  id: string;
  estimate_id: string;
  type: "現地調査" | "Zoomオンライン相談";
  date?: string;
  time?: string;
  address?: string;
  notes?: string;
  zoom_url?: string;
  status?: string;
  created_at: string;
}

const STATUS_CONFIG: Record<Status, { color: string; bgColor: string; label: string }> = {
  仮見積: { color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-900/20", label: "仮見積" },
  予約済: { color: "text-purple-600", bgColor: "bg-purple-50 dark:bg-purple-900/20", label: "予約済" },
  現地調査完了: { color: "text-orange-600", bgColor: "bg-orange-50 dark:bg-orange-900/20", label: "現地調査完了" },
  本見積提出: { color: "text-yellow-600", bgColor: "bg-yellow-50 dark:bg-yellow-900/20", label: "本見積提出" },
  成約: { color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-900/20", label: "成約" },
  失注: { color: "text-red-600", bgColor: "bg-red-50 dark:bg-red-900/20", label: "失注" },
};

const AdminDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    status: "仮見積" as Status,
    memo: "",
    sales_notes: "",
  });

  useEffect(() => {
    if (id) {
      loadEstimate();
      loadReservation();
    }
  }, [id]);

  const loadEstimate = async () => {
    try {
      const { data, error } = await supabase
        .from("estimates")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setEstimate(data);
      setFormData({
        customer_name: data.customer_name || "",
        customer_phone: data.customer_phone || "",
        customer_email: data.customer_email || "",
        status: (data.status || "仮見積") as Status,
        memo: data.memo || "",
        sales_notes: data.sales_notes || "",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "案件の読み込みに失敗しました。";
      toast({
        title: "エラー",
        description: message,
        variant: "destructive",
      });
      navigate("/admin/list");
    } finally {
      setIsLoading(false);
    }
  };

  const loadReservation = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .eq("estimate_id", id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setReservation(data);
    } catch {
      // 予約情報は任意のため、エラーは無視
    }
  };

  const handleSave = async () => {
    if (!id) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("estimates")
        .update({
          customer_name: formData.customer_name,
          customer_phone: formData.customer_phone,
          customer_email: formData.customer_email,
          status: formData.status,
          memo: formData.memo,
          sales_notes: formData.sales_notes,
          status_updated_at: formData.status !== estimate?.status 
            ? new Date().toISOString() 
            : undefined,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "保存しました",
        description: "案件情報を更新しました。",
      });

      setIsEditing(false);
      loadEstimate();
    } catch {
      toast({
        title: "エラー",
        description: "保存に失敗しました。",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!estimate) return;

    // 簡単なPDF生成（実際の実装ではjsPDF等を使用）
    const content = `
見積書

顧客名: ${formData.customer_name || "未設定"}
電話番号: ${formData.customer_phone || "未設定"}
メールアドレス: ${formData.customer_email || "未設定"}

建物情報
- 建物種別: ${estimate.building_type}
- 築年数: ${estimate.building_age}年
- 延床面積: ${estimate.floor_area}㎡
- 階数: ${estimate.floors}階

施工内容
${estimate.work_types.map((type) => `- ${type}`).join("\n")}

劣化状況: ${estimate.deterioration_level}

見積金額
最小: ${estimate.estimate_min.toLocaleString()}円
最大: ${estimate.estimate_max.toLocaleString()}円
（税込）

備考
${formData.memo || "なし"}

作成日: ${new Date(estimate.created_at).toLocaleDateString("ja-JP")}
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `見積書_${formData.customer_name || estimate.id}_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "ダウンロード開始",
      description: "見積書をダウンロードしました。",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!estimate) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">案件が見つかりませんでした</p>
        <Button onClick={() => navigate("/admin/list")} className="mt-4">
          一覧に戻る
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/admin/list")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">案件詳細</h1>
            <p className="text-muted-foreground mt-1">ID: {estimate.id.slice(0, 8)}...</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="w-4 h-4 mr-2" />
            PDF見積
          </Button>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                キャンセル
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="btn-gradient">
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "保存中..." : "保存"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              編集
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左カラム */}
        <div className="lg:col-span-2 space-y-6">
          {/* 顧客情報 */}
          <Card>
            <CardHeader>
              <CardTitle>顧客情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>顧客名</Label>
                {isEditing ? (
                  <Input
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="mt-2"
                    placeholder="顧客名を入力"
                  />
                ) : (
                  <p className="mt-2 font-medium">{formData.customer_name || "未設定"}</p>
                )}
              </div>
              <div>
                <Label>電話番号</Label>
                {isEditing ? (
                  <Input
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    className="mt-2"
                    placeholder="電話番号を入力"
                  />
                ) : (
                  <p className="mt-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    {formData.customer_phone || "未設定"}
                  </p>
                )}
              </div>
              <div>
                <Label>メールアドレス</Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    className="mt-2"
                    placeholder="メールアドレスを入力"
                  />
                ) : (
                  <p className="mt-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    {formData.customer_email || "未設定"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 建物情報・見積内容 */}
          <Card>
            <CardHeader>
              <CardTitle>建物情報・見積内容</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">建物種別</Label>
                  <p className="mt-1 font-medium">{estimate.building_type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">築年数</Label>
                  <p className="mt-1 font-medium">{estimate.building_age}年</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">延床面積</Label>
                  <p className="mt-1 font-medium">{estimate.floor_area}㎡</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">階数</Label>
                  <p className="mt-1 font-medium">{estimate.floors}階</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">施工内容</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {estimate.work_types.map((type, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-secondary rounded-full text-sm"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">劣化状況</Label>
                <p className="mt-1 font-medium">{estimate.deterioration_level}</p>
              </div>
              <div className="pt-4 border-t">
                <Label className="text-muted-foreground">見積金額</Label>
                <div className="mt-2 text-2xl font-bold text-primary">
                  {estimate.estimate_min.toLocaleString()}円 〜 {estimate.estimate_max.toLocaleString()}円
                </div>
                <p className="text-sm text-muted-foreground mt-1">（税込）</p>
              </div>
            </CardContent>
          </Card>

          {/* 写真 */}
          {estimate.photo_urls && estimate.photo_urls.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  写真
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {estimate.photo_urls.map((url, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden border">
                      <img
                        src={url}
                        alt={`写真 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 予約情報 */}
          {reservation && (
            <Card>
              <CardHeader>
                <CardTitle>予約情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">予約種別</Label>
                  <div className="mt-1 flex items-center gap-2">
                    {reservation.type === "Zoomオンライン相談" ? (
                      <Video className="w-4 h-4 text-primary" />
                    ) : (
                      <MapPin className="w-4 h-4 text-primary" />
                    )}
                    <span className="font-medium">{reservation.type}</span>
                  </div>
                </div>
                {reservation.date && (
                  <div>
                    <Label className="text-muted-foreground">日時</Label>
                    <p className="mt-1 font-medium">
                      {new Date(reservation.date).toLocaleDateString("ja-JP")} {reservation.time}
                    </p>
                  </div>
                )}
                {reservation.address && (
                  <div>
                    <Label className="text-muted-foreground">住所</Label>
                    <p className="mt-1">{reservation.address}</p>
                  </div>
                )}
                {reservation.zoom_url && (
                  <div>
                    <Label className="text-muted-foreground">Zoom URL</Label>
                    <a
                      href={reservation.zoom_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-primary hover:underline block"
                    >
                      {reservation.zoom_url}
                    </a>
                  </div>
                )}
                {reservation.notes && (
                  <div>
                    <Label className="text-muted-foreground">備考</Label>
                    <p className="mt-1 text-sm">{reservation.notes}</p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">ステータス</Label>
                  <p className="mt-1">
                    <span className="px-2 py-1 bg-secondary rounded text-sm">
                      {reservation.status || "予約待ち"}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 営業メモ */}
          <Card>
            <CardHeader>
              <CardTitle>営業メモ</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={formData.sales_notes}
                  onChange={(e) => setFormData({ ...formData, sales_notes: e.target.value })}
                  placeholder="営業メモを入力..."
                  className="min-h-[200px]"
                />
              ) : (
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {formData.sales_notes || "メモがありません"}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 右カラム */}
        <div className="space-y-6">
          {/* ステータス */}
          <Card>
            <CardHeader>
              <CardTitle>ステータス</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Status })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="仮見積">仮見積</SelectItem>
                    <SelectItem value="予約済">予約済</SelectItem>
                    <SelectItem value="現地調査完了">現地調査完了</SelectItem>
                    <SelectItem value="本見積提出">本見積提出</SelectItem>
                    <SelectItem value="成約">成約</SelectItem>
                    <SelectItem value="失注">失注</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className={`p-4 rounded-lg ${STATUS_CONFIG[formData.status].bgColor} border-2`}>
                  <div className={`font-semibold ${STATUS_CONFIG[formData.status].color} flex items-center gap-2`}>
                    {formData.status === "成約" && <CheckCircle2 className="w-5 h-5" />}
                    {formData.status === "失注" && <XCircle className="w-5 h-5" />}
                    {formData.status !== "成約" && formData.status !== "失注" && <FileText className="w-5 h-5" />}
                    {STATUS_CONFIG[formData.status].label}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* メモ */}
          <Card>
            <CardHeader>
              <CardTitle>メモ</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={formData.memo}
                  onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                  placeholder="メモを入力..."
                  className="min-h-[150px]"
                />
              ) : (
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {formData.memo || "メモがありません"}
                </p>
              )}
            </CardContent>
          </Card>

          {/* 作成日時 */}
          <Card>
            <CardHeader>
              <CardTitle>作成日時</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {new Date(estimate.created_at).toLocaleString("ja-JP")}
              </div>
              {estimate.updated_at && (
                <div className="mt-2 text-xs text-muted-foreground">
                  更新: {new Date(estimate.updated_at).toLocaleString("ja-JP")}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDetail;
