import { Link } from "react-router-dom";

/**
 * ブランドロゴサイドバー
 * 左上に固定表示される大きなロゴエリア
 */
export const BrandSide = () => {
  return (
    <div className="brand-side">
      <Link to="/" className="flex items-center justify-center w-full h-full">
        <img
          src="/rogo.png"
          alt="COLORS ロゴ"
          className="brand-side-logo"
        />
      </Link>
    </div>
  );
};
