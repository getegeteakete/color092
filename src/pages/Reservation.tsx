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
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { format, addDays, addMonths } from "date-fns";
import { cn } from "@/lib/utils";

type ReservationType = "現地調査" | "Zoomオンライン相談";
type ReservationStatus = "予約待ち" | "確定" | "完了" | "キャンセル";

interface ReservationSettings {
  zoom_cutoff_days: number;
  site_cutoff_days: number;
  calendar_months: number;
  business_start: string;
  business_end: string;
  slot_interval_minutes: number;
}

const DEFAULT_SETTINGS: ReservationSettings = {
  zoom_cutoff_days: 1,
  site_cutoff_days: 3,
  calendar_months: 2,
  business_start: "09:00",
  business_end: "17:00",
  slot_interval_minutes: 30,
};

interface ReservationFormData {
  type: ReservationType | "";
  date: Date | undefined;
  time: string;
  date2: Date | undefined;
  time2: string;
  address: string;
  notes: string;
}

const buildTimeSlots = (s: ReservationSettings): string[] => {
  const slots: string[] = [];
  const [sh, sm] = s.business_start.split(":").map(Number);
  const [eh, em] = s.business_end.split(":").map(Number);
  const startMin = sh * 60 + sm;
  const endMin   = eh * 60 + em;
  for (let m = startMin; m <= endMin; m += s.slot_interval_minutes) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`);
  }
  return slots;
};

const Reservation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const estimateId = searchParams.get("estimate_id");

  const [settings, setSettings] = useState<ReservationSettings>(DEFAULT_SETTINGS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [zoomUrl, setZoomUrl] = useState<string>("");

  const [formData, setFormData] = useState<ReservationFormData>({
    type: "",
    date: undefined,
    time: "",
    date2: undefined,
    time2: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("reservation_settings")
          .select("*")
          .eq("id", "default")
          .single();
        if (!error && data) {
          setSettings({
            zoom_cutoff_days:      data.zoom_cutoff_days      ?? DEFAULT_SETTINGS.zoom_cutoff_days,
            site_cutoff_days:      data.site_cutoff_days      ?? DEFAULT_SETTINGS.site_cutoff_days,
            calendar_months:       data.calendar_months       ?? DEFAULT_SETTINGS.calendar_months,
            business_start:        data.business_start        ?? DEFAULT_SETTINGS.business_start,
            business_end:          data.business_end          ?? DEFAULT_SETTINGS.business_end,
            slot_interval_minutes: data.slot_interval_minutes ?? DEFAULT_SETTINGS.slot_interval_minutes,
          });
          return;
        }
      } catch { /* ignore */ }
      const local = localStorage.getItem("reservation_settings");
      if (local) { try { setSettings(JSON.parse(local)); } catch { /* ignore */ } }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    if (!estimateId) {
      const lastEstimate = localStorage.getItem("last_estimate");
      if (!lastEstimate) {
        toast({ title: "見積もりが必要です", description: "まずは見積もりを完了してください。", variant: "destructive" });
        navigate("/estimate");
      }
    }
  }, [estimateId, navigate, toast]);

  const updateFormData = <K extends keyof ReservationFormData>(field: K, value: ReservationFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTypeChange = (value: ReservationType) => {
    setFormData((prev) => ({ ...prev, type: value, date: undefined, time: "", date2: undefined, time2: "" }));
  };

  const isDateDisabled = (date: Date, isSecond = false): boolean => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (date < today) return true;
    const cutoff = formData.type === "現地調査" ? settings.site_cutoff_days : settings.zoom_cutoff_days;
    if (date < addDays(today, cutoff)) return true;
    if (date > addMonths(today, settings.calendar_months)) return true;
    if (isSecond && formData.date) {
      const d1 = new Date(formData.date); d1.setHours(0, 0, 0, 0);
      const d2 = new Date(date);          d2.setHours(0, 0, 0, 0);
      if (d1.getTime() === d2.getTime()) return true;
    }
    return false;
  };

  const timeSlots = buildTimeSlots(settings);

  const isTimePast = (time: string, date: Date | undefined): boolean => {
    if (!date) return false;
    const isToday = new Date(date).toDateString() === new Date().toDateString();
    if (!isToday) return false;
    const [h, m] = time.split(":").map(Number);
    const now = new Date();
    return h < now.getHours() || (h === now.getHours() && m <= now.getMinutes());
  };

  const validateForm = (): boolean => {
    if (!formData.type) { toast({ title: "入力エラー", description: "予約種別を選択してください。", variant: "destructive" }); return false; }
    if (!formData.date) { toast({ title: "入力エラー", description: "第1希望日を選択してください。", variant: "destructive" }); return false; }
    if (isDateDisabled(formData.date)) { toast({ title: "入力エラー", description: "選択できない日付です。", variant: "destructive" }); return false; }
    if (!formData.time) { toast({ title: "入力エラー", description: "第1希望時間を選択してください。", variant: "destructive" }); return false; }
    if (formData.type === "現地調査" && !formData.address.trim()) { toast({ title: "入力エラー", description: "住所を入力してください。", variant: "destructive" }); return false; }
    if (formData.type === "現地調査" && formData.date2 && !formData.time2) { toast({ title: "入力エラー", description: "第2希望日を選択した場合は時間も選択してください。", variant: "destructive" }); return false; }
    return true;
  };

  const createZoomMeeting = async (date: Date, time: string, customerName?: string): Promise<string | null> => {
    try {
      const pad = (n: number) => String(n).padStart(2, "0");
      const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
      const res = await fetch("/api/create-zoom-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dateStr, time, customerName }),
      });
      if (!res.ok) { const err = (await res.json().catch(() => ({}))) as { error?: string }; throw new Error(err.error ?? `HTTP ${res.status}`); }
      const data = (await res.json()) as { join_url: string };
      return data.join_url;
    } catch { return null; }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !estimateId) return;
    setIsSubmitting(true);
    try {
      let zoomUrlResult = "";
      if (formData.type === "Zoomオンライン相談" && formData.date) {
        const customerNameParam = searchParams.get("customer_name") ?? undefined;
        const url = await createZoomMeeting(formData.date, formData.time, customerNameParam);
        if (url) { zoomUrlResult = url; setZoomUrl(url); }
        else { toast({ title: "Zoomミーティング作成に失敗", description: "予約は保存されますが、Zoom URLは後でメールにてお送りします。" }); }
      }
      const dateString  = formData.date  ? format(formData.date,  "yyyy-MM-dd") : "";
      const date2String = formData.date2 ? format(formData.date2, "yyyy-MM-dd") : null;
      const datetimeStr = formData.date && formData.time ? `${dateString}T${formData.time}:00` : null;
      const { data, error } = await supabase.from("reservations").insert({
        estimate_id: estimateId,
        type:        formData.type,
        date:        dateString,
        time:        formData.time,
        date2:       date2String,
        time2:       formData.time2 || null,
        datetime:    datetimeStr,
        address:     formData.type === "現地調査" ? formData.address : null,
        notes:       formData.notes || null,
        zoom_url:    zoomUrlResult || null,
        status:      "予約待ち",
        created_at:  new Date().toISOString(),
      }).select().single();
      if (error) {
        if (error.message?.includes("fetch") || error.message?.includes("network")) {
          const localRes = { id: `local_${Date.now()}`, estimate_id: estimateId, type: formData.type, date: dateString, time: formData.time, date2: date2String, time2: formData.time2 || null, address: formData.type === "現地調査" ? formData.address : null, notes: formData.notes || null, zoom_url: zoomUrlResult || null, status: "予約待ち" as ReservationStatus, created_at: new Date().toISOString() };
          localStorage.setItem("last_reservation", JSON.stringify(localRes));
          setIsCompleted(true);
          return;
        }
        throw error;
      }
      setIsCompleted(true);
      toast({ title: "予約が完了しました", description: "予約情報を確認してください。" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "予約の保存に失敗しました。";
      toast({ title: "エラーが発生しました", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── 完了画面 ──────────────────────────────────────────────────────────────
  if (isCompleted) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-20">
          <section className="relative py-24 bg-hero-gradient overflow-hidden">
            <div className="container mx-auto px-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink to-accent flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">予約が完了しました</h1>
                <p className="text-muted-foreground text-lg mb-8">ご予約ありがとうございます。担当者より確認のご連絡をさせていただきます。</p>
                <div className="bg-card rounded-3xl p-8 shadow-lg border border-border text-left space-y-4">
                  <div className="flex justify-between items-center"><span className="text-muted-foreground">予約種別</span><span className="font-medium">{formData.type}</span></div>
                  <div className="flex justify-between items-center"><span className="text-muted-foreground">第1希望</span><span className="font-medium">{formData.date ? format(formData.date, "yyyy年MM月dd日") : ""} {formData.time}</span></div>
                  {formData.type === "現地調査" && formData.date2 && (
                    <div className="flex justify-between items-center"><span className="text-muted-foreground">第2希望</span><span className="font-medium">{format(formData.date2, "yyyy年MM月dd日")} {formData.time2}</span></div>
                  )}
                  {formData.type === "現地調査" && formData.address && (
                    <div className="flex justify-between items-start"><span className="text-muted-foreground">住所</span><span className="font-medium text-right max-w-xs">{formData.address}</span></div>
                  )}
                  {formData.type === "Zoomオンライン相談" && zoomUrl && (
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center gap-2 mb-2"><Video className="w-5 h-5 text-primary" /><span className="font-medium">ZoomミーティングURL</span></div>
                      <a href={zoomUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{zoomUrl}</a>
                    </div>
                  )}
                  {formData.notes && (<div className="pt-4 border-t border-border"><span className="text-muted-foreground block mb-2">備考</span><p className="text-sm">{formData.notes}</p></div>)}
                </div>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => navigate("/")} variant="outline"><Home className="w-4 h-4 mr-2" />ホームに戻る</Button>
                  <Button onClick={() => navigate("/estimate")} className="btn-gradient">新しい見積もり</Button>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  // ── サブコンポーネント ─────────────────────────────────────────────────────
  const DatePicker = ({ label, value, onChange, isSecond = false, required = false }: {
    label: string; value: Date | undefined; onChange: (d: Date | undefined) => void;
    isSecond?: boolean; required?: boolean;
  }) => (
    <div className="space-y-2">
      <Label className="font-medium">{label} {required && <span className="text-destructive">*</span>}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "yyyy年MM月dd日") : <span>日付を選択してください</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={value} onSelect={onChange} disabled={(d) => isDateDisabled(d, isSecond)} initialFocus />
        </PopoverContent>
      </Popover>
    </div>
  );

  const TimePicker = ({ label, value, onChange, targetDate, required = false }: {
    label: string; value: string; onChange: (v: string) => void;
    targetDate: Date | undefined; required?: boolean;
  }) => (
    <div className="space-y-2">
      <Label className="font-medium">{label} {required && <span className="text-destructive">*</span>}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger><Clock className="mr-2 h-4 w-4" /><SelectValue placeholder="時間を選択" /></SelectTrigger>
        <SelectContent>
          {timeSlots.map((t) => {
            const past = isTimePast(t, targetDate);
            return <SelectItem key={t} value={t} disabled={past}>{t}{past ? "　（受付終了）" : ""}</SelectItem>;
          })}
        </SelectContent>
      </Select>
    </div>
  );

  const siteCutoffLabel = settings.site_cutoff_days === 0 ? "当日" : `${settings.site_cutoff_days}日後以降`;
  const zoomCutoffLabel = settings.zoom_cutoff_days === 0 ? "当日" : `${settings.zoom_cutoff_days}日後以降`;

  // ── フォーム ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <section className="relative py-16 bg-hero-gradient overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"><div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-pink/10 blur-3xl" /></div>
          <div className="container mx-auto px-4 relative">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
              <span className="section-label">Reservation</span>
              <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">予約フォーム</h1>
              <p className="text-muted-foreground text-lg">現地調査またはZoomオンライン相談のご予約をお受けします。</p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-10">

                {/* 予約種別 */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">予約種別 <span className="text-destructive">*</span></Label>
                  <RadioGroup value={formData.type} onValueChange={(v) => handleTypeChange(v as ReservationType)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                        <RadioGroupItem value="現地調査" id="onsite" className="mt-1" />
                        <Label htmlFor="onsite" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2 mb-1"><MapPin className="w-5 h-5 text-primary" /><span className="font-medium">現地調査（訪問）</span></div>
                          <div className="text-sm text-muted-foreground mb-1">スタッフが現地にお伺いして調査いたします</div>
                          <span className="text-xs text-primary font-medium">※ {siteCutoffLabel}から受付 · 第1・第2希望日あり</span>
                        </Label>
                      </div>
                      <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                        <RadioGroupItem value="Zoomオンライン相談" id="zoom" className="mt-1" />
                        <Label htmlFor="zoom" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2 mb-1"><Video className="w-5 h-5 text-primary" /><span className="font-medium">Zoomオンライン相談</span></div>
                          <div className="text-sm text-muted-foreground mb-1">オンラインでご相談いただけます</div>
                          <span className="text-xs text-primary font-medium">※ {zoomCutoffLabel}から受付</span>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* 日時選択 */}
                {formData.type && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <p className="text-sm text-muted-foreground">
                      営業時間：{settings.business_start}〜{settings.business_end}（{settings.slot_interval_minutes}分単位）　予約可能期間：今日から{settings.calendar_months}ヶ月先まで
                    </p>

                    {formData.type === "現地調査" && (
                      <>
                        <div className="bg-primary/5 rounded-xl border border-primary/20 p-5 space-y-4">
                          <h3 className="font-semibold text-primary">第1希望</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DatePicker label="希望日" value={formData.date} onChange={(d) => updateFormData("date", d)} required />
                            <TimePicker label="希望時間" value={formData.time} onChange={(v) => updateFormData("time", v)} targetDate={formData.date} required />
                          </div>
                        </div>
                        <div className="bg-secondary/50 rounded-xl border border-border p-5 space-y-4">
                          <h3 className="font-semibold text-muted-foreground">第2希望（任意）</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DatePicker label="希望日" value={formData.date2} onChange={(d) => updateFormData("date2", d)} isSecond />
                            <TimePicker label="希望時間" value={formData.time2} onChange={(v) => updateFormData("time2", v)} targetDate={formData.date2} />
                          </div>
                          {formData.date2 && !formData.time2 && (
                            <p className="text-xs text-amber-600">第2希望日を選択した場合は時間も選択してください</p>
                          )}
                        </div>
                      </>
                    )}

                    {formData.type === "Zoomオンライン相談" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DatePicker label="希望日" value={formData.date} onChange={(d) => updateFormData("date", d)} required />
                        <TimePicker label="希望時間" value={formData.time} onChange={(v) => updateFormData("time", v)} targetDate={formData.date} required />
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 住所 */}
                {formData.type === "現地調査" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4">
                    <Label htmlFor="address" className="text-lg font-semibold">住所 <span className="text-destructive">*</span></Label>
                    <Input id="address" placeholder="〒123-4567 福岡県福岡市..." value={formData.address} onChange={(e) => updateFormData("address", e.target.value)} />
                  </motion.div>
                )}

                {/* 備考 */}
                <div className="space-y-4">
                  <Label htmlFor="notes" className="text-lg font-semibold">備考</Label>
                  <Textarea id="notes" placeholder="ご要望やご質問があればご記入ください" rows={4} value={formData.notes} onChange={(e) => updateFormData("notes", e.target.value)} />
                </div>

                {/* 注意事項 */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium mb-1">ご注意</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>予約確定後、担当者より確認のご連絡をさせていただきます。</li>
                        <li>Zoomオンライン相談の場合、予約完了後すぐにミーティングURLが発行されます。</li>
                        <li>キャンセルや変更のご希望は、お電話（090-6120-2995）までご連絡ください。</li>
                        {formData.type === "現地調査" && <li>現地調査は第1希望日から順に日程を調整いたします。</li>}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 送信 */}
                <div className="flex justify-end gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => navigate("/estimate")}>戻る</Button>
                  <Button type="submit" disabled={isSubmitting} className="btn-gradient">
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
