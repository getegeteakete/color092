import { useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  // 未存在のルート: location.pathname にアクセスされた

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">ページが見つかりません</p>
        <p className="mb-6 text-sm text-muted-foreground">{location.pathname}</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          ホームに戻る
        </a>
      </div>
    </div>
  );
};

export default NotFound;
