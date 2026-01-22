import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { ServiceSection } from "@/components/home/ServiceSection";
import { FeatureSection } from "@/components/home/FeatureSection";
import { WorksSection } from "@/components/home/WorksSection";
import { NewsSection } from "@/components/home/NewsSection";
import { InsuranceSection } from "@/components/home/InsuranceSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ServiceSection />
        <FeatureSection />
        <WorksSection />
        <NewsSection />
        <InsuranceSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
