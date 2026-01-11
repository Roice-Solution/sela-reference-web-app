import { LogOut, Menu, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/i18n";
import topNavImage from "../../assets/top-nav.jpeg";
export function TopNavigation({ currentPage, onNavigate, onLogout, userEmail }) {
    const { t, language, setLanguage } = useI18n();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const mobileMenuRef = useRef(null);
    useEffect(() => {
        if (!showMobileMenu) return;
        const handleClick = (event) => {
            if (!mobileMenuRef.current) return;
            if (mobileMenuRef.current.contains(event.target)) return;
            setShowMobileMenu(false);
        };
        document.addEventListener("mousedown", handleClick);
        document.addEventListener("touchstart", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("touchstart", handleClick);
        };
    }, [showMobileMenu]);
    const menuItems = [
        { id: "home", label: t("nav.home") },
        { id: "companies", label: t("nav.companies") },
        { id: "master-products", label: t("nav.masterProducts") },
        { id: "master-agents", label: t("nav.masterAgents") },
        { id: "products-per-company", label: t("nav.productsPerCompany") },
        { id: "agents-per-company", label: t("nav.agentsPerCompany") },
        { id: "user-access", label: t("nav.userAccess") },
        { id: "excel-upload", label: t("nav.excelUpload") },
    ];
    return (<nav className="bg-white border-b-2 border-blue-100 shadow-md sticky top-0 z-50">
      <div className="w-full mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <button type="button" onClick={() => onNavigate("home")} className="flex items-center gap-3 rounded-xl transition hover:opacity-90" aria-label={t("nav.home")}>
            <img src={topNavImage} alt="Top navigation" className="w-24 h-12 rounded-xl object-cover border border-blue-100"/>
            <h1 className="text-xl font-bold text-blue-900">{t("app.shortName")}</h1>
          </button>

          <div className="hidden xl:flex items-center gap-1">
            {menuItems.map((item) => (<button key={item.id} onClick={() => onNavigate(item.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${currentPage === item.id
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}`}>
                {item.label}
              </button>))}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button type="button" onClick={() => setShowMobileMenu((open) => !open)} className="xl:hidden inline-flex items-center justify-center p-2 rounded-full border-2 border-blue-100 text-blue-700 hover:bg-blue-50" aria-label="Toggle navigation menu">
              {showMobileMenu ? <X className="w-4 h-4"/> : <Menu className="w-4 h-4"/>}
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <label htmlFor="language-select" className="text-xs text-gray-500">
                {t("language.label")}
              </label>
              <select id="language-select" value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm">
                <option value="en">{t("language.english")}</option>
                <option value="he">{t("language.hebrew")}</option>
              </select>
            </div>
            <div className="relative">
              <button onClick={() => setShowUserMenu((open) => !open)} className="flex items-center gap-2 px-3 py-2 rounded-full border-2 border-blue-100 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                <User className="w-4 h-4 text-blue-600"/>
                <span className="hidden md:inline text-sm text-gray-700 font-medium">{userEmail}</span>
              </button>
              {showUserMenu && (<>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)}/>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border-2 border-blue-100 z-20 overflow-hidden">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500">{t("nav.myAccount")}</div>
                    <div className="border-t px-4 py-2 text-xs text-gray-500">{userEmail}</div>
                    <button onClick={() => {
                setShowUserMenu(false);
                onLogout();
            }} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors">
                      <LogOut className="w-4 h-4"/>
                      {t("nav.logout")}
                    </button>
                  </div>
                </>)}
            </div>
          </div>
        </div>

        {showMobileMenu && (<div className="xl:hidden pb-4 mt-3 flex flex-col gap-2" ref={mobileMenuRef}>
            {menuItems.map((item) => (<button key={item.id} onClick={() => {
                onNavigate(item.id);
                setShowMobileMenu(false);
            }} className={`w-full px-4 py-2 rounded-full text-sm font-medium transition-all text-left ${currentPage === item.id
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}`}>
                {item.label}
              </button>))}
          </div>)}
      </div>
    </nav>);
}
