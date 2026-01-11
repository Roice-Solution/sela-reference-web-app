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
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex">
        <div className="hidden lg:block lg:w-1/2 relative">
          <ImageWithFallback src={loginHero} alt="Login illustration" className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-blue-900/20 flex items-end p-8">
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-2">{t("auth.leftTitle")}</h3>
              <p className="text-blue-100">{t("auth.leftSubtitle")}</p>
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
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
                <span className="text-white text-2xl font-bold">SELA</span>
              </div>
              <h2 className="text-2xl font-bold text-blue-900">{t("auth.title")}</h2>
              <p className="text-gray-600 mt-2">{t("auth.subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t("auth.email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400"/>
                  <input id="email" type="email" placeholder={t("auth.emailPlaceholder")} value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full pl-10 pr-3 py-2.5 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? "border-red-500" : "border-gray-200"}`} disabled={isLoading}/>
                </div>
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  {t("auth.password")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400"/>
                  <input id="password" type="password" placeholder={t("auth.passwordPlaceholder")} value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full pl-10 pr-3 py-2.5 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? "border-red-500" : "border-gray-200"}`} disabled={isLoading}/>
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-3 px-4 rounded-full hover:bg-blue-700 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50" disabled={isLoading}>
                {isLoading ? t("auth.signingIn") : t("auth.signIn")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>);
}
