import { useEffect, useMemo, useState } from "react";
import { Columns2, Plus, Rows3 } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { GenericTableList } from "./GenericTableList";
import { PageHeader } from "./PageHeader";
import { useI18n } from "../i18n/i18n";

export function GenericTablePage({
    title,
    description,
    columns,
    data,
    onAdd,
    onEdit,
    onDelete,
    getItemId,
    isLoading,
    isSaving,
    onDownloadExcel,
    searchQuery,
    onView,
    selectedId,
}) {
    const { t } = useI18n();
    const [density, setDensity] = useState("comfortable");
    const [visibleColumnKeys, setVisibleColumnKeys] = useState(() => new Set(columns.map((col) => col.key)));
    const [sortKey, setSortKey] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");
    const [columnFilters, setColumnFilters] = useState({});

    useEffect(() => {
        setVisibleColumnKeys(new Set(columns.map((col) => col.key)));
    }, [columns]);

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
            return;
        }
        setSortKey(key);
        setSortDirection("asc");
    };

    const getSortValue = (value, type) => {
        if (value === null || value === undefined) return null;
        if (type === "date") {
            const time = Date.parse(String(value));
            return Number.isNaN(time) ? String(value) : time;
        }
        if (typeof value === "number") return value;
        if (typeof value === "string") {
            const numeric = Number(value);
            if (!Number.isNaN(numeric) && value.trim() !== "") {
                return numeric;
            }
            return value.toLowerCase();
        }
        return String(value);
    };

    const safeQuery = searchQuery || "";
    const searchableColumns = useMemo(() => columns.filter((col) => col.searchable !== false), [columns]);
    const filteredData = useMemo(() => {
        if (!safeQuery) return data;
        const normalized = safeQuery.toLowerCase();
        return data.filter((item) =>
            searchableColumns.some((col) => {
                const value = item[col.key];
                if (value === null || value === undefined) return false;
                return String(value).toLowerCase().includes(normalized);
            })
        );
    }, [data, safeQuery, searchableColumns]);

    const filteredByColumns = useMemo(() => {
        const activeFilters = Object.entries(columnFilters).filter(([, value]) => value && String(value).trim());
        if (!activeFilters.length) return filteredData;
        return filteredData.filter((item) =>
            activeFilters.every(([key, filterValue]) => {
                const value = item[key];
                if (value === null || value === undefined) return false;
                return String(value).toLowerCase().includes(String(filterValue).toLowerCase().trim());
            })
        );
    }, [columnFilters, filteredData]);

    const sortedData = useMemo(() => {
        if (!sortKey) return filteredByColumns;
        const col = columns.find((item) => item.key === sortKey);
        const type = col?.type;
        const sorted = [...filteredByColumns].sort((a, b) => {
            const aValue = getSortValue(a[sortKey], type);
            const bValue = getSortValue(b[sortKey], type);
            if (aValue === null && bValue === null) return 0;
            if (aValue === null) return 1;
            if (bValue === null) return -1;
            if (typeof aValue === "number" && typeof bValue === "number") {
                return aValue - bValue;
            }
            return String(aValue).localeCompare(String(bValue));
        });
        return sortDirection === "asc" ? sorted : sorted.reverse();
    }, [columns, filteredByColumns, sortDirection, sortKey]);

    const visibleColumns = useMemo(
        () => columns.filter((col) => visibleColumnKeys.has(col.key)),
        [columns, visibleColumnKeys]
    );
    const handleColumnFilterChange = (key, value) => {
        setColumnFilters((prev) => ({ ...prev, [key]: value }));
    };

    const actions = (
        <>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button type="button" className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 hover:shadow-md">
                        <Columns2 className="h-4 w-4 text-slate-500 transition-colors group-hover:text-blue-600" />
                        {t("tables.columns")}
                    </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                    <DropdownMenu.Content className="z-50 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                        {columns.map((col) => {
                            const isVisible = visibleColumnKeys.has(col.key);
                            return (
                            <DropdownMenu.CheckboxItem
                                key={col.key}
                                checked={visibleColumnKeys.has(col.key)}
                                onCheckedChange={(checked) => {
                                    setVisibleColumnKeys((prev) => {
                                        const next = new Set(prev);
                                        if (checked) {
                                            next.add(col.key);
                                        } else if (next.size > 1) {
                                            next.delete(col.key);
                                        }
                                        return next;
                                    });
                                }}
                                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                            >
                                <span className={`h-2 w-2 rounded-full ${isVisible ? "bg-emerald-500" : "bg-red-500"}`} />
                                {col.label}
                            </DropdownMenu.CheckboxItem>
                            );
                        })}
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
            <div className="flex rounded-lg border border-slate-200 bg-white p-1">
                <button
                    type="button"
                    onClick={() => setDensity("comfortable")}
                    className={`flex items-center gap-2 rounded-md px-2 py-1 text-xs font-semibold ${
                        density === "comfortable" ? "bg-slate-100 text-slate-900" : "text-slate-500"
                    }`}
                >
                    <Rows3 className="h-3.5 w-3.5" />
                    {t("tables.comfortable")}
                </button>
                <button
                    type="button"
                    onClick={() => setDensity("compact")}
                    className={`flex items-center gap-2 rounded-md px-2 py-1 text-xs font-semibold ${
                        density === "compact" ? "bg-slate-100 text-slate-900" : "text-slate-500"
                    }`}
                >
                    <Rows3 className="h-3.5 w-3.5" />
                    {t("tables.compact")}
                </button>
            </div>
            {onDownloadExcel ? (
                <button
                    type="button"
                    onClick={() => onDownloadExcel(sortedData)}
                    className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 hover:shadow-md"
                >
                    {t("excel.download")}
                </button>
            ) : null}
            <button
                onClick={onAdd}
                disabled={isLoading || isSaving}
                className="ripple flex items-center gap-2 btn-primary"
            >
                <Plus className="h-4 w-4" />
                {t("common.addEntry")}
            </button>
        </>
    );

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title={title} description={description} actions={actions} />

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
                <GenericTableList
                    columns={visibleColumns}
                    data={sortedData}
                    onEdit={onEdit}
                    onView={onView}
                    onDelete={onDelete}
                    getItemId={getItemId}
                    isLoading={isLoading}
                    density={density}
                    selectedId={selectedId}
                    onSort={handleSort}
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    columnFilters={columnFilters}
                    onColumnFilterChange={handleColumnFilterChange}
                />

                {filteredByColumns.length > 0 && (
                    <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        {t("common.showingEntries", { shown: filteredByColumns.length, total: data.length })}
                    </div>
                )}
            </div>
        </div>
    );
}
