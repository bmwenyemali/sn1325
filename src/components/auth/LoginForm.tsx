"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
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
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou mot de passe incorrect");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setError("Erreur de connexion. Veuillez réessayer.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto"
    >
      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Header */}
        <div className="text-center pb-6 border-b border-gray-200">
          <div className="w-16 h-16 bg-bleu-rdc rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-bleu-rdc mb-2">Connexion</h3>
          <p className="text-gray-600">
            Accédez à la plateforme de monitoring SN1325
          </p>
        </div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700 text-sm">{error}</span>
          </motion.div>
        )}

        {/* Email field */}
        <div>
          <label htmlFor="email" className="label-field">
            Adresse email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="input-field pl-10"
              placeholder="votre.email@exemple.com"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password field */}
        <div>
          <label htmlFor="password" className="label-field">
            Mot de passe
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="input-field pl-10 pr-10"
              placeholder="••••••••"
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-bleu-rdc focus:ring-bleu-rdc border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700"
            >
              Se souvenir de moi
            </label>
          </div>

          <div className="text-sm">
            <a
              href="#"
              className="text-bleu-rdc hover:text-bleu-rdc-700 font-medium"
            >
              Mot de passe oublié ?
            </a>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading || !formData.email || !formData.password}
          className={`w-full btn-primary flex items-center justify-center space-x-2 ${
            isLoading ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Connexion en cours...</span>
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              <span>Se connecter</span>
            </>
          )}
        </button>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-2">
            Comptes de démonstration :
          </p>
          <div className="space-y-1 text-xs text-blue-700">
            <div>Admin: admin@sn1325.cd / admin123</div>
            <div>Éditeur: editeur@sn1325.cd / edit123</div>
            <div>Consultant: consultant@sn1325.cd / consult123</div>
          </div>
        </div>

        {/* Contact support */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Besoin d&apos;aide ?{" "}
            <a
              href="mailto:support@sn1325.cd"
              className="text-bleu-rdc hover:text-bleu-rdc-700 font-medium"
            >
              Contactez le support
            </a>
          </p>
        </div>
      </form>
    </motion.div>
  );
}
