import { useMemo } from "react";
import { useI18n } from "../i18n/i18n";
import { PageHeader } from "./PageHeader";

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
        },
        {
            key: "master-products",
            label: t("nav.masterProducts"),
            value: stats?.masterProducts ?? 0,
            action: () => onNavigate("master-products"),
        },
        {
            key: "master-agents",
            label: t("nav.masterAgents"),
            value: stats?.masterAgents ?? 0,
            action: () => onNavigate("master-agents"),
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
        <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-8">
            <div className="sticky top-20 z-[1] -mx-6 bg-slate-50/95 px-6 py-4 backdrop-blur">
                <PageHeader
                    title={t("home.dashboardTitle")}
                    description={t("home.dashboardSubtitle")}
                    actions={
                        <>
                            <button
                                type="button"
                                onClick={onAddCompany}
                                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-100"
                            >
                                {t("home.addCompany")}
                            </button>
                            <button
                                type="button"
                                onClick={onImport}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                            >
                                {t("home.importCsv")}
                            </button>
                        </>
                    }
                />
            </div>

            <section className="space-y-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    {t("home.overviewTitle")}
                </h3>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {kpis.map((kpi) => (
                        <div key={kpi.key} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="text-2xl font-semibold text-slate-900">{kpi.value}</div>
                            <div className="mt-1 text-sm text-slate-500">{kpi.label}</div>
                            <button
                                type="button"
                                onClick={kpi.action}
                                className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                                {t("home.view")}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-5">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">{t("home.workAreasTitle")}</h3>
                    <p className="text-sm text-slate-600">{t("home.workAreasSubtitle")}</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {workAreas.map((page) => (
                        <button
                            key={page.key}
                            type="button"
                            onClick={() => onNavigate(page.key)}
                            className="flex h-full w-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-slate-300 hover:shadow-md"
                        >
                            <div className="text-base font-semibold text-slate-900">{page.label}</div>
                            <p className="text-sm text-slate-600">{page.description}</p>
                            <div className="mt-auto flex items-center justify-between text-xs text-slate-500">
                                <span>{t("home.lastUpdated")}</span>
                                <span className="text-slate-600">{formatDate(lastUpdated?.[page.key])}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}
