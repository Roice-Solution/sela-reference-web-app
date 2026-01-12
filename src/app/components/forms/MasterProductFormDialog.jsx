import { useId, useState, useEffect } from "react";
import { useI18n } from "../../i18n/i18n";
import { ModalShell } from "../ui/ModalShell";
export function MasterProductFormDialog({ open, onOpenChange, onSave, mode, initialData, }) {
    const { t } = useI18n();
    const formId = useId();
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
    const isDrawer = mode === "edit";
    if (!open) {
        return null;
    }
    return (
        <ModalShell
            open={open}
            onOpenChange={onOpenChange}
            title={mode === "add" ? t("forms.masterProduct.titleAdd") : t("forms.masterProduct.titleEdit")}
            description={mode === "add" ? t("forms.masterProduct.subtitleAdd") : t("forms.masterProduct.subtitleEdit")}
            size="md"
            align={isDrawer ? "right" : "center"}
            footer={
                <>
                    <button type="button" onClick={() => onOpenChange(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-100">
                        {t("common.cancel")}
                    </button>
                    <button type="submit" form={formId} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        {mode === "add" ? t("forms.masterProduct.add") : t("common.saveChanges")}
                    </button>
                </>
            }
        >
            <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "edit" && (<div className="space-y-2">
                <label htmlFor="master_product_code" className="block text-sm font-medium text-gray-700">{t("forms.masterProduct.productCode")}</label>
                <input id="master_product_code" value={formData.master_product_code} onChange={(e) => setFormData({ ...formData, master_product_code: e.target.value })} required disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"/>
              </div>)}

            <div className="space-y-2">
              <label htmlFor="master_product_name" className="block text-sm font-medium text-gray-700">{t("forms.masterProduct.productName")}</label>
              <input id="master_product_name" value={formData.master_product_name} onChange={(e) => setFormData({ ...formData, master_product_name: e.target.value })} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>

            <div className="space-y-2">
              <label htmlFor="department_name" className="block text-sm font-medium text-gray-700">{t("forms.masterProduct.departmentName")}</label>
              <input id="department_name" value={formData.department_name} onChange={(e) => setFormData({ ...formData, department_name: e.target.value })} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>

            <div className="space-y-2">
              <label htmlFor="master_product_category" className="block text-sm font-medium text-gray-700">{t("forms.masterProduct.productCategory")}</label>
              <input id="master_product_category" value={formData.master_product_category} onChange={(e) => setFormData({ ...formData, master_product_category: e.target.value })} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            </form>
        </ModalShell>
    );
}
