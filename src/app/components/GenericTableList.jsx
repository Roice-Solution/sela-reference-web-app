import { format, parseISO } from "date-fns";
import { ChevronDown, ChevronUp, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useI18n } from "../i18n/i18n";

export function GenericTableList({
    columns,
    data,
    onEdit,
    onView,
    onDelete,
    getItemId,
    isLoading,
    density = "comfortable",
    selectedId,
    onSort,
    sortKey,
    sortDirection,
}) {
    const { t } = useI18n();
    const [deleteItem, setDeleteItem] = useState(null);
    const handleDelete = () => {
        if (!deleteItem)
            return;
        onDelete(deleteItem);
        setDeleteItem(null);
    };
    const formatDateValue = (value) => {
        try {
            const date = value instanceof Date ? value : parseISO(String(value));
            return format(date, "yyyy-MM-dd HH:mm");
        }
        catch {
            return value;
        }
    };
    const renderCellValue = (value, type) => {
        if (value === null || value === undefined) {
            return <span className="text-gray-400">-</span>;
        }
        switch (type) {
            case "code":
                return (<code className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm font-medium text-slate-700">
            {value}
          </code>);
            case "date":
                return <span className="text-gray-500 text-sm">{formatDateValue(value)}</span>;
            case "email":
                return <span className="text-blue-600 text-sm font-medium">{value}</span>;
            case "password":
                return <span className="text-gray-400">••••••••</span>;
            case "status": {
                const normalized = String(value).toLowerCase();
                const label = normalized === "active"
                    ? t("common.active")
                    : normalized === "inactive" || normalized === "cancelled"
                        ? t("common.inactive")
                        : value;
                return (<span className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-medium ${normalized === "active"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-100 text-slate-700 border-slate-200"}`}>
            {label}
          </span>);
            }
            default:
                return <span>{value}</span>;
        }
    };
    if (isLoading) {
        return (<div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
          <Pencil className="w-8 h-8 text-gray-400"/>
        </div>
        <p className="text-gray-600 mb-1">{t("common.loadingEntries")}</p>
        <p className="text-gray-400 text-sm">{t("common.loadingHint")}</p>
      </div>);
    }
    if (data.length === 0) {
        return (<div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
          <Pencil className="w-8 h-8 text-gray-400"/>
        </div>
        <p className="text-gray-600 mb-1">{t("common.noEntries")}</p>
        <p className="text-gray-400 text-sm">{t("common.noEntriesHint")}</p>
      </div>);
    }
    const cellPadding = density === "compact" ? "px-4 py-2" : "px-4 py-4";
    return (<>
      <div className="max-h-[68vh] overflow-auto">
        <table className="w-full min-w-[720px]">
          <thead className="sticky top-0 z-10 bg-slate-50">
            <tr>
              {columns.map((col) => {
            const isActive = sortKey === col.key;
            return (<th key={col.key} className={`border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 ${col.width || ""}`}>
                  <button
                    type="button"
                    onClick={() => onSort && onSort(col.key)}
                    className="group inline-flex items-center gap-1"
                  >
                    <span>{col.label}</span>
                    {isActive ? (sortDirection === "asc" ? (<ChevronUp className="h-3 w-3 text-slate-700" />) : (<ChevronDown className="h-3 w-3 text-slate-700" />)) : (<ChevronDown className="h-3 w-3 text-slate-300 group-hover:text-slate-400" />)}
                  </button>
                </th>);
        })}
              <th className="border-b border-slate-200 px-4 py-3 w-[80px]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {data.map((item) => {
            const itemId = getItemId(item);
            const isSelected = selectedId === itemId;
            return (<tr key={itemId} data-selected={isSelected} className={`transition hover:bg-slate-50 ${onView ? "cursor-pointer" : ""} ${isSelected ? "bg-blue-50" : ""}`} onClick={() => onView && onView(item)}>
                {columns.map((col) => (<td key={col.key} className={`${cellPadding} whitespace-nowrap text-sm text-slate-700`}>
                    {renderCellValue(item[col.key], col.type)}
                  </td>))}
                <td className={`${cellPadding} whitespace-nowrap text-right`} onClick={(event) => event.stopPropagation()}>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button type="button" className="rounded-md p-1 text-slate-500 hover:bg-slate-100">
                        <MoreVertical className="w-4 h-4"/>
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content className="z-50 w-44 rounded-xl border border-slate-200 bg-white p-1 text-sm shadow-lg">
                        {onView ? (
                          <DropdownMenu.Item onSelect={() => onView(item)} className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50">
                            <Pencil className="h-4 w-4"/>
                            {t("common.viewDetails")}
                          </DropdownMenu.Item>
                        ) : null}
                        <DropdownMenu.Item onSelect={() => onEdit(item)} className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50">
                          <Pencil className="h-4 w-4"/>
                          {t("common.edit")}
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onSelect={() => setDeleteItem(item)} className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4"/>
                          {t("common.delete")}
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </td>
              </tr>);
        })}
          </tbody>
        </table>
      </div>

      {deleteItem && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="p-6">
              <h3 className="mb-2 text-lg font-semibold text-slate-900">{t("common.confirmTitle")}</h3>
              <p className="mb-6 text-sm text-slate-600">{t("common.confirmDeleteLong")}</p>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setDeleteItem(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-50">
                  {t("common.cancel")}
                </button>
                <button type="button" onClick={handleDelete} className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">
                  {t("common.delete")}
                </button>
              </div>
            </div>
          </div>
        </div>)}
    </>);
}
