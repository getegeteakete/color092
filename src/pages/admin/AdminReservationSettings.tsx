import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Save, Clock, CalendarDays, AlertCircle } from "lucide-react";

interface ReservationSettings {
  zoom_cutoff_days: number;      // Zoom: 何日前まで受付
  site_cutoff_days: number;      // 現地調査: 何日前まで受付（最低3日）
  calendar_months: number;       // 何ヶ月先まで予約可能
  business_start: string;        // 営業開始時間
  business_end: string;          // 営業終了時間
  slot_interval_minutes: number; // 時間スロット間隔（分）
}

const DEFAULT_SETTINGS: ReservationSettings = {
  zoom_cutoff_days: 1,
  site_cutoff_days: 3,
  calendar_months: 2,
  business_start: "09:00",
  business_end: "17:00",
  slot_interval_minutes: 30,
};

const AdminReservationSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<ReservationSettings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
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
      } else {
        // Supabaseにテーブルがない場合はlocalStorageから読む
        const local = localStorage.getItem("reservation_settings");
        if (local) setSettings(JSON.parse(local));
      }
    } catch {
      const local = localStorage.getItem("reservation_settings");
      if (local) setSettings(JSON.parse(local));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    // バリデーション
    if (settings.site_cutoff_days < 3) {
      toast({ title: "入力エラー", description: "現地調査の受付締切は3日前以上に設定してください。", variant: "destructive" });
      return;
    }
    if (settings.zoom_cutoff_days < 0) {
      toast({ title: "入力エラー", description: "Zoom相談の受付締切は0日以上に設定してください。", variant: "destructive" });
      return;
    }
    if (settings.calendar_months < 1 || settings.calendar_months > 6) {
      toast({ title: "入力エラー", description: "カレンダー表示は1〜6ヶ月の範囲で設定してください。", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      // Supabaseに保存
      const { error } = await supabase
        .from("reservation_settings")
        .upsert({ id: "default", ...settings, updated_at: new Date().toISOString() });

      if (error) throw error;

      // localStorageにも保存（フォールバック用）
      localStorage.setItem("reservation_settings", JSON.stringify(settings));

      toast({ title: "設定を保存しました", description: "予約フォームに反映されました。" });
    } catch {
      // Supabase失敗時はlocalStorageのみに保存
      localStorage.setItem("reservation_settings", JSON.stringify(settings));
      toast({ title: "設定をローカルに保存しました", description: "Supabaseテーブルが未作成の場合はSQLを実行してください。" });
    } finally {
      setIsSaving(false);
    }
  };

  const update = (key: keyof ReservationSettings, value: number | string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // プレビュー：時間スロット生成
  const previewSlots = () => {
    const slots: string[] = [];
    const [sh, sm] = settings.business_start.split(":").map(Number);
    const [eh, em] = settings.business_end.split(":").map(Number);
    const startMin = sh * 60 + sm;
    const endMin   = eh * 60 + em;
    const interval = settings.slot_interval_minutes;
    for (let m = startMin; m <= endMin; m += interval) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      slots.push(`${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`);
    }
    return slots;
  };

  if (isLoading) {
    return (
  
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
  
    );
  }

  const slots = previewSlots();

  return (

      <div className="max-w-3xl mx-auto space-y-8">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">予約設定</h1>
            <p className="text-muted-foreground mt-1">予約フォームの受付ルールを管理します</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="btn-gradient">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "保存中..." : "設定を保存"}
          </Button>
        </div>

        {/* 現地調査 設定 */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">現地調査の設定</h2>
              <p className="text-sm text-muted-foreground">スタッフが訪問する現地調査の予約ルール</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-medium">受付締切（予約日の何日前まで）</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={3}
                  max={30}
                  value={settings.site_cutoff_days}
                  onChange={(e) => update("site_cutoff_days", parseInt(e.target.value) || 3)}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">日前まで受付</span>
              </div>
              <p className="text-xs text-muted-foreground">※ 最低3日前以上に設定してください</p>
            </div>

            <div className="space-y-2">
              <Label className="font-medium">希望日の入力</Label>
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                <span className="text-sm font-medium text-primary">第1希望・第2希望</span>
                <span className="text-xs text-muted-foreground">（固定）</span>
              </div>
              <p className="text-xs text-muted-foreground">現地調査は第1・第2希望日を入力できます</p>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800 dark:text-amber-300">
                現在の設定では今日から <strong>{settings.site_cutoff_days}日後</strong> 以降の日付のみ選択できます
              </p>
            </div>
          </div>
        </div>

        {/* Zoom相談 設定 */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Zoom相談の設定</h2>
              <p className="text-sm text-muted-foreground">オンライン相談の予約ルール</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-medium">受付締切（予約日の何日前まで）</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                max={30}
                value={settings.zoom_cutoff_days}
                onChange={(e) => update("zoom_cutoff_days", parseInt(e.target.value) || 0)}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">日前まで受付（0 = 当日OK）</span>
            </div>
          </div>
        </div>

        {/* カレンダー設定 */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">カレンダー表示</h2>
              <p className="text-sm text-muted-foreground">予約フォームのカレンダー表示範囲</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-medium">予約可能期間</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={6}
                value={settings.calendar_months}
                onChange={(e) => update("calendar_months", parseInt(e.target.value) || 2)}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">ヶ月先まで予約可能（1〜6ヶ月）</span>
            </div>
          </div>
        </div>

        {/* 営業時間設定 */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">営業時間・時間スロット</h2>
              <p className="text-sm text-muted-foreground">予約できる時間帯の設定</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="font-medium">営業開始時間</Label>
              <Input
                type="time"
                value={settings.business_start}
                onChange={(e) => update("business_start", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-medium">営業終了時間</Label>
              <Input
                type="time"
                value={settings.business_end}
                onChange={(e) => update("business_end", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-medium">時間間隔</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={15}
                  max={60}
                  step={15}
                  value={settings.slot_interval_minutes}
                  onChange={(e) => update("slot_interval_minutes", parseInt(e.target.value) || 30)}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">分単位</span>
              </div>
            </div>
          </div>

          {/* 時間スロットプレビュー */}
          <div className="space-y-3">
            <Label className="font-medium text-sm text-muted-foreground">
              時間スロット プレビュー（{slots.length}枠）
            </Label>
            <div className="flex flex-wrap gap-2">
              {slots.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 bg-secondary rounded-full text-sm font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* SQL案内 */}
        <div className="bg-secondary/50 rounded-2xl border border-border p-6 space-y-3">
          <h3 className="font-semibold text-sm">Supabase テーブルが未作成の場合</h3>
          <p className="text-sm text-muted-foreground">
            SQL Editorで以下を実行してください（一度だけ）:
          </p>
          <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-xs overflow-x-auto">
{`CREATE TABLE reservation_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  zoom_cutoff_days INT NOT NULL DEFAULT 1,
  site_cutoff_days INT NOT NULL DEFAULT 3,
  calendar_months INT NOT NULL DEFAULT 2,
  business_start TEXT NOT NULL DEFAULT '09:00',
  business_end TEXT NOT NULL DEFAULT '17:00',
  slot_interval_minutes INT NOT NULL DEFAULT 30,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE reservation_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON reservation_settings FOR ALL USING (true) WITH CHECK (true);
INSERT INTO reservation_settings (id) VALUES ('default') ON CONFLICT DO NOTHING;

-- reservations テーブルに第2希望カラム追加
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS date2 DATE;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS time2 TEXT;`}
          </pre>
        </div>

        {/* 保存ボタン（下部） */}
        <div className="flex justify-end pb-8">
          <Button onClick={handleSave} disabled={isSaving} size="lg" className="btn-gradient">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "保存中..." : "設定を保存する"}
          </Button>
        </div>
      </div>

  );
};

export default AdminReservationSettings;
