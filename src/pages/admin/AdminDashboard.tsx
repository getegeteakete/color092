import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FileText, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Status = "仮見積" | "予約済" | "現地調査完了" | "本見積提出" | "成約" | "失注";

interface StatusCount {
  status: Status;
  count: number;
  color: string;
  bgColor: string;
}

const STATUS_CONFIG: Record<Status, { color: string; bgColor: string; label: string }> = {
  仮見積: { color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-900/20", label: "仮見積" },
  予約済: { color: "text-purple-600", bgColor: "bg-purple-50 dark:bg-purple-900/20", label: "予約済" },
  現地調査完了: { color: "text-orange-600", bgColor: "bg-orange-50 dark:bg-orange-900/20", label: "現地調査完了" },
  本見積提出: { color: "text-yellow-600", bgColor: "bg-yellow-50 dark:bg-yellow-900/20", label: "本見積提出" },
  成約: { color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-900/20", label: "成約" },
  失注: { color: "text-red-600", bgColor: "bg-red-50 dark:bg-red-900/20", label: "失注" },
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [statusCounts, setStatusCounts] = useState<StatusCount[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [recentEstimates, setRecentEstimates] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
    // 30秒ごとに自動更新
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // ステータス別集計
      const { data: estimates, error } = await supabase
        .from("estimates")
        .select("status");

      if (error) throw error;

      const counts: Record<Status, number> = {
        仮見積: 0,
        予約済: 0,
        現地調査完了: 0,
        本見積提出: 0,
        成約: 0,
        失注: 0,
      };

      estimates?.forEach((estimate) => {
        const status = (estimate.status || "仮見積") as Status;
        counts[status] = (counts[status] || 0) + 1;
      });

      const statusCountArray: StatusCount[] = Object.entries(counts).map(([status, count]) => ({
        status: status as Status,
        count,
        ...STATUS_CONFIG[status as Status],
      }));

      setStatusCounts(statusCountArray);
      setTotalCount(estimates?.length || 0);

      // 最近の案件（最新5件）
      const { data: recent, error: recentError } = await supabase
        .from("estimates")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (recentError) throw recentError;
      setRecentEstimates(recent || []);
    } catch (error: any) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ダッシュボード</h1>
          <p className="text-muted-foreground mt-1">営業進捗の全体像を把握</p>
        </div>
        <Button onClick={() => navigate("/admin/list")} className="btn-gradient">
          案件一覧を見る
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* 総件数カード */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            総案件数
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary">{totalCount}</div>
          <p className="text-sm text-muted-foreground mt-2">全ステータスの合計</p>
        </CardContent>
      </Card>

      {/* ステータス別カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statusCounts.map((statusCount, index) => (
          <motion.div
            key={statusCount.status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`${statusCount.bgColor} border-2`}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-lg ${statusCount.color} flex items-center gap-2`}>
                  {statusCount.status === "成約" && <CheckCircle2 className="w-5 h-5" />}
                  {statusCount.status === "失注" && <XCircle className="w-5 h-5" />}
                  {statusCount.status !== "成約" && statusCount.status !== "失注" && (
                    <Clock className="w-5 h-5" />
                  )}
                  {statusCount.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${statusCount.color} mb-2`}>
                  {statusCount.count}
                </div>
                <p className="text-sm text-muted-foreground">件</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 最近の案件 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            最近の案件
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentEstimates.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">案件がありません</p>
          ) : (
            <div className="space-y-3">
              {recentEstimates.map((estimate) => (
                <div
                  key={estimate.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/detail/${estimate.id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {estimate.customer_name || "顧客名未設定"}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${STATUS_CONFIG[estimate.status as Status]?.bgColor} ${STATUS_CONFIG[estimate.status as Status]?.color}`}>
                        {estimate.status || "仮見積"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {estimate.building_type} / {estimate.floor_area}㎡ / 
                      {estimate.estimate_min?.toLocaleString()}円 〜 {estimate.estimate_max?.toLocaleString()}円
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(estimate.created_at).toLocaleString("ja-JP")}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
