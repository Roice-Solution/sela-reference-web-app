import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useI18n } from "../i18n/i18n";
export function AddEditTableDialog({ open, onOpenChange, onSave, category, mode, initialData, }) {
    const { t } = useI18n();
    const [formData, setFormData] = useState({
        code: "",
        description: "",
        value: "",
        status: "active",
    });
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (mode === "edit" && initialData) {
            setFormData({
                code: initialData.code,
                description: initialData.description,
                value: initialData.value,
                status: initialData.status,
            });
        }
        else {
            setFormData({
                code: "",
                description: "",
                value: "",
                status: "active",
            });
        }
        setErrors({});
    }, [mode, initialData, open]);
    const validate = () => {
        const newErrors = {};
        if (!formData.code.trim()) {
            newErrors.code = t("referenceTable.code") + " " + t("common.required");
        }
        if (!formData.description.trim()) {
            newErrors.description = t("referenceTable.description") + " " + t("common.required");
        }
        if (!formData.value.trim()) {
            newErrors.value = t("referenceTable.value") + " " + t("common.required");
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        onSave({
            ...formData,
            category,
        });
        setFormData({
            code: "",
            description: "",
            value: "",
            status: "active",
        });
    };
    if (!open) {
        return null;
    }
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border-2 border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b-2 border-blue-100 bg-blue-50">
          <div>
            <h2 className="text-lg font-bold text-blue-900">{mode === "add" ? t("referenceTable.dialogTitleAdd") : t("referenceTable.dialogTitleEdit")}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {mode === "add"
            ? t("referenceTable.dialogAddDescription", { category })
            : t("referenceTable.dialogEditDescription", { category })}
            </p>
          </div>
          <button type="button" onClick={() => onOpenChange(false)} className="p-1 hover:bg-blue-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500"/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="space-y-4 px-6 py-4">
            <div className="space-y-2">
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                {t("referenceTable.code")} <span className="text-red-500">*</span>
              </label>
              <input id="code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder={t("referenceTable.codePlaceholder")} className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.code ? "border-red-500" : "border-gray-200"}`}/>
              {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                {t("referenceTable.description")} <span className="text-red-500">*</span>
              </label>
              <textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder={t("referenceTable.descriptionPlaceholder")} className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.description ? "border-red-500" : "border-gray-200"}`} rows={3}/>
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                {t("referenceTable.value")} <span className="text-red-500">*</span>
              </label>
              <input id="value" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} placeholder={t("referenceTable.valuePlaceholder")} className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.value ? "border-red-500" : "border-gray-200"}`}/>
              {errors.value && <p className="text-red-500 text-sm">{errors.value}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">{t("common.status")}</label>
              <select id="status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="active">{t("common.active")}</option>
                <option value="inactive">{t("common.inactive")}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t-2 border-gray-200 px-6 py-4 bg-gray-50">
            <button type="button" className="px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {mode === "add" ? t("common.addEntry") : t("common.saveChanges")}
            </button>
          </div>
        </form>
      </div>
    </div>);
}
