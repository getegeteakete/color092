import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  ArrowUpDown,
  Eye,
  Calendar,
  Building2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  created_at: string;
  updated_at?: string;
}

const STATUS_CONFIG: Record<Status, { color: string; bgColor: string }> = {
  仮見積: { color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-900/20" },
  予約済: { color: "text-purple-600", bgColor: "bg-purple-50 dark:bg-purple-900/20" },
  現地調査完了: { color: "text-orange-600", bgColor: "bg-orange-50 dark:bg-orange-900/20" },
  本見積提出: { color: "text-yellow-600", bgColor: "bg-yellow-50 dark:bg-yellow-900/20" },
  成約: { color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-900/20" },
  失注: { color: "text-red-600", bgColor: "bg-red-50 dark:bg-red-900/20" },
};

const AdminList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [filteredEstimates, setFilteredEstimates] = useState<Estimate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    loadEstimates();
  }, []);

  useEffect(() => {
    filterAndSortEstimates();
  }, [estimates, searchQuery, statusFilter, sortBy, sortOrder]);

  const loadEstimates = async () => {
    try {
      const { data, error } = await supabase
        .from("estimates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEstimates(data || []);
    } catch (error: any) {
      console.error("Error loading estimates:", error);
      toast({
        title: "エラー",
        description: "案件の読み込みに失敗しました。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortEstimates = () => {
    let filtered = [...estimates];

    // ステータスフィルタ
    if (statusFilter !== "all") {
      filtered = filtered.filter((e) => e.status === statusFilter);
    }

    // 検索フィルタ
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.customer_name?.toLowerCase().includes(query) ||
          e.customer_phone?.includes(query) ||
          e.customer_email?.toLowerCase().includes(query) ||
          e.building_type.includes(query) ||
          e.id.toLowerCase().includes(query)
      );
    }

    // ソート
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        const amountA = a.estimate_min;
        const amountB = b.estimate_min;
        return sortOrder === "asc" ? amountA - amountB : amountB - amountA;
      }
    });

    setFilteredEstimates(filtered);
  };

  const handleStatusChange = async (estimateId: string, newStatus: Status) => {
    try {
      const { error } = await supabase
        .from("estimates")
        .update({
          status: newStatus,
          status_updated_at: new Date().toISOString(),
        })
        .eq("id", estimateId);

      if (error) throw error;

      toast({
        title: "ステータスを更新しました",
        description: `${newStatus}に変更しました。`,
      });

      loadEstimates();
    } catch (error: any) {
      toast({
        title: "エラー",
        description: "ステータスの更新に失敗しました。",
        variant: "destructive",
      });
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
      <div>
        <h1 className="text-3xl font-bold">案件一覧</h1>
        <p className="text-muted-foreground mt-1">全案件の管理とステータス更新</p>
      </div>

      {/* フィルタ・検索 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="顧客名、電話番号、メールアドレスで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="ステータス" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="仮見積">仮見積</SelectItem>
                <SelectItem value="予約済">予約済</SelectItem>
                <SelectItem value="現地調査完了">現地調査完了</SelectItem>
                <SelectItem value="本見積提出">本見積提出</SelectItem>
                <SelectItem value="成約">成約</SelectItem>
                <SelectItem value="失注">失注</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={(value) => {
                const [by, order] = value.split("-");
                setSortBy(by as "date" | "amount");
                setSortOrder(order as "asc" | "desc");
              }}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue placeholder="並び替え" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">日付: 新しい順</SelectItem>
                <SelectItem value="date-asc">日付: 古い順</SelectItem>
                <SelectItem value="amount-desc">金額: 高い順</SelectItem>
                <SelectItem value="amount-asc">金額: 低い順</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* テーブル */}
      <Card>
        <CardHeader>
          <CardTitle>
            案件一覧 ({filteredEstimates.length}件)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEstimates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">案件が見つかりませんでした</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-sm">顧客名</th>
                    <th className="text-left p-3 font-medium text-sm">建物情報</th>
                    <th className="text-left p-3 font-medium text-sm">見積金額</th>
                    <th className="text-left p-3 font-medium text-sm">ステータス</th>
                    <th className="text-left p-3 font-medium text-sm">作成日</th>
                    <th className="text-left p-3 font-medium text-sm">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEstimates.map((estimate) => (
                    <motion.tr
                      key={estimate.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b hover:bg-secondary/50 transition-colors"
                    >
                      <td className="p-3">
                        <div>
                          <div className="font-medium">
                            {estimate.customer_name || "未設定"}
                          </div>
                          {estimate.customer_phone && (
                            <div className="text-xs text-muted-foreground">
                              {estimate.customer_phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <div className="text-sm">
                            <div>{estimate.building_type}</div>
                            <div className="text-xs text-muted-foreground">
                              {estimate.floor_area}㎡ / {estimate.floors}階
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm">
                          {estimate.estimate_min?.toLocaleString()}円 〜
                          <br />
                          {estimate.estimate_max?.toLocaleString()}円
                        </div>
                      </td>
                      <td className="p-3">
                        <Select
                          value={estimate.status || "仮見積"}
                          onValueChange={(value) =>
                            handleStatusChange(estimate.id, value as Status)
                          }
                        >
                          <SelectTrigger className={`w-[150px] ${STATUS_CONFIG[estimate.status as Status]?.bgColor} border-0`}>
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
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(estimate.created_at).toLocaleDateString("ja-JP")}
                        </div>
                      </td>
                      <td className="p-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/detail/${estimate.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          詳細
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminList;
