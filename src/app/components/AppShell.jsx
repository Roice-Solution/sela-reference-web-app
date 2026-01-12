import { useMemo } from "react";
import { ChevronRight, LayoutGrid, Link2, Lock, LogOut, Upload, User } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useI18n } from "../i18n/i18n";

const sectionIcons = {
    dashboard: LayoutGrid,
    tables: LayoutGrid,
    masters: LayoutGrid,
    mappings: Link2,
    access: Lock,
    imports: Upload,
};

export function AppShell({
    navSections,
    currentPage,
    onNavigate,
    userEmail,
    onLogout,
    breadcrumb,
    searchQuery,
    onSearchChange,
    hideSidebar = false,
    children,
}) {
    const { t, language, setLanguage } = useI18n();
    const breadcrumbItems = useMemo(() => (Array.isArray(breadcrumb) ? breadcrumb : []), [breadcrumb]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="flex min-h-screen">
                {!hideSidebar ? (
                    <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white px-5 py-6 lg:flex">
                    <button
                        type="button"
                        className="mb-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left"
                        onClick={() => onNavigate("home")}
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                            <LayoutGrid className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-slate-900">{t("app.shortName")}</div>
                            <div className="text-xs text-slate-500">{t("app.subtitle")}</div>
                        </div>
                    </button>

                    <nav className="flex flex-1 flex-col gap-5">
                        {navSections.map((section) => {
                            const SectionIcon = sectionIcons[section.id] || LayoutGrid;
                            return (
                                <div key={section.id} className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        <SectionIcon className="h-4 w-4 text-slate-400" />
                                        {section.label}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        {section.items.map((item) => (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => onNavigate(item.id)}
                                                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                                                    currentPage === item.id
                                                        ? "bg-blue-50 text-blue-700"
                                                        : "text-slate-600 hover:bg-slate-100"
                                                }`}
                                            >
                                                <span>{item.label}</span>
                                                {currentPage === item.id ? (
                                                    <ChevronRight className="h-4 w-4 text-blue-400" />
                                                ) : null}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </nav>
                    </aside>
                ) : null}

                <div className="flex flex-1 flex-col">
                    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
                        <div className="flex flex-col gap-3 px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex min-w-[200px] items-center gap-2 text-sm text-slate-500">
                                    {breadcrumbItems.length ? (
                                        breadcrumbItems.map((item, index) => (
                                            <div key={`${item}-${index}`} className="flex items-center gap-2">
                                                <span className={index === breadcrumbItems.length - 1 ? "text-slate-900 font-semibold" : ""}>
                                                    {item}
                                                </span>
                                                {index < breadcrumbItems.length - 1 ? (
                                                    <ChevronRight className="h-4 w-4 text-slate-400" />
                                                ) : null}
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-slate-900 font-semibold">{t("nav.home")}</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 sm:hidden">
                                    <DropdownMenu.Root>
                                        <DropdownMenu.Trigger asChild>
                                            <button type="button" className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                                                <User className="h-4 w-4 text-slate-500" />
                                            </button>
                                        </DropdownMenu.Trigger>
                                        <DropdownMenu.Portal>
                                            <DropdownMenu.Content
                                                sideOffset={8}
                                                className="z-50 w-48 rounded-xl border border-slate-200 bg-white p-1 text-sm shadow-lg"
                                            >
                                                <DropdownMenu.Label className="px-3 py-2 text-xs text-slate-500">
                                                    {t("nav.myAccount")}
                                                </DropdownMenu.Label>
                                                <DropdownMenu.Separator className="my-1 h-px bg-slate-100" />
                                                <DropdownMenu.Item className="px-3 py-2 text-xs text-slate-500">{userEmail}</DropdownMenu.Item>
                                                <DropdownMenu.Separator className="my-1 h-px bg-slate-100" />
                                                <DropdownMenu.Item
                                                    className="px-3 py-2 text-xs text-slate-500"
                                                    onSelect={(event) => event.preventDefault()}
                                                >
                                                    <div>
                                                        <label htmlFor="shell-language-mobile" className="block text-[11px] uppercase tracking-wide text-slate-400">
                                                            {t("language.label")}
                                                        </label>
                                                        <select
                                                            id="shell-language-mobile"
                                                            value={language}
                                                            onChange={(event) => setLanguage(event.target.value)}
                                                            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700"
                                                        >
                                                            <option value="en">{t("language.english")}</option>
                                                            <option value="he">{t("language.hebrew")}</option>
                                                        </select>
                                                    </div>
                                                </DropdownMenu.Item>
                                                <DropdownMenu.Separator className="my-1 h-px bg-slate-100" />
                                                <DropdownMenu.Item
                                                    onSelect={() => onLogout()}
                                                    className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    {t("nav.logout")}
                                                </DropdownMenu.Item>
                                            </DropdownMenu.Content>
                                        </DropdownMenu.Portal>
                                    </DropdownMenu.Root>
                                </div>
                            </div>

                            {typeof searchQuery === "string" && onSearchChange ? (
                                <div className="relative w-full sm:max-w-md">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(event) => onSearchChange(event.target.value)}
                                        placeholder={t("common.search")}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pl-9 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    />
                                    <svg
                                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                </div>
                            ) : null}

                            <div className="hidden items-center gap-3 sm:flex">
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger asChild>
                                        <button type="button" className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                                            <User className="h-4 w-4 text-slate-500" />
                                            <span className="hidden md:inline">{userEmail}</span>
                                        </button>
                                    </DropdownMenu.Trigger>
                                    <DropdownMenu.Portal>
                                        <DropdownMenu.Content
                                            sideOffset={8}
                                            className="z-50 w-48 rounded-xl border border-slate-200 bg-white p-1 text-sm shadow-lg"
                                        >
                                            <DropdownMenu.Label className="px-3 py-2 text-xs text-slate-500">
                                                {t("nav.myAccount")}
                                            </DropdownMenu.Label>
                                            <DropdownMenu.Separator className="my-1 h-px bg-slate-100" />
                                            <DropdownMenu.Item className="px-3 py-2 text-xs text-slate-500">{userEmail}</DropdownMenu.Item>
                                            <DropdownMenu.Separator className="my-1 h-px bg-slate-100" />
                                            <DropdownMenu.Item
                                                className="px-3 py-2 text-xs text-slate-500"
                                                onSelect={(event) => event.preventDefault()}
                                            >
                                                <div>
                                                    <label htmlFor="shell-language" className="block text-[11px] uppercase tracking-wide text-slate-400">
                                                        {t("language.label")}
                                                    </label>
                                                    <select
                                                        id="shell-language"
                                                        value={language}
                                                        onChange={(event) => setLanguage(event.target.value)}
                                                        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700"
                                                    >
                                                        <option value="en">{t("language.english")}</option>
                                                        <option value="he">{t("language.hebrew")}</option>
                                                    </select>
                                                </div>
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Separator className="my-1 h-px bg-slate-100" />
                                            <DropdownMenu.Item
                                                onSelect={() => onLogout()}
                                                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                {t("nav.logout")}
                                            </DropdownMenu.Item>
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Portal>
                                </DropdownMenu.Root>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 px-6 py-6">{children}</main>
                </div>
            </div>
        </div>
    );
}
