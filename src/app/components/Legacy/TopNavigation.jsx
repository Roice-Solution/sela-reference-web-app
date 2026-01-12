import { LogOut, Menu, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/i18n";
import topNavImage from "../../assets/top-nav.jpeg";
export function TopNavigation({ currentPage, onNavigate, onLogout, userEmail, searchValue, onSearchChange }) {
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
    const currentLabel = menuItems.find((item) => item.id === currentPage)?.label || t("nav.home");
    return (<nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="w-full mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => onNavigate("home")} className="flex items-center gap-3 rounded-xl transition hover:opacity-90" aria-label={t("nav.home")}>
              <img src={topNavImage} alt="Top navigation" className="w-20 h-10 rounded-lg object-cover border border-blue-100"/>
              <h1 className="text-lg font-semibold text-slate-900">{t("app.shortName")}</h1>
            </button>
            <div className="hidden md:flex items-center text-sm text-slate-500">
              <span className="font-medium text-slate-700">{t("home.eyebrow")}</span>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-slate-600">{currentLabel}</span>
            </div>
          </div>

          {onSearchChange ? (<div className="hidden lg:flex flex-1 justify-center px-6">
              <input type="search" value={searchValue || ""} onChange={(event) => onSearchChange(event.target.value)} placeholder={t("common.search")} className="w-full max-w-md rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"/>
            </div>) : null}

          <div className="flex items-center gap-2 sm:gap-4">
            <button type="button" onClick={() => setShowMobileMenu((open) => !open)} className="inline-flex items-center justify-center p-2 rounded-lg border border-blue-100 text-blue-700 hover:bg-blue-50" aria-label="Toggle navigation menu">
              {showMobileMenu ? <X className="w-4 h-4"/> : <Menu className="w-4 h-4"/>}
            </button>
            <div className="relative">
              <button onClick={() => setShowUserMenu((open) => !open)} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-100 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                <User className="w-4 h-4 text-blue-600"/>
                <span className="hidden md:inline text-sm text-gray-700 font-medium">{userEmail}</span>
              </button>
              {showUserMenu && (<>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)}/>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-blue-100 z-20 overflow-hidden">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500">{t("nav.myAccount")}</div>
                    <div className="border-t px-4 py-2 text-xs text-gray-500">{userEmail}</div>
                    <div className="border-t px-4 py-3">
                      <label htmlFor="language-select-mobile" className="block text-xs text-gray-500">
                        {t("language.label")}
                      </label>
                      <select id="language-select-mobile" value={language} onChange={(e) => setLanguage(e.target.value)} className="mt-2 w-full rounded-md border border-gray-200 bg-white px-2 py-1 text-sm">
                        <option value="en">{t("language.english")}</option>
                        <option value="he">{t("language.hebrew")}</option>
                      </select>
                    </div>
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

        {showMobileMenu && (<div className="pb-4 mt-3 flex flex-col gap-2" ref={mobileMenuRef}>
            {menuItems.map((item) => (<button key={item.id} onClick={() => {
                onNavigate(item.id);
                setShowMobileMenu(false);
            }} className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all text-left ${currentPage === item.id
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}`}>
                {item.label}
              </button>))}
          </div>)}
      </div>
    </nav>);
}
