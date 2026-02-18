import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GradientDivider } from "@/components/ui/gradient-divider";

const navItems = [
  { label: "HOME", path: "/" },
  { label: "施工実績", path: "/works" },
  { label: "事業内容", path: "/service" },
  { label: "お知らせ", path: "/news" },
  { label: "災害保険", path: "/insurance" },
  { label: "会社概要", path: "/company" },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md shadow-sm">
      {/* 多色グラデライン（上品に） */}
      <div className="absolute top-0 left-0 right-0">
        <GradientDivider thickness="thin" />
      </div>
      <div className="container mx-auto px-4 header-inner">
        <div className="flex items-center justify-center h-20">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-foreground/80"
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5"
                    style={{
                      background: "linear-gradient(to right, hsl(var(--accent-1)), hsl(var(--accent-2)), hsl(var(--accent-3)), hsl(var(--accent-4)), hsl(var(--accent-5)), hsl(var(--accent-6)))",
                    }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <Link
            to="/contact"
            className="hidden lg:flex items-center gap-2 btn-gradient text-sm hover:scale-105 transition-transform ml-8"
          >
            お問い合わせ
            <ChevronRight className="w-4 h-4" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden absolute right-4 p-2 text-foreground"
            aria-label="メニューを開く"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card border-t border-border"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "bg-secondary text-primary"
                      : "text-foreground/80 hover:bg-secondary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="btn-gradient text-center mt-2"
              >
                お問い合わせ
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
