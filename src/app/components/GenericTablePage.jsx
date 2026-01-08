import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { GenericTableList } from "./GenericTableList";
import { useI18n } from "../i18n/i18n";
export function GenericTablePage({ title, description, columns, data, onAdd, onEdit, onDelete, getItemId, isLoading, isSaving, onDownloadExcel, }) {
    const { t } = useI18n();
    const [searchQuery, setSearchQuery] = useState("");
    const searchableColumns = columns.filter((col) => col.searchable !== false);
    const filteredData = data.filter((item) => {
        if (!searchQuery)
            return true;
        return searchableColumns.some((col) => {
            const value = item[col.key];
            if (value === null || value === undefined)
                return false;
            return String(value).toLowerCase().includes(searchQuery.toLowerCase());
        });
    });
    return (<div className="min-h-screen bg-gray-50">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 py-8">
        <div className="mb-6">
          <h2 className="mb-2 text-blue-900">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200">
          <div className="p-4 sm:p-6 border-b-2 border-gray-200 bg-blue-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative w-full sm:flex-1 sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400"/>
                <input type="text" placeholder={t("common.search")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-3 py-2 border-2 border-blue-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" disabled={isLoading}/>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                {isLoading && <span className="text-sm text-gray-500">{t("common.loading")}</span>}
                {onDownloadExcel && (<button type="button" onClick={onDownloadExcel} className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border-2 border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    {t("excel.download")}
                  </button>)}
                <button onClick={onAdd} disabled={isLoading || isSaving} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50">
                  <Plus className="w-4 h-4"/>
                  {t("common.addEntry")}
                </button>
              </div>
            </div>
          </div>

          <GenericTableList columns={columns} data={filteredData} onEdit={onEdit} onDelete={onDelete} getItemId={getItemId} isLoading={isLoading}/>

          {filteredData.length > 0 && (<div className="p-4 border-t-2 border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600 font-medium">
                {t("common.showingEntries", { shown: filteredData.length, total: data.length })}
              </p>
            </div>)}
        </div>
      </div>
    </div>);
}
