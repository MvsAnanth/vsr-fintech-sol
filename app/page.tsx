import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import FinancialTools from "@/components/tools/FinancialTools";
import VideoSection from "@/components/VideoSection";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <FinancialTools />
      <VideoSection />
      <Achievements />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
