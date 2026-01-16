import { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { useI18n } from "../i18n/i18n";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import loginHero from "../../assets/login-hero.png";
export function LoginPage({ onLogin, isLoading }) {
    const { t, language, setLanguage } = useI18n();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!email) {
            newErrors.email = t("auth.errors.emailRequired");
        }
        else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = t("auth.errors.emailInvalid");
        }
        if (!password) {
            newErrors.password = t("auth.errors.passwordRequired");
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            onLogin(email, password);
        }
    };
    return (<div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-400/20 blur-3xl" />
      </div>
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex transition-all duration-300 hover:shadow-3xl">
        <div className="hidden lg:block lg:w-1/2 relative">
          <ImageWithFallback src={loginHero} alt="Login illustration" className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 to-indigo-900/20 flex items-end p-8">
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-2">{t("auth.leftTitle")}</h3>
              <p className="text-indigo-100">{t("auth.leftSubtitle")}</p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          <div className="flex justify-end">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <label htmlFor="login-language" className="text-xs">
                {t("language.label")}
              </label>
              <select id="login-language" value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm">
                <option value="en">{t("language.english")}</option>
                <option value="he">{t("language.hebrew")}</option>
              </select>
            </div>
          </div>
          <div className="space-y-6 mt-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-br from-indigo-600 to-cyan-500">
                <span className="text-white text-2xl font-bold">SELA</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{t("auth.title")}</h2>
              <p className="text-gray-600 mt-2">{t("auth.subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t("auth.email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500"/>
                  <input id="email" type="email" placeholder={t("auth.emailPlaceholder")} value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus-brand ${errors.email ? "border-red-500" : "border-gray-200"}`} disabled={isLoading}/>
                </div>
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  {t("auth.password")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500"/>
                  <input id="password" type="password" placeholder={t("auth.passwordPlaceholder")} value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus-brand ${errors.password ? "border-red-500" : "border-gray-200"}`} disabled={isLoading}/>
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>

              <button type="submit" className="w-full btn-primary py-3 transition-all duration-200 shadow-lg hover:scale-105 hover:shadow-2xl active:scale-95" disabled={isLoading}>
                {isLoading ? t("auth.signingIn") : t("auth.signIn")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>);
}
