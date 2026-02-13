import { motion } from "framer-motion";

export const ExperienceSection = () => {
  return (
    <section className="py-16 bg-card border-t border-border">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="bg-card rounded-2xl shadow-xl p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink to-accent flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">10+</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">実績年数</p>
                <p className="font-bold text-foreground text-lg">年以上の経験</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
