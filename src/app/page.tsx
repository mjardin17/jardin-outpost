import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import AppsSection from "@/components/AppsSection";
import StoreSection from "@/components/StoreSection";
import InventorySection from "@/components/InventorySection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <NavBar />
      <main className="flex-1">
        <Hero />
        <AppsSection />
        <StoreSection />
        <InventorySection />
        <ServicesSection />
        <ContactSection />
      </main>
    </div>
  );
}
