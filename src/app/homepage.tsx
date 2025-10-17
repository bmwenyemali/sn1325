import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Stats } from "@/components/home/Stats";
import { Axes } from "@/components/home/Axes";
import { LoginForm } from "@/components/auth/LoginForm";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <main>
        {/* Section Hero */}
        <Hero />

        {/* Section À propos */}
        <About />

        {/* Section Statistiques */}
        <Stats />

        {/* Section Axes stratégiques */}
        <Axes />

        {/* Section Connexion */}
        <section id="login" className="py-16 bg-white">
          <div className="container-rdc">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-bleu-rdc mb-4">
                  Accès à la plateforme
                </h2>
                <p className="text-gray-600">
                  Connectez-vous pour accéder au système de monitoring
                </p>
              </div>

              <LoginForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
