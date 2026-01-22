import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Video,
  Home,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type ReservationType = "現地調査" | "Zoomオンライン相談";
type ReservationStatus = "予約待ち" | "確定" | "完了" | "キャンセル";

interface ReservationFormData {
  type: ReservationType | "";
  date: Date | undefined;
  time: string;
  address: string;
  notes: string;
}

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

const Reservation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const estimateId = searchParams.get("estimate_id");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [zoomUrl, setZoomUrl] = useState<string>("");
  
  const [formData, setFormData] = useState<ReservationFormData>({
    type: "",
    date: undefined,
    time: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    // estimate_idがない場合は見積もりページにリダイレクト
    if (!estimateId) {
      // ローカルストレージから見積もり情報を確認
      const lastEstimate = localStorage.getItem("last_estimate");
      if (!lastEstimate) {
        toast({
          title: "見積もりが必要です",
          description: "まずは見積もりを完了してください。",
          variant: "destructive",
        });
        navigate("/estimate");
      }
    }
  }, [estimateId, navigate, toast]);

  const updateFormData = (field: keyof ReservationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.type) {
      toast({
        title: "入力エラー",
        description: "予約種別を選択してください。",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.date) {
      toast({
        title: "入力エラー",
        description: "希望日を選択してください。",
        variant: "destructive",
      });
      return false;
    }
    
    // 過去の日付は選択不可
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (formData.date < today) {
      toast({
        title: "入力エラー",
        description: "過去の日付は選択できません。",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.time) {
      toast({
        title: "入力エラー",
        description: "希望時間を選択してください。",
        variant: "destructive",
      });
      return false;
    }
    
    if (formData.type === "現地調査" && !formData.address.trim()) {
      toast({
        title: "入力エラー",
        description: "住所を入力してください。",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const createZoomMeeting = async (date: Date, time: string): Promise<string | null> => {
    try {
      // Zoom APIの設定（環境変数から取得）
      const zoomApiKey = import.meta.env.VITE_ZOOM_API_KEY;
      const zoomApiSecret = import.meta.env.VITE_ZOOM_API_SECRET;
      const zoomAccountId = import.meta.env.VITE_ZOOM_ACCOUNT_ID;
      
      if (!zoomApiKey || !zoomApiSecret || !zoomAccountId) {
        console.warn("Zoom API credentials not configured");
        return null;
      }
      
      // Zoom APIを使用してミーティングを作成
      // 注意: 実際の実装では、サーバーサイドでZoom APIを呼び出すことを推奨
      // ここでは簡易的な実装例を示します
      
      // 日時をISO形式に変換
      const [hours, minutes] = time.split(":").map(Number);
      const meetingDate = new Date(date);
      meetingDate.setHours(hours, minutes, 0, 0);
      
      // 実際のZoom API呼び出しはサーバーサイドで実装することを推奨
      // ここではモックとして、将来実装するための構造を示します
      
      // モック: 実際の実装では、サーバーエンドポイントを呼び出す
      // const response = await fetch('/api/create-zoom-meeting', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     topic: 'リフォーム・塗装相談',
      //     start_time: meetingDate.toISOString(),
      //     duration: 30,
      //   }),
      // });
      // const data = await response.json();
      // return data.join_url;
      
      // 暫定的にモックURLを返す
      return `https://zoom.us/j/mock-meeting-${Date.now()}`;
      
    } catch (error) {
      console.error("Zoom meeting creation error:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !estimateId) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let zoomUrlResult = "";
      
      // Zoom相談の場合はZoomミーティングを作成
      if (formData.type === "Zoomオンライン相談" && formData.date) {
        const url = await createZoomMeeting(formData.date, formData.time);
        if (url) {
          zoomUrlResult = url;
          setZoomUrl(url);
        } else {
          toast({
            title: "Zoomミーティング作成に失敗",
            description: "予約は保存されますが、Zoom URLは後で連絡いたします。",
            variant: "default",
          });
        }
      }
      
      // データベースに保存
      const dateString = formData.date ? format(formData.date, "yyyy-MM-dd") : "";
      const dateTimeString = formData.date && formData.time 
        ? `${dateString}T${formData.time}:00` 
        : null;
      
      const { data, error } = await supabase
        .from("reservations")
        .insert({
          estimate_id: estimateId,
          type: formData.type,
          date: dateString,
          time: formData.time,
          datetime: dateTimeString,
          address: formData.type === "現地調査" ? formData.address : null,
          notes: formData.notes || null,
          zoom_url: zoomUrlResult || null,
          status: "予約待ち",
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) {
        // Supabaseが設定されていない場合のフォールバック
        if (error.message?.includes("fetch") || error.message?.includes("network")) {
          const localReservation = {
            id: `local_${Date.now()}`,
            estimate_id: estimateId,
            type: formData.type,
            date: dateString,
            time: formData.time,
            address: formData.type === "現地調査" ? formData.address : null,
            notes: formData.notes || null,
            zoom_url: zoomUrlResult || null,
            status: "予約待ち" as ReservationStatus,
            created_at: new Date().toISOString(),
          };
          
          localStorage.setItem("last_reservation", JSON.stringify(localReservation));
          setReservationId(localReservation.id);
          setIsCompleted(true);
          
          toast({
            title: "予約を保存しました",
            description: "Supabaseが設定されていないため、ローカルに保存しました。",
          });
          
          return;
        }
        
        throw error;
      }
      
      setReservationId(data.id);
      setIsCompleted(true);
      
      toast({
        title: "予約が完了しました",
        description: "予約情報を確認してください。",
      });
      
    } catch (error: any) {
      console.error("Reservation error:", error);
      toast({
        title: "エラーが発生しました",
        description: error.message || "予約の保存に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 予約完了画面
  if (isCompleted) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-20">
          <section className="relative py-24 bg-hero-gradient overflow-hidden">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto text-center"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink to-accent flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">予約が完了しました</h1>
                <p className="text-muted-foreground text-lg mb-8">
                  ご予約ありがとうございます。担当者より確認のご連絡をさせていただきます。
                </p>
                
                <div className="bg-card rounded-3xl p-8 shadow-lg border border-border text-left space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">予約種別</span>
                    <span className="font-medium">{formData.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">希望日</span>
                    <span className="font-medium">
                      {formData.date ? format(formData.date, "yyyy年MM月dd日") : ""}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">希望時間</span>
                    <span className="font-medium">{formData.time}</span>
                  </div>
                  {formData.type === "現地調査" && formData.address && (
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground">住所</span>
                      <span className="font-medium text-right max-w-xs">{formData.address}</span>
                    </div>
                  )}
                  {formData.type === "Zoomオンライン相談" && zoomUrl && (
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Video className="w-5 h-5 text-primary" />
                        <span className="font-medium">ZoomミーティングURL</span>
                      </div>
                      <a
                        href={zoomUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline break-all"
                      >
                        {zoomUrl}
                      </a>
                    </div>
                  )}
                  {formData.notes && (
                    <div className="pt-4 border-t border-border">
                      <span className="text-muted-foreground block mb-2">備考</span>
                      <p className="text-sm">{formData.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => navigate("/")} variant="outline">
                    <Home className="w-4 h-4 mr-2" />
                    ホームに戻る
                  </Button>
                  <Button onClick={() => navigate("/estimate")} className="btn-gradient">
                    新しい見積もり
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative py-16 bg-hero-gradient overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-pink/10 blur-3xl" />
          </div>
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <span className="section-label">Reservation</span>
              <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">予約フォーム</h1>
              <p className="text-muted-foreground text-lg">
                現地調査またはZoomオンライン相談のご予約をお受けします。
              </p>
            </motion.div>
          </div>
        </section>

        {/* Form */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* 予約種別 */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">予約種別 <span className="text-destructive">*</span></Label>
                  <RadioGroup
                    value={formData.type}
                    onValueChange={(value) => updateFormData("type", value as ReservationType)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                        <RadioGroupItem value="現地調査" id="onsite" className="mt-1" />
                        <Label htmlFor="onsite" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-5 h-5 text-primary" />
                            <span className="font-medium">現地調査（訪問）</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            スタッフが現地にお伺いして調査いたします
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                        <RadioGroupItem value="Zoomオンライン相談" id="zoom" className="mt-1" />
                        <Label htmlFor="zoom" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2 mb-1">
                            <Video className="w-5 h-5 text-primary" />
                            <span className="font-medium">Zoomオンライン相談</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            オンラインでご相談いただけます
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* 希望日 */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">希望日 <span className="text-destructive">*</span></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? (
                          format(formData.date, "yyyy年MM月dd日")
                        ) : (
                          <span>日付を選択してください</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) => updateFormData("date", date)}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* 希望時間 */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">希望時間 <span className="text-destructive">*</span></Label>
                  <Select
                    value={formData.time}
                    onValueChange={(value) => updateFormData("time", value)}
                  >
                    <SelectTrigger>
                      <Clock className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="時間を選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 住所（現地調査のみ） */}
                {formData.type === "現地調査" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <Label htmlFor="address" className="text-lg font-semibold">
                      住所 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="address"
                      placeholder="〒123-4567 福岡県福岡市..."
                      value={formData.address}
                      onChange={(e) => updateFormData("address", e.target.value)}
                    />
                  </motion.div>
                )}

                {/* 備考 */}
                <div className="space-y-4">
                  <Label htmlFor="notes" className="text-lg font-semibold">備考</Label>
                  <Textarea
                    id="notes"
                    placeholder="ご要望やご質問があればご記入ください"
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => updateFormData("notes", e.target.value)}
                  />
                </div>

                {/* 注意事項 */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium mb-1">ご注意</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>予約確定後、担当者より確認のご連絡をさせていただきます。</li>
                        <li>Zoomオンライン相談の場合、予約確定後にミーティングURLをお送りします。</li>
                        <li>キャンセルや変更のご希望は、お電話（090-6120-2995）までご連絡ください。</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/estimate")}
                  >
                    戻る
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-gradient"
                  >
                    {isSubmitting ? "予約中..." : "予約を確定する"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Reservation;
