import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-bleu-rdc dark:bg-bleu-rdc text-white dark:text-white">
      <div className="container-rdc py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/LogoSN1325.png"
                alt="Logo SN1325"
                width={48}
                height={48}
                className="object-contain bg-white rounded-lg p-1"
              />
              <div>
                <h3 className="text-xl font-bold text-white">SN1325 RDC</h3>
                <p className="text-blue-200 dark:text-blue-200 text-sm">
                  Secrétariat National 1325
                </p>
              </div>
            </div>
            <p className="text-blue-100 dark:text-blue-100 mb-4 leading-relaxed">
              Base de données de monitoring de la Résolution 1325 du Conseil de
              Sécurité des Nations Unies sur les Femmes, la Paix et la Sécurité
              en République Démocratique du Congo.
            </p>
            <div className="flex items-center space-x-4">
              <span className="w-6 h-1 bg-jaune-rdc rounded"></span>
              <span className="w-6 h-1 bg-rouge-rdc rounded"></span>
              <span className="w-6 h-1 bg-jaune-rdc rounded"></span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-300" />
                <span className="text-blue-100 text-sm">
                  sn1325@genre.gouv.cd
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-blue-300" />
                <span className="text-blue-100 text-sm">+243 123 456 789</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-blue-300 mt-0.5" />
                <span className="text-blue-100 text-sm">
                  Ministère du Genre, Famille et Enfant
                  <br />
                  Kinshasa, RDC
                </span>
              </div>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
            <div className="space-y-2">
              <Link
                href="https://www.un.org/womenwatch/osagi/conceptsandefinitions.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span className="text-sm">Résolution 1325 ONU</span>
              </Link>
              <Link
                href="https://www.genre.gouv.cd"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span className="text-sm">Ministère du Genre</span>
              </Link>
              <Link
                href="#about"
                className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors"
              >
                <span className="text-sm">Documentation</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Section Partenaires */}
        <div className="border-t border-blue-600 mt-8 pt-8">
          <h4 className="text-lg font-semibold mb-4 text-center">
            Nos Partenaires
          </h4>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <Image
              src="/logoOnufemme.jpg"
              alt="ONU Femmes"
              width={120}
              height={60}
              className="object-contain bg-white p-2 rounded"
            />
            <Image
              src="/LogoMinistere.jpg"
              alt="Ministère du Genre"
              width={100}
              height={60}
              className="object-contain bg-white p-2 rounded"
            />
            <Image
              src="/norvege.png"
              alt="Norvège"
              width={120}
              height={60}
              className="object-contain bg-white p-2 rounded"
            />
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-blue-600 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-blue-200 text-sm">
              © {new Date().getFullYear()} Ministère du Genre, Famille et Enfant
              - RDC. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-6 mt-4 sm:mt-0">
              <span className="text-blue-200 text-sm">
                Développé par{" "}
                <Link
                  href="https://akiligroup.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-jaune-rdc hover:text-white font-semibold transition-colors"
                >
                  Akili Group
                </Link>
              </span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-jaune-rdc rounded-full"></div>
                <div className="w-2 h-2 bg-rouge-rdc rounded-full"></div>
                <div className="w-2 h-2 bg-jaune-rdc rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
