import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";
    
    if (password === adminPassword) {
      // セッションに保存
      sessionStorage.setItem("admin_authenticated", "true");
      toast({
        title: "ログイン成功",
        description: "管理画面にアクセスしました。",
      });
      navigate("/admin/dashboard");
    } else {
      toast({
        title: "ログイン失敗",
        description: "パスワードが正しくありません。",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">管理者ログイン</h1>
            <p className="text-muted-foreground">営業進捗管理ダッシュボード</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                className="mt-2"
                required
                autoFocus
              />
            </div>

            <Button
              type="submit"
              className="w-full btn-gradient"
              disabled={isLoading}
            >
              {isLoading ? (
                "ログイン中..."
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  ログイン
                </>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
