import { format, parseISO } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { useI18n } from "../i18n/i18n";
export function ReferenceTableList({ entries, onEdit, onDelete }) {
    const { t } = useI18n();
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
    if (entries.length === 0) {
        return (<div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
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
              <th className="px-4 sm:px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">{t("columns.code")}</th>
              <th className="px-4 sm:px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("columns.description")}</th>
              <th className="px-4 sm:px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[170px]">{t("columns.value")}</th>
              <th className="px-4 sm:px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">{t("common.status")}</th>
              <th className="px-4 sm:px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">{t("columns.created")}</th>
              <th className="px-4 sm:px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">{t("columns.updated")}</th>
              <th className="px-4 sm:px-8 py-3 w-[140px]"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map((entry) => (<tr key={entry.id} className="hover:bg-gray-50">
                <td className="px-4 sm:px-8 py-4 whitespace-nowrap">
                  <code className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm font-medium border border-blue-200">{entry.code}</code>
                </td>
                <td className="px-4 sm:px-8 py-4 whitespace-nowrap">{entry.description}</td>
                <td className="px-4 sm:px-8 py-4 whitespace-nowrap">{entry.value}</td>
                <td className="px-4 sm:px-8 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${entry.status === "active" ? "bg-green-50 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"}`}>
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
