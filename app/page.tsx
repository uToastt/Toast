import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Videos } from "@/components/videos";
import { Merch } from "@/components/merch";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Videos />
      <Merch />
      <Contact />
      <Footer />
    </main>
  );
}
