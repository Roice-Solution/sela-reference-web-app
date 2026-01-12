import { useId, useMemo, useState, useEffect } from "react";
import { useI18n } from "../../i18n/i18n";
import { ModalShell } from "../ui/ModalShell";
import { SearchableSelect } from "../ui/SearchableSelect";
export function ProductPerCompanyFormDialog({ open, onOpenChange, onSave, mode, initialData, companies, masterProducts, }) {
    const { t } = useI18n();
    const formId = useId();
    const [formData, setFormData] = useState({
        company_code: "",
        company_product_name: "",
        master_product_code: "",
    });
    useEffect(() => {
        if (mode === "edit" && initialData) {
            setFormData(initialData);
        }
        else {
            setFormData({
                company_code: "",
                company_product_name: "",
                master_product_code: "",
            });
        }
    }, [mode, initialData, open]);
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    const isSaveDisabled = !formData.company_code || !formData.master_product_code || !formData.company_product_name?.trim();
    const companyOptions = useMemo(() => companies.map((company) => ({
        value: company.company_code,
        label: company.company_name_en || company.company_name || company.company_code,
        subLabel: company.company_code,
        searchValue: `${company.company_name_en || ""} ${company.company_name || ""} ${company.company_code || ""}`.trim(),
    })), [companies]);
    const masterProductOptions = useMemo(() => masterProducts.map((product) => ({
        value: product.master_product_code,
        label: product.master_product_name || product.master_product_code,
        subLabel: product.master_product_code,
        searchValue: `${product.master_product_name || ""} ${product.master_product_code || ""}`.trim(),
    })), [masterProducts]);
    const isDrawer = mode === "edit";
    if (!open) {
        return null;
    }
    return (
        <ModalShell
            open={open}
            onOpenChange={onOpenChange}
            title={mode === "add" ? t("forms.productPerCompany.titleAdd") : t("forms.productPerCompany.titleEdit")}
            description={mode === "add" ? t("forms.productPerCompany.subtitleAdd") : t("forms.productPerCompany.subtitleEdit")}
            size="lg"
            align={isDrawer ? "right" : "center"}
            footer={
                <>
                    <button type="button" onClick={() => onOpenChange(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-100">
                        {t("common.cancel")}
                    </button>
                    <button type="submit" form={formId} disabled={isSaveDisabled} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                        {mode === "add" ? t("forms.productPerCompany.add") : t("common.saveChanges")}
                    </button>
                </>
            }
        >
            <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <label htmlFor="company_code" className="block text-sm font-medium text-gray-700">{t("forms.productPerCompany.company")}</label>
              <SearchableSelect id="company_code" value={formData.company_code} onChange={(value) => setFormData({ ...formData, company_code: value })} options={companyOptions} placeholder={t("forms.productPerCompany.selectCompany")} emptyText={t("common.noResults")} />
            </div>

            <div className="space-y-2">
              <label htmlFor="master_product_code" className="block text-sm font-medium text-gray-700">{t("forms.productPerCompany.masterProduct")}</label>
              <SearchableSelect id="master_product_code" value={formData.master_product_code} onChange={(value) => setFormData({ ...formData, master_product_code: value })} options={masterProductOptions} placeholder={t("forms.productPerCompany.selectMasterProduct")} emptyText={t("common.noResults")} />
            </div>

            <div className="space-y-2">
              <label htmlFor="company_product_name" className="block text-sm font-medium text-gray-700">{t("forms.productPerCompany.companyProductName")}</label>
              <input id="company_product_name" value={formData.company_product_name} onChange={(e) => setFormData({ ...formData, company_product_name: e.target.value })} required placeholder={t("forms.productPerCompany.companyProductPlaceholder")} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            </form>
        </ModalShell>
    );
}
