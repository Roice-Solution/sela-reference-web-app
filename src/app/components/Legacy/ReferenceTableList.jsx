import { format, parseISO } from "date-fns";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useI18n } from "../i18n/i18n";
export function ReferenceTableList({ entries, onEdit, onDelete }) {
    const { t } = useI18n();
    const [sortKey, setSortKey] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");
    const formatDateValue = (value) => {
        try {
            const date = value instanceof Date ? value : parseISO(String(value));
            return format(date, "yyyy-MM-dd HH:mm");
        }
        catch {
            return value;
        }
    };
    const handleDelete = (entryId) => {
        const confirmed = window.confirm(t("common.confirmDelete"));
        if (confirmed) {
            onDelete(entryId);
        }
    };
    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
            return;
        }
        setSortKey(key);
        setSortDirection("asc");
    };
    const getSortValue = (value) => {
        if (value === null || value === undefined) return null;
        if (typeof value === "string") {
            const numeric = Number(value);
            if (!Number.isNaN(numeric) && value.trim() !== "") {
                return numeric;
            }
            return value.toLowerCase();
        }
        if (value instanceof Date) return value.getTime();
        const parsed = Date.parse(String(value));
        if (!Number.isNaN(parsed)) return parsed;
        return String(value);
    };
    const sortedEntries = useMemo(() => {
        if (!sortKey) return entries;
        const sorted = [...entries].sort((a, b) => {
            const aValue = getSortValue(a[sortKey]);
            const bValue = getSortValue(b[sortKey]);
            if (aValue === null && bValue === null) return 0;
            if (aValue === null) return 1;
            if (bValue === null) return -1;
            if (typeof aValue === "number" && typeof bValue === "number") {
                return aValue - bValue;
            }
            return String(aValue).localeCompare(String(bValue));
        });
        return sortDirection === "asc" ? sorted : sorted.reverse();
    }, [entries, sortDirection, sortKey]);
    if (entries.length === 0) {
        return (<div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
          <Pencil className="w-8 h-8 text-gray-400"/>
        </div>
        <p className="text-gray-600 mb-1">{t("common.noEntries")}</p>
        <p className="text-gray-400 text-sm">{t("common.noEntriesHint")}</p>
      </div>);
    }
    return (<>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 sm:px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">
                <button type="button" onClick={() => handleSort("code")} className="inline-flex items-center gap-1">
                  {t("columns.code")}
                  {sortKey === "code" ? (sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : <ChevronDown className="h-3 w-3 text-gray-300" />}
                </button>
              </th>
              <th className="px-4 sm:px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button type="button" onClick={() => handleSort("description")} className="inline-flex items-center gap-1">
                  {t("columns.description")}
                  {sortKey === "description" ? (sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : <ChevronDown className="h-3 w-3 text-gray-300" />}
                </button>
              </th>
              <th className="px-4 sm:px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[170px]">
                <button type="button" onClick={() => handleSort("value")} className="inline-flex items-center gap-1">
                  {t("columns.value")}
                  {sortKey === "value" ? (sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : <ChevronDown className="h-3 w-3 text-gray-300" />}
                </button>
              </th>
              <th className="px-4 sm:px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                <button type="button" onClick={() => handleSort("status")} className="inline-flex items-center gap-1">
                  {t("common.status")}
                  {sortKey === "status" ? (sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : <ChevronDown className="h-3 w-3 text-gray-300" />}
                </button>
              </th>
              <th className="px-4 sm:px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">
                <button type="button" onClick={() => handleSort("createdAt")} className="inline-flex items-center gap-1">
                  {t("columns.created")}
                  {sortKey === "createdAt" ? (sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : <ChevronDown className="h-3 w-3 text-gray-300" />}
                </button>
              </th>
              <th className="px-4 sm:px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">
                <button type="button" onClick={() => handleSort("updatedAt")} className="inline-flex items-center gap-1">
                  {t("columns.updated")}
                  {sortKey === "updatedAt" ? (sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : <ChevronDown className="h-3 w-3 text-gray-300" />}
                </button>
              </th>
              <th className="px-4 sm:px-8 py-3 w-[140px]"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedEntries.map((entry) => (<tr key={entry.id} className="hover:bg-gray-50">
                <td className="px-4 sm:px-8 py-4 whitespace-nowrap">
                  <code className="px-2 py-1 bg-slate-50 text-slate-700 rounded-md text-sm font-medium border border-slate-200">{entry.code}</code>
                </td>
                <td className="px-4 sm:px-8 py-4 whitespace-nowrap">{entry.description}</td>
                <td className="px-4 sm:px-8 py-4 whitespace-nowrap">{entry.value}</td>
                <td className="px-4 sm:px-8 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border ${entry.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-700 border-slate-200"}`}>
                    {entry.status === "active"
            ? t("common.active")
            : entry.status === "inactive"
                ? t("common.inactive")
                : entry.status}
                  </span>
                </td>
                <td className="px-4 sm:px-8 py-4 whitespace-nowrap text-gray-500 text-sm">{formatDateValue(entry.createdAt)}</td>
                <td className="px-4 sm:px-8 py-4 whitespace-nowrap text-gray-500 text-sm">{formatDateValue(entry.updatedAt)}</td>
                <td className="px-4 sm:px-8 py-4 whitespace-nowrap text-right">
                  <div className="inline-flex items-center gap-2">
                    <button type="button" onClick={() => onEdit(entry)} className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50">
                      <Pencil className="w-3 h-3"/>
                      {t("common.edit")}
                    </button>
                    <button type="button" onClick={() => handleDelete(entry.id)} className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50">
                      <Trash2 className="w-3 h-3"/>
                      {t("common.delete")}
                    </button>
                  </div>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </>);
}
