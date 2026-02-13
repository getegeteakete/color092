import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  List, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    toast({
      title: "ログアウトしました",
      description: "管理画面からログアウトしました。",
    });
    navigate("/admin");
  };

  const menuItems = [
    { path: "/admin/dashboard", label: "ダッシュボード", icon: LayoutDashboard },
    { path: "/admin/list", label: "案件一覧", icon: List },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* モバイルヘッダー */}
      <div className="lg:hidden bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold">管理画面</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* サイドバー */}
        <aside
          className={cn(
            "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transition-transform duration-300",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold">営業管理</h2>
              <p className="text-sm text-muted-foreground mt-1">ダッシュボード</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary text-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-border">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                ログアウト
              </Button>
            </div>
          </div>
        </aside>

        {/* オーバーレイ（モバイル） */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* メインコンテンツ */}
        <main className="flex-1 lg:ml-0">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
