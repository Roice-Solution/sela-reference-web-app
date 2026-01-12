import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { ReferenceTableList } from "./ReferenceTableList";
import { AddEditTableDialog } from "./AddEditTableDialog";
import { toast } from "sonner";
import { useI18n } from "../i18n/i18n";
export function TablePage({ category, title, entries, onAddEntry, onEditEntry, onDeleteEntry, }) {
    const { t } = useI18n();
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const handleAddEntry = (entry) => {
        onAddEntry(entry);
        toast.success(t("toasts.entryAdded"));
        setIsAddDialogOpen(false);
    };
    const handleEditEntry = (entry) => {
        if (!editingEntry)
            return;
        onEditEntry(editingEntry.id, entry);
        toast.success(t("toasts.entryUpdated"));
        setEditingEntry(null);
    };
    const handleDeleteEntry = (id) => {
        onDeleteEntry(id);
        toast.success(t("toasts.entryDeleted"));
    };
    const filteredData = entries.filter((entry) => entry.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.value.toLowerCase().includes(searchQuery.toLowerCase()));
    return (<div className="min-h-screen bg-gray-50">
      <div className="w-auto px-4 sm:px-8 py-8">
        <div className="mb-6">
          <h2 className="mb-2 text-blue-900">{title}</h2>
          <p className="text-gray-600">{t("tables.manageReferenceEntries", { title: title.toLowerCase() })}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative w-full sm:flex-1 sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400"/>
                <input type="text" placeholder={t("genericTable.searchBy")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              <button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md hover:shadow-lg">
                <Plus className="w-4 h-4"/>
                {t("common.addEntry")}
              </button>
            </div>
          </div>

          <ReferenceTableList entries={filteredData} onEdit={setEditingEntry} onDelete={handleDeleteEntry}/>

          {filteredData.length > 0 && (<div className="p-4 border-t-2 border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600 font-medium">
                {t("common.showingEntries", { shown: filteredData.length, total: entries.length })}
              </p>
            </div>)}
        </div>
      </div>

      <AddEditTableDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSave={handleAddEntry} category={category} mode="add"/>

      {editingEntry && (<AddEditTableDialog open={!!editingEntry} onOpenChange={(open) => !open && setEditingEntry(null)} onSave={handleEditEntry} category={category} mode="edit" initialData={editingEntry}/>)}
    </div>);
}
