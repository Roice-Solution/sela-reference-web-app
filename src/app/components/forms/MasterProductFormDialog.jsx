import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useI18n } from "../../i18n/i18n";
export function MasterProductFormDialog({ open, onOpenChange, onSave, mode, initialData, }) {
    const { t } = useI18n();
    const [formData, setFormData] = useState({
        master_product_code: "",
        department_name: "",
        master_product_name: "",
        master_product_category: "",
    });
    useEffect(() => {
        if (mode === "edit" && initialData) {
            setFormData(initialData);
        }
        else {
            setFormData({
                master_product_code: "",
                department_name: "",
                master_product_name: "",
                master_product_category: "",
            });
        }
    }, [mode, initialData, open]);
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    if (!open) {
        return null;
    }
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border-2 border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b-2 border-blue-100 bg-blue-50">
          <div>
            <h2 className="text-lg font-bold text-blue-900">{mode === "add" ? t("forms.masterProduct.titleAdd") : t("forms.masterProduct.titleEdit")}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {mode === "add" ? t("forms.masterProduct.subtitleAdd") : t("forms.masterProduct.subtitleEdit")}
            </p>
          </div>
          <button onClick={() => onOpenChange(false)} className="p-1 hover:bg-blue-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500"/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="space-y-4 px-6 py-4">
            {mode === "edit" && (<div className="space-y-2">
                <label htmlFor="master_product_code" className="block text-sm font-medium text-gray-700">{t("forms.masterProduct.productCode")}</label>
                <input id="master_product_code" value={formData.master_product_code} onChange={(e) => setFormData({ ...formData, master_product_code: e.target.value })} required disabled className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"/>
              </div>)}

            <div className="space-y-2">
              <label htmlFor="master_product_name" className="block text-sm font-medium text-gray-700">{t("forms.masterProduct.productName")}</label>
              <input id="master_product_name" value={formData.master_product_name} onChange={(e) => setFormData({ ...formData, master_product_name: e.target.value })} required className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>

            <div className="space-y-2">
              <label htmlFor="department_name" className="block text-sm font-medium text-gray-700">{t("forms.masterProduct.departmentName")}</label>
              <input id="department_name" value={formData.department_name} onChange={(e) => setFormData({ ...formData, department_name: e.target.value })} required className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>

            <div className="space-y-2">
              <label htmlFor="master_product_category" className="block text-sm font-medium text-gray-700">{t("forms.masterProduct.productCategory")}</label>
              <input id="master_product_category" value={formData.master_product_category} onChange={(e) => setFormData({ ...formData, master_product_category: e.target.value })} required className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t-2 border-gray-200 px-6 py-4 bg-gray-50">
            <button type="button" className="px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {mode === "add" ? t("forms.masterProduct.add") : t("common.saveChanges")}
            </button>
          </div>
        </form>
      </div>
    </div>);
}
