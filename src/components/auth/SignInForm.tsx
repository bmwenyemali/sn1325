"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Identifiants incorrects");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setError("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Champ email */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gris-fonce"
        >
          Adresse email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gris-moyen" />
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent transition-all duration-200"
            placeholder="admin@sn1325.cd"
          />
        </div>
      </div>

      {/* Champ mot de passe */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gris-fonce"
        >
          Mot de passe
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gris-moyen" />
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent transition-all duration-200"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gris-moyen hover:text-gris-fonce" />
            ) : (
              <Eye className="h-5 w-5 text-gris-moyen hover:text-gris-fonce" />
            )}
          </button>
        </div>
      </div>

      {/* Bouton de connexion */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
          isLoading
            ? "bg-gris-moyen cursor-not-allowed"
            : "bg-bleu-rdc hover:bg-bleu-rdc-600 active:bg-bleu-rdc-700"
        } text-white shadow-lg hover:shadow-xl`}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <LogIn className="w-5 h-5" />
        )}
        {isLoading ? "Connexion..." : "Se connecter"}
      </button>

      {/* Informations de test */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800 font-medium mb-2">
          Compte administrateur :
        </p>
        <div className="text-xs text-amber-700 space-y-1">
          <p>
            <strong>Email :</strong> admin@sn1325.cd
          </p>
          <p>
            <strong>Mot de passe :</strong> admin123
          </p>
        </div>
      </div>
    </form>
  );
}
