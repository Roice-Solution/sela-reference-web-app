import { useMemo, useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, LayoutGrid, Link2, Lock, LogOut, Upload, User, Building2, Package, Users, Star, Clock, Home, FileText, UserCheck, FileSpreadsheet } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useI18n } from "../i18n/i18n";

const sectionIcons = {
    dashboard: LayoutGrid,
    tables: Building2,
    masters: Package,
    mappings: Link2,
    access: Lock,
    imports: Upload,
};

// Icons for individual menu items
const itemIcons = {
    'home': Home,
    'companies': Building2,
    'master-products': Package,
    'master-agents': Users,
    'products-per-company': Link2,
    'agents-per-company': UserCheck,
    'user-access': Lock,
    'excel-upload': FileSpreadsheet,
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
    stats = {},
}) {
    const { t, language, setLanguage } = useI18n();
    const breadcrumbItems = useMemo(() => (Array.isArray(breadcrumb) ? breadcrumb : []), [breadcrumb]);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('sidebar-favorites');
        return saved ? JSON.parse(saved) : [];
    });
    const [recentItems, setRecentItems] = useState(() => {
        const saved = localStorage.getItem('sidebar-recent');
        return saved ? JSON.parse(saved) : [];
    });
    const [menuSearch, setMenuSearch] = useState("");

    // Save current page to recent items
    useEffect(() => {
        if (currentPage && currentPage !== 'home') {
            setRecentItems(prev => {
                const filtered = prev.filter(id => id !== currentPage);
                const updated = [currentPage, ...filtered].slice(0, 5);
                localStorage.setItem('sidebar-recent', JSON.stringify(updated));
                return updated;
            });
        }
    }, [currentPage]);

    const toggleFavorite = (itemId) => {
        setFavorites(prev => {
            const updated = prev.includes(itemId) 
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId];
            localStorage.setItem('sidebar-favorites', JSON.stringify(updated));
            return updated;
        });
    };

    // Get badge count for menu items
    const getBadgeCount = (itemId) => {
        const counts = {
            'companies': stats?.companies ?? 0,
            'master-products': stats?.masterProducts ?? 0,
            'master-agents': stats?.masterAgents ?? 0,
            'products-per-company': stats?.productsPerCompany ?? 0,
            'agents-per-company': stats?.agentsPerCompany ?? 0,
            'user-access': stats?.userAccess ?? 0,
        };
        return counts[itemId] || 0;
    };

    // Filter menu items based on search
    const filteredSections = useMemo(() => {
        if (!menuSearch.trim()) return navSections;
        const query = menuSearch.toLowerCase();
        return navSections.map(section => ({
            ...section,
            items: section.items.filter(item => 
                item.label.toLowerCase().includes(query)
            )
        })).filter(section => section.items.length > 0);
    }, [navSections, menuSearch]);

    // Get all items for favorites and recent
    const allItems = useMemo(() => {
        const items = [];
        navSections.forEach(section => {
            section.items.forEach(item => {
                items.push({ ...item, sectionLabel: section.label });
            });
        });
        return items;
    }, [navSections]);

    const favoriteItems = allItems.filter(item => favorites.includes(item.id));
    const recentItemsData = recentItems.map(id => allItems.find(item => item.id === id)).filter(Boolean);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="flex min-h-screen">
                {!hideSidebar ? (
                    <aside className={`hidden flex-col border-r border-slate-200 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 text-slate-100 lg:flex transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'} px-4 py-6 relative`}>
                    {/* Logo and Toggle */}
                    <div className={`mb-6 flex items-center ${isCollapsed ? 'flex-col gap-4' : 'justify-between'}`}>
                        {!isCollapsed && (
                            <button
                                type="button"
                                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-left hover:bg-white/15 transition-all"
                                onClick={() => onNavigate("home")}
                            >
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 text-white">
                                    <LayoutGrid className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-white">{t("app.shortName")}</div>
                                    <div className="text-xs text-slate-400">{t("app.subtitle")}</div>
                                </div>
                            </button>
                        )}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 p-2 text-white shadow-lg hover:shadow-xl transition-all hover:scale-110"
                            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                        >
                            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                        </button>
                    </div>

                    {/* Menu Search */}
                    {!isCollapsed && (
                        <div className="mb-4 px-1">
                            <input
                                type="text"
                                value={menuSearch}
                                onChange={(e) => setMenuSearch(e.target.value)}
                                placeholder="Search menu..."
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-white/20 focus:bg-white/10 focus:outline-none"
                            />
                        </div>
                    )}

                    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto">
                        {/* Favorites Section */}
                        {favoriteItems.length > 0 && (
                            <div className="flex flex-col gap-2">
                                {!isCollapsed && (
                                    <div className="flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wide text-amber-400">
                                        <Star className="h-4 w-4" fill="currentColor" />
                                        Favorites
                                    </div>
                                )}
                                <div className="flex flex-col gap-1">
                                    {favoriteItems.map((item) => {
                                        const ItemIcon = itemIcons[item.id] || FileText;
                                        return (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => onNavigate(item.id)}
                                                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                                                    currentPage === item.id
                                                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                                                        : "text-slate-300 hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5"
                                                } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                                                title={isCollapsed ? item.label : ''}
                                            >
                                                {isCollapsed ? (
                                                    <ItemIcon className="h-5 w-5 flex-shrink-0" />
                                                ) : (
                                                    <>
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <ItemIcon className="h-4 w-4 flex-shrink-0" />
                                                            <span className="truncate">{item.label}</span>
                                                        </div>
                                                        {currentPage === item.id && <ChevronRight className="h-4 w-4 flex-shrink-0" />}
                                                    </>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                                {!isCollapsed && <div className="my-2 h-px bg-white/10" />}
                            </div>
                        )}

                        {/* Recent Items */}
                        {recentItemsData.length > 0 && (
                            <div className="flex flex-col gap-2">
                                {!isCollapsed && (
                                    <div className="flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        <Clock className="h-4 w-4" />
                                        Recent
                                    </div>
                                )}
                                <div className="flex flex-col gap-1">
                                    {recentItemsData.map((item) => {
                                        const ItemIcon = itemIcons[item.id] || FileText;
                                        return (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => onNavigate(item.id)}
                                                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                                                    currentPage === item.id
                                                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                                                        : "text-slate-300 hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5"
                                                } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                                                title={isCollapsed ? item.label : ''}
                                            >
                                                {isCollapsed ? (
                                                    <ItemIcon className="h-5 w-5 flex-shrink-0" />
                                                ) : (
                                                    <>
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <ItemIcon className="h-4 w-4 flex-shrink-0" />
                                                            <span className="truncate">{item.label}</span>
                                                        </div>
                                                        {currentPage === item.id && <ChevronRight className="h-4 w-4 flex-shrink-0" />}
                                                    </>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                                {!isCollapsed && <div className="my-2 h-px bg-white/10" />}
                            </div>
                        )}

                        {/* Regular Navigation Sections */}
                        {filteredSections.map((section) => {
                            const SectionIcon = sectionIcons[section.id] || LayoutGrid;
                            const hasActiveItem = section.items.some(item => item.id === currentPage);
                            return (
                                <div key={section.id} className={`flex flex-col gap-2 rounded-lg p-2 transition-colors ${hasActiveItem && !isCollapsed ? 'bg-white/5' : ''}`}>
                                    <div className={`flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wide ${hasActiveItem ? 'text-cyan-300' : 'text-slate-300'} ${isCollapsed ? 'justify-center' : ''}`} title={isCollapsed ? section.label : ''}>
                                        <SectionIcon className="h-4 w-4 flex-shrink-0" />
                                        {!isCollapsed && <span>{section.label}</span>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        {section.items.map((item) => {
                                            const badgeCount = getBadgeCount(item.id);
                                            const isFavorite = favorites.includes(item.id);
                                            const ItemIcon = itemIcons[item.id] || FileText;
                                            return (
                                                <div key={item.id} className="group/item relative">
                                                    <button
                                                        type="button"
                                                        onClick={() => onNavigate(item.id)}
                                                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                                                            currentPage === item.id
                                                                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                                                                : "text-slate-300 hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5"
                                                        } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                                                        title={isCollapsed ? item.label : ''}
                                                    >
                                                        {isCollapsed ? (
                                                            <ItemIcon className="h-5 w-5 flex-shrink-0" />
                                                        ) : (
                                                            <>
                                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                                    <ItemIcon className="h-4 w-4 flex-shrink-0" />
                                                                    <span className="truncate">{item.label}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                                    {badgeCount > 0 && (
                                                                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                                                                            currentPage === item.id
                                                                                ? 'bg-white/20 text-white'
                                                                                : 'bg-blue-500/20 text-blue-300'
                                                                        }`}>
                                                                            {badgeCount}
                                                                        </span>
                                                                    )}
                                                                    {currentPage === item.id && <ChevronRight className="h-4 w-4" />}
                                                                </div>
                                                            </>
                                                        )}
                                                    </button>
                                                    {!isCollapsed && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleFavorite(item.id);
                                                            }}
                                                            className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1 opacity-0 transition-opacity hover:bg-white/10 group-hover/item:opacity-100"
                                                            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                                                        >
                                                            <Star className={`h-3 w-3 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </nav>

                    {/* User Profile Section */}
                    {!isCollapsed && (
                        <div className="mt-auto border-t border-white/20 pt-4">
                            <div className="rounded-lg bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-white/10 p-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-sm font-bold text-white">
                                        {userEmail?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-sm font-semibold text-white">{userEmail}</div>
                                        <div className="text-xs text-slate-400">Administrator</div>
                                    </div>
                                </div>
                                <button
                                    onClick={onLogout}
                                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
                                >
                                    <LogOut className="h-4 w-4" />
                                    {t("nav.logout")}
                                </button>
                            </div>
                        </div>
                    )}
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
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pl-9 text-sm text-slate-700 placeholder:text-slate-400 focus-brand"
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
                    <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 px-6 py-3 text-xs text-white">
                        {/* Animated shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                        <div className="relative mx-auto flex max-w-6xl items-center justify-center gap-2">
                            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-white" />
                            <span className="font-semibold">{t("app.bannerLeft")}</span>
                        </div>
                    </div>

                    <main className="flex-1 px-6 py-6">{children}</main>
                </div>
            </div>
        </div>
    );
}
