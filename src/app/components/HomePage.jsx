import { useMemo } from "react";
import { useI18n } from "../i18n/i18n";
import { Building2, Package, Users, Plus, Upload, TrendingUp, Clock, Sparkles } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import homeBanner from "../../assets/home-banner.png";

export function HomePage({ pages, onNavigate, onAddCompany, onImport, stats, lastUpdated }) {
    const { t } = useI18n();
    const workAreas = useMemo(
        () => pages.filter((page) => ["companies", "products-per-company", "agents-per-company"].includes(page.key)),
        [pages]
    );
    const kpis = [
        {
            key: "companies",
            label: t("nav.companies"),
            value: stats?.companies ?? 0,
            action: () => onNavigate("companies"),
            icon: Building2,
            gradient: "from-blue-500 to-cyan-500",
            bgGradient: "from-blue-50 to-cyan-50",
            iconColor: "text-blue-600",
        },
        {
            key: "master-products",
            label: t("nav.masterProducts"),
            value: stats?.masterProducts ?? 0,
            action: () => onNavigate("master-products"),
            icon: Package,
            gradient: "from-purple-500 to-pink-500",
            bgGradient: "from-purple-50 to-pink-50",
            iconColor: "text-purple-600",
        },
        {
            key: "master-agents",
            label: t("nav.masterAgents"),
            value: stats?.masterAgents ?? 0,
            action: () => onNavigate("master-agents"),
            icon: Users,
            gradient: "from-emerald-500 to-teal-500",
            bgGradient: "from-emerald-50 to-teal-50",
            iconColor: "text-emerald-600",
        },
        {
            key: "total-records",
            label: "Total Records",
            value: (stats?.companies ?? 0) + (stats?.masterProducts ?? 0) + (stats?.masterAgents ?? 0),
            action: () => {},
            icon: TrendingUp,
            gradient: "from-amber-500 to-orange-500",
            bgGradient: "from-amber-50 to-orange-50",
            iconColor: "text-amber-600",
        },
    ];
    const formatDate = (value) => {
        if (!value) return t("home.noActivity");
        const date = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(date.getTime())) return t("home.noActivity");
        return date.toLocaleString(undefined, {
            dateStyle: "short",
            timeStyle: "short",
        });
    };

    return (
        <div className="mx-auto w-full max-w-7xl space-y-12 px-6 py-10">
            {/* Hero Banner with Enhanced Design */}
            <div className="group relative grid overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 shadow-xl transition-all duration-500 hover:shadow-2xl md:grid-cols-2 md:gap-8">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
                    <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
                </div>
                
                {/* Content Section */}
                <div className="relative z-10 flex flex-col gap-4 p-8 md:p-10">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-white/90">
                        <div className="h-1 w-8 rounded-full bg-white/60" />
                        {t("home.bannerEyebrow")}
                    </div>
                    <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
                        {t("home.bannerTitleAdmin")}
                    </h1>
                    <p className="max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
                        {t("home.bannerDescription")}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={onAddCompany}
                            className="ripple group/btn flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow-xl active:scale-95"
                        >
                            <Plus className="h-4 w-4 transition-transform group-hover/btn:rotate-90" />
                            {t("home.addCompany")}
                        </button>
                        <button
                            type="button"
                            onClick={onImport}
                            className="ripple group/btn flex items-center gap-2 rounded-xl border-2 border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-white/60 hover:bg-white/20 active:scale-95"
                        >
                            <Upload className="h-4 w-4 transition-transform group-hover/btn:-translate-y-0.5" />
                            {t("home.importCsv")}
                        </button>
                    </div>
                </div>
                
                {/* Image Section */}
                <div className="relative hidden md:flex md:items-center md:justify-center">
                    <div className="relative h-full w-full">
                        <ImageWithFallback 
                            src={homeBanner} 
                            alt="Insurance Industry" 
                            className="h-full w-full object-cover object-center opacity-90 mix-blend-overlay"
                        />
                    </div>
                </div>
            </div>

            {/* KPI Section with Enhanced Cards */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-1 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                        {t("home.overviewTitle")}
                    </h2>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {kpis.map((kpi) => {
                        const Icon = kpi.icon;
                        return (
                            <div
                                key={kpi.key}
                                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                {/* Background Gradient on Hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${kpi.bgGradient} opacity-0 transition-opacity duration-300 group-hover:opacity-50`} />
                                
                                {/* Content */}
                                <div className="relative z-10 flex flex-col gap-4">
                                    {/* Icon with Gradient Background */}
                                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${kpi.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                        <Icon className="h-7 w-7 text-white" />
                                    </div>
                                    
                                    {/* Stats */}
                                    <div className="space-y-1">
                                        <div className="text-4xl font-bold tracking-tight text-slate-900">
                                            {kpi.value.toLocaleString()}
                                        </div>
                                        <div className="text-sm font-medium text-slate-600">{kpi.label}</div>
                                    </div>
                                    
                                    {/* Action Button */}
                                    {kpi.key !== "total-records" && (
                                        <button
                                            type="button"
                                            onClick={kpi.action}
                                            className={`mt-2 flex items-center gap-2 text-sm font-semibold ${kpi.iconColor} transition-all duration-200 hover:gap-3`}
                                        >
                                            {t("home.view")}
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Work Areas Section with Enhanced Cards */}
            <section className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-400" />
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            {t("home.workAreasTitle")}
                        </h2>
                    </div>
                    <p className="text-base text-slate-600">{t("home.workAreasSubtitle")}</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {workAreas.map((page, index) => {
                        const gradients = [
                            "from-blue-500 to-cyan-400",
                            "from-purple-500 to-pink-400",
                            "from-emerald-500 to-teal-400"
                        ];
                        const bgColors = [
                            "group-hover:bg-blue-50",
                            "group-hover:bg-purple-50",
                            "group-hover:bg-emerald-50"
                        ];
                        return (
                            <button
                                key={page.key}
                                type="button"
                                onClick={() => onNavigate(page.key)}
                                className={`group relative flex h-full w-full flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl ${bgColors[index % 3]}`}
                            >
                                {/* Decorative Corner Element */}
                                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 opacity-50 transition-all duration-300 group-hover:scale-150" />
                                
                                {/* Gradient Accent Bar */}
                                <div className={`relative h-1.5 w-16 rounded-full bg-gradient-to-r ${gradients[index % 3]} shadow-sm`} />
                                
                                {/* Content */}
                                <div className="relative space-y-3">
                                    <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-slate-800">
                                        {page.label}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-slate-600">
                                        {page.description}
                                    </p>
                                </div>
                                
                                {/* Footer with Timestamp */}
                                <div className="relative mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span className="font-medium">{t("home.lastUpdated")}</span>
                                    </div>
                                    <span className="font-semibold text-slate-700">
                                        {formatDate(lastUpdated?.[page.key])}
                                    </span>
                                </div>
                                
                                {/* Hover Arrow Indicator */}
                                <div className="absolute bottom-6 right-6 translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${gradients[index % 3]} shadow-lg`}>
                                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
