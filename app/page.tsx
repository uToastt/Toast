import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Videos } from "@/components/videos";
import { DystopianUniverse } from "@/components/dystopian-universe";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Videos />
      <DystopianUniverse />
      <Footer />
    </main>
  );
}
