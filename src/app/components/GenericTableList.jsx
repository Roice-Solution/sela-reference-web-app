import { format, parseISO } from "date-fns";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "../i18n/i18n";
export function GenericTableList({ columns, data, onEdit, onDelete, getItemId, isLoading, }) {
    const { t } = useI18n();
    const [deleteItem, setDeleteItem] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [menuPosition, setMenuPosition] = useState(null);
    useEffect(() => {
        if (!openMenuId) return;
        const handleKey = (event) => {
            if (event.key === "Escape") {
                setOpenMenuId(null);
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [openMenuId]);
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
                return (<code className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm font-medium border border-blue-200">
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
                return (<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${normalized === "active"
                    ? "bg-green-50 text-green-800 border-green-200"
                    : "bg-gray-100 text-gray-800 border-gray-200"}`}>
            {label}
          </span>);
            }
            default:
                return <span>{value}</span>;
        }
    };
    if (isLoading) {
        return (<div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Pencil className="w-8 h-8 text-gray-400"/>
        </div>
        <p className="text-gray-600 mb-1">{t("common.loadingEntries")}</p>
        <p className="text-gray-400 text-sm">{t("common.loadingHint")}</p>
      </div>);
    }
    if (data.length === 0) {
        return (<div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Pencil className="w-8 h-8 text-gray-400"/>
        </div>
        <p className="text-gray-600 mb-1">{t("common.noEntries")}</p>
        <p className="text-gray-400 text-sm">{t("common.noEntriesHint")}</p>
      </div>);
    }
    return (<>
      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full min-w-[720px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col) => (<th key={col.key} className={`px-4 sm:px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.width || ""}`}>
                  {col.label}
                </th>))}
              <th className="px-4 sm:px-8 py-3 w-[80px]"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => {
            const itemId = getItemId(item);
            return (<tr key={itemId} className="hover:bg-gray-50 cursor-pointer" onClick={() => onEdit(item)}>
                {columns.map((col) => (<td key={col.key} className="px-4 sm:px-8 py-4 whitespace-nowrap">
                    {renderCellValue(item[col.key], col.type)}
                  </td>))}
                <td className="px-4 sm:px-8 py-4 whitespace-nowrap text-right" onClick={(event) => event.stopPropagation()}>
                  <div className="relative inline-block">
                    <button type="button" onClick={(event) => {
            if (openMenuId === itemId) {
                setOpenMenuId(null);
                setMenuPosition(null);
                return;
            }
            const rect = event.currentTarget.getBoundingClientRect();
            const menuWidth = 160;
            const left = Math.max(12, rect.right - menuWidth);
            const top = rect.bottom + 8;
            setMenuPosition({ left, top, width: menuWidth });
            setOpenMenuId(itemId);
        }} className="p-1 hover:bg-gray-100 rounded-md transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-600"/>
                    </button>
                  </div>
                </td>
              </tr>);
        })}
          </tbody>
        </table>
      </div>

      {openMenuId && menuPosition && createPortal(<>
          <div className="fixed inset-0 z-40" onClick={() => {
        setOpenMenuId(null);
        setMenuPosition(null);
    }}/>
          <div className="fixed z-50 bg-white rounded-md shadow-lg border border-gray-200" style={{ top: menuPosition.top, left: menuPosition.left, width: menuPosition.width }}>
            <button type="button" onClick={() => {
        const current = data.find((item) => getItemId(item) === openMenuId);
        setOpenMenuId(null);
        setMenuPosition(null);
        if (current) {
            onEdit(current);
        }
    }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <Pencil className="w-4 h-4"/>
              {t("common.viewDetails")}
            </button>
            <button type="button" onClick={() => {
        const current = data.find((item) => getItemId(item) === openMenuId);
        setOpenMenuId(null);
        setMenuPosition(null);
        if (current) {
            onEdit(current);
        }
    }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <Pencil className="w-4 h-4"/>
              {t("common.edit")}
            </button>
            <button type="button" onClick={() => {
        const current = data.find((item) => getItemId(item) === openMenuId);
        setOpenMenuId(null);
        setMenuPosition(null);
        if (current) {
            setDeleteItem(current);
        }
    }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
              <Trash2 className="w-4 h-4"/>
              {t("common.delete")}
            </button>
          </div>
        </>, document.body)}

      {deleteItem && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("common.confirmTitle")}</h3>
              <p className="text-sm text-gray-600 mb-6">{t("common.confirmDeleteLong")}</p>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setDeleteItem(null)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                  {t("common.cancel")}
                </button>
                <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                  {t("common.delete")}
                </button>
              </div>
            </div>
          </div>
        </div>)}
    </>);
}
