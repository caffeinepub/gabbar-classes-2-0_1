import HeroSection from "@/components/Home/HeroSection";
import QuickNavGrid from "@/components/Home/QuickNavGrid";
import StatsBar from "@/components/Home/StatsBar";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <StatsBar />
      <QuickNavGrid />
    </main>
  );
}
